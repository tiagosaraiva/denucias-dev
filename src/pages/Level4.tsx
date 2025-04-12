
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from '@/components/GameLayout';
import { Clue } from '@/components/Clue';
import { GameDialog } from '@/components/Dialog';
import { useGameContext } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Level4 = () => {
  const navigate = useNavigate();
  const { 
    addToInventory, 
    removeFromInventory,
    isPuzzleSolved, 
    solvePuzzle, 
    advanceLevel,
    gameState 
  } = useGameContext();
  
  // Dialog states
  const [showControlPanelDialog, setShowControlPanelDialog] = useState(false);
  const [showMirrorDialog, setShowMirrorDialog] = useState(false);
  const [showPedestalDialog, setShowPedestalDialog] = useState(false);
  const [showCrystalDialog, setShowCrystalDialog] = useState(false);
  const [showDoorDialog, setShowDoorDialog] = useState(false);
  
  // Puzzle states
  const [mirrorAligned, setMirrorAligned] = useState(isPuzzleSolved('mirror'));
  const [crystalCharged, setCrystalCharged] = useState(isPuzzleSolved('crystal'));
  const [pedestalActivated, setPedestalActivated] = useState(isPuzzleSolved('pedestal'));
  const [doorActivated, setDoorActivated] = useState(isPuzzleSolved('ancientDoor'));
  
  // Mirror puzzle
  const [mirrorRotation, setMirrorRotation] = useState(0);
  
  const handleRotateMirror = (direction: 'left' | 'right') => {
    const newRotation = direction === 'left' 
      ? (mirrorRotation - 45) % 360 
      : (mirrorRotation + 45) % 360;
    
    setMirrorRotation(newRotation);
    
    if (newRotation === 135 && !mirrorAligned) {
      solvePuzzle('mirror');
      setMirrorAligned(true);
      toast.success("The mirror is perfectly aligned! A beam of light reflects to the crystal.");
    } else if (mirrorAligned && newRotation !== 135) {
      setMirrorAligned(false);
    }
  };
  
  const handleExamineCrystal = () => {
    if (mirrorAligned && !crystalCharged) {
      solvePuzzle('crystal');
      setCrystalCharged(true);
      addToInventory({
        id: 'charged_crystal',
        name: 'Charged Crystal',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        description: 'A crystal glowing with mysterious energy.'
      });
      toast.success("The crystal absorbs the light and begins to glow!");
    }
  };
  
  const handleExaminePedestal = () => {
    const hasCrystal = gameState.inventory.some(item => item.id === 'charged_crystal');
    
    if (hasCrystal && !pedestalActivated) {
      solvePuzzle('pedestal');
      setPedestalActivated(true);
      removeFromInventory('charged_crystal');
      toast.success("You place the crystal on the pedestal. It fits perfectly!");
    }
  };
  
  const handleCheckDoor = () => {
    if (pedestalActivated && !doorActivated) {
      solvePuzzle('ancientDoor');
      setDoorActivated(true);
      toast.success("The ancient door begins to glow and slowly opens!");
      setTimeout(() => {
        advanceLevel();
        navigate('/level/5');
      }, 1500);
    }
  };
  
  return (
    <GameLayout levelTitle="The Ancient Chamber">
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div 
          className="w-full max-w-3xl aspect-[16/9] bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-inner relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Room background */}
          <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-white">
            <h2 className="text-2xl font-bold mb-8 text-center">The Ancient Chamber</h2>
            <p className="text-center max-w-md mb-8">
              You've discovered an ancient chamber filled with strange mechanisms. There's a control panel, a mirror, a crystal, and a pedestal in front of a massive door.
            </p>
            
            {/* Interactive elements */}
            <div className="relative w-full h-[300px]">
              {/* Control Panel */}
              <Clue 
                id="controlPanel"
                x="20%"
                y="50%"
                width="100px"
                height="60px"
                tooltip="An ancient control panel with symbols"
                onClick={() => setShowControlPanelDialog(true)}
              >
                <div className="w-[100px] h-[60px] bg-stone-600 rounded-md flex items-center justify-center p-2">
                  <div className="grid grid-cols-3 gap-1 w-full h-full">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="bg-stone-700 rounded-sm"></div>
                    ))}
                  </div>
                </div>
              </Clue>
              
              {/* Mirror */}
              <Clue 
                id="mirror"
                x="50%"
                y="60%"
                width="80px"
                height="80px"
                tooltip="An adjustable mirror on a stand"
                onClick={() => setShowMirrorDialog(true)}
              >
                <div className="w-[80px] h-[80px] flex items-center justify-center">
                  <div 
                    className={`w-[60px] h-[60px] bg-blue-200 bg-opacity-50 rounded-md transform rotate-[${mirrorRotation}deg] ${mirrorAligned ? 'ring-2 ring-yellow-400' : ''}`}
                  ></div>
                </div>
              </Clue>
              
              {/* Crystal */}
              <Clue 
                id="crystal"
                x="80%"
                y="50%"
                width="40px"
                height="60px"
                tooltip="A strange crystal on a small stand"
                onClick={() => mirrorAligned ? handleExamineCrystal() : setShowCrystalDialog(true)}
              >
                <div className="w-[40px] h-[60px] flex items-center justify-center">
                  <div 
                    className={`w-0 h-0 border-l-[20px] border-r-[20px] border-b-[40px] border-transparent border-b-blue-300 ${crystalCharged ? 'animate-pulse bg-blue-400' : ''}`}
                  ></div>
                </div>
              </Clue>
              
              {/* Pedestal */}
              <Clue 
                id="pedestal"
                x="50%"
                y="30%"
                width="60px"
                height="60px"
                tooltip="A stone pedestal with a crystal-shaped indentation"
                onClick={() => setShowPedestalDialog(true)}
              >
                <div className="w-[60px] h-[60px] bg-stone-500 rounded-md flex items-center justify-center">
                  {pedestalActivated ? (
                    <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-transparent border-b-blue-400 animate-pulse"></div>
                  ) : (
                    <div className="w-[30px] h-[20px] bg-stone-700 clip-path-triangle"></div>
                  )}
                </div>
              </Clue>
              
              {/* Ancient Door */}
              <Clue 
                id="door"
                x="50%"
                y="10%"
                width="120px"
                height="40px"
                tooltip="A massive ancient door with strange symbols"
                onClick={() => setShowDoorDialog(true)}
              >
                <div 
                  className={`w-[120px] h-[40px] bg-stone-800 rounded-md flex items-center justify-center ${doorActivated ? 'bg-blue-900' : ''}`}
                >
                  <div className={`w-[100px] h-[30px] border border-stone-700 rounded-sm ${doorActivated ? 'border-blue-400' : ''}`}></div>
                </div>
              </Clue>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Dialogs */}
      <GameDialog 
        title="Ancient Control Panel"
        description="A panel with strange symbols and markings."
        isOpen={showControlPanelDialog}
        onClose={() => setShowControlPanelDialog(false)}
      >
        <div className="p-4 bg-stone-800 rounded-md text-stone-200">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-12 h-12 bg-stone-700 rounded-md flex items-center justify-center">
                <div className="text-xl font-rune">{String.fromCharCode(65 + i)}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm">
            The control panel has symbols that match those found around the chamber. One symbol is highlighted and seems to point to the mirror.
          </p>
          <p className="mt-2 text-xs text-stone-400">
            An inscription below reads: "Align the reflector to channel the ancient light."
          </p>
        </div>
      </GameDialog>
      
      <GameDialog 
        title="Adjustable Mirror"
        description="A mirror that can be rotated on its stand."
        isOpen={showMirrorDialog}
        onClose={() => setShowMirrorDialog(false)}
      >
        <div className="p-4">
          <div className="flex justify-center mb-6">
            <div 
              className={`w-24 h-24 bg-blue-200 bg-opacity-50 rounded-md transform rotate-[${mirrorRotation}deg] transition-transform duration-300 ${mirrorAligned ? 'ring-2 ring-yellow-400' : ''}`}
            ></div>
          </div>
          
          <p className="mb-4 text-center">
            {mirrorAligned 
              ? "The mirror is perfectly aligned! A beam of light reflects onto the crystal." 
              : "A mirror that can be rotated. It seems designed to reflect light in a specific direction."}
          </p>
          
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => handleRotateMirror('left')}
              variant="outline"
              disabled={mirrorAligned && pedestalActivated}
            >
              Rotate Left
            </Button>
            
            <Button
              onClick={() => handleRotateMirror('right')}
              variant="outline"
              disabled={mirrorAligned && pedestalActivated}
            >
              Rotate Right
            </Button>
          </div>
        </div>
      </GameDialog>
      
      <GameDialog 
        title="Strange Crystal"
        description="A translucent crystal on a small stand."
        isOpen={showCrystalDialog}
        onClose={() => setShowCrystalDialog(false)}
      >
        {crystalCharged ? (
          <p>The crystal is now glowing with energy. You've already collected it.</p>
        ) : mirrorAligned ? (
          <div className="text-center">
            <p>The crystal is now bathed in light from the mirror. It seems to be absorbing the energy.</p>
            <div className="mt-4">
              <Button onClick={handleExamineCrystal}>
                Take Crystal
              </Button>
            </div>
          </div>
        ) : (
          <p>A strange, translucent crystal. It seems designed to capture and store energy, but it's currently dormant.</p>
        )}
      </GameDialog>
      
      <GameDialog 
        title="Stone Pedestal"
        description="A pedestal with a crystal-shaped indentation."
        isOpen={showPedestalDialog}
        onClose={() => setShowPedestalDialog(false)}
        confirmText={gameState.inventory.some(item => item.id === 'charged_crystal') ? "Place Crystal" : undefined}
        onConfirm={gameState.inventory.some(item => item.id === 'charged_crystal') ? handleExaminePedestal : undefined}
      >
        {pedestalActivated ? (
          <div className="text-center">
            <p>The charged crystal sits perfectly in the pedestal, glowing with energy. A beam of light extends from the crystal to the ancient door.</p>
          </div>
        ) : gameState.inventory.some(item => item.id === 'charged_crystal') ? (
          <p>The pedestal has an indentation that looks like it would fit the charged crystal perfectly.</p>
        ) : (
          <p>A stone pedestal with a triangular indentation on top. It looks like it's designed to hold something specific.</p>
        )}
      </GameDialog>
      
      <GameDialog 
        title="Ancient Door"
        description="A massive stone door with intricate symbols."
        isOpen={showDoorDialog}
        onClose={() => setShowDoorDialog(false)}
        confirmText={pedestalActivated && !doorActivated ? "Approach Door" : undefined}
        onConfirm={pedestalActivated && !doorActivated ? handleCheckDoor : undefined}
      >
        {doorActivated ? (
          <p>The ancient door is now active, glowing with blue energy. It's slowly opening, revealing a passage to the final chamber.</p>
        ) : pedestalActivated ? (
          <p>The door is beginning to respond to the energy from the crystal pedestal. Approaching it might trigger some mechanism.</p>
        ) : (
          <p>A massive stone door with intricate symbols carved into its surface. It appears to be sealed shut, with no obvious mechanism to open it.</p>
        )}
      </GameDialog>
    </GameLayout>
  );
};

export default Level4;
