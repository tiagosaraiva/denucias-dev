
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from '@/components/GameLayout';
import { Clue } from '@/components/Clue';
import { GameDialog } from '@/components/Dialog';
import { useGameContext } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Level2 = () => {
  const navigate = useNavigate();
  const { 
    addToInventory, 
    isPuzzleSolved, 
    solvePuzzle, 
    advanceLevel,
    gameState
  } = useGameContext();
  
  // Dialog states
  const [showPaintingDialog, setShowPaintingDialog] = useState(false);
  const [showColorPuzzleDialog, setShowColorPuzzleDialog] = useState(false);
  const [showVaseDialog, setShowVaseDialog] = useState(false);
  const [showDoorDialog, setShowDoorDialog] = useState(false);

  // Puzzle states
  const [colorSequence, setColorSequence] = useState<string[]>([]);
  const [colorPuzzleSolved, setColorPuzzleSolved] = useState(isPuzzleSolved('colorPuzzle'));
  const [keyFound, setKeyFound] = useState(isPuzzleSolved('silverKey'));
  
  const correctSequence = ['red', 'blue', 'green', 'yellow'];
  
  const handleColorClick = (color: string) => {
    if (colorPuzzleSolved) return;
    
    const newSequence = [...colorSequence, color];
    setColorSequence(newSequence);
    
    if (newSequence.length === correctSequence.length) {
      const isCorrect = newSequence.every((c, i) => c === correctSequence[i]);
      
      if (isCorrect) {
        solvePuzzle('colorPuzzle');
        setColorPuzzleSolved(true);
        toast.success("The color sequence is correct!");
        setTimeout(() => {
          setShowColorPuzzleDialog(false);
          setShowVaseDialog(true);
        }, 1000);
      } else {
        toast.error("Incorrect sequence. Try again.");
        setColorSequence([]);
      }
    }
  };
  
  const handleVaseInspect = () => {
    if (!colorPuzzleSolved) {
      toast.info("There seems to be something inside the vase, but you can't reach it.");
      return;
    }
    
    if (!keyFound) {
      solvePuzzle('silverKey');
      setKeyFound(true);
      addToInventory({
        id: 'silver_key',
        name: 'Silver Key',
        image: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        description: 'A silver key with unusual markings.'
      });
      toast.success("You found a silver key!");
    }
  };
  
  const handleDoorTry = () => {
    if (keyFound) {
      solvePuzzle('galleryDoor');
      toast.success("The door unlocks!");
      setTimeout(() => {
        advanceLevel();
        navigate('/level/3');
      }, 1500);
    } else {
      toast.error("The door is locked. You need to find a key.");
    }
  };
  
  return (
    <GameLayout levelTitle="The Art Gallery">
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div 
          className="w-full max-w-3xl aspect-[16/9] bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg shadow-inner relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Room background */}
          <div className="absolute inset-0 p-8 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-8 text-center">The Art Gallery</h2>
            <p className="text-center max-w-md mb-8">
              You've entered a small art gallery. Beautiful paintings adorn the walls, and there's an interactive color puzzle in the center.
            </p>
            
            {/* Interactive elements */}
            <div className="relative w-full h-[300px]">
              {/* Paintings */}
              <Clue 
                id="painting"
                x="20%"
                y="30%"
                width="100px"
                height="80px"
                tooltip="A colorful abstract painting"
                onClick={() => setShowPaintingDialog(true)}
              >
                <div className="w-[100px] h-[80px] bg-white rounded-md p-1">
                  <div className="w-full h-full bg-gradient-to-br from-red-500 via-blue-500 to-green-500 rounded-sm"></div>
                </div>
              </Clue>
              
              {/* Color Puzzle */}
              <Clue 
                id="colorPuzzle"
                x="50%"
                y="60%"
                width="150px"
                height="80px"
                tooltip="An interactive color puzzle panel"
                onClick={() => setShowColorPuzzleDialog(true)}
              >
                <div className="w-[150px] h-[80px] bg-gray-700 rounded-md flex items-center justify-center gap-2 p-2">
                  {['red', 'blue', 'green', 'yellow'].map((color) => (
                    <div 
                      key={color} 
                      className={`w-8 h-8 rounded-full bg-${color}-500`}
                    ></div>
                  ))}
                </div>
              </Clue>
              
              {/* Vase */}
              <Clue 
                id="vase"
                x="80%"
                y="50%"
                width="60px"
                height="100px"
                tooltip="A decorative ceramic vase"
                onClick={() => colorPuzzleSolved ? handleVaseInspect() : setShowVaseDialog(true)}
              >
                <div className="w-[60px] h-[100px] bg-blue-200 rounded-t-full rounded-b-lg flex items-center justify-center">
                  <div className="w-[40px] h-[80px] bg-blue-300 rounded-t-full rounded-b-lg"></div>
                </div>
              </Clue>
              
              {/* Door */}
              <Clue 
                id="door"
                x="50%"
                y="20%"
                width="80px"
                height="120px"
                tooltip="An ornate door with a silver lock"
                onClick={() => setShowDoorDialog(true)}
              >
                <div className="w-[80px] h-[120px] bg-amber-800 rounded-t-md flex flex-col items-center justify-center">
                  <div className="w-4 h-4 bg-gray-400 rounded-full absolute right-2"></div>
                </div>
              </Clue>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Dialogs */}
      <GameDialog 
        title="Abstract Painting"
        description="A beautiful modern abstract painting."
        isOpen={showPaintingDialog}
        onClose={() => setShowPaintingDialog(false)}
      >
        <div className="p-4 rounded-md">
          <div className="w-full h-[200px] bg-gradient-to-br from-red-500 via-blue-500 to-green-500 rounded-md mb-4"></div>
          <p className="mt-2 text-sm">
            The painting is titled "Sequence" by an unknown artist. You notice small numbered dots on each color segment:
          </p>
          <ul className="mt-2 text-sm list-disc pl-5">
            <li>1 - Red section</li>
            <li>2 - Blue section</li>
            <li>3 - Green section</li>
            <li>4 - Yellow section (barely visible in the corner)</li>
          </ul>
        </div>
      </GameDialog>
      
      <GameDialog 
        title="Color Puzzle"
        description="An interactive panel with colored buttons."
        isOpen={showColorPuzzleDialog}
        onClose={() => setShowColorPuzzleDialog(false)}
      >
        {colorPuzzleSolved ? (
          <div className="text-center p-4">
            <p>The puzzle is solved. The panel has deactivated.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p>Press the buttons in the correct sequence:</p>
            <div className="flex justify-center gap-4 mb-4">
              {colorSequence.map((color, i) => (
                <div 
                  key={i} 
                  className={`w-8 h-8 rounded-full bg-${color}-500`}
                ></div>
              ))}
              {[...Array(correctSequence.length - colorSequence.length)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-8 h-8 rounded-full bg-gray-300"
                ></div>
              ))}
            </div>
            
            <div className="flex justify-center gap-4">
              {['red', 'blue', 'green', 'yellow'].map((color) => (
                <Button 
                  key={color} 
                  onClick={() => handleColorClick(color)}
                  className={`w-12 h-12 rounded-full bg-${color}-500 hover:bg-${color}-600 p-0`}
                />
              ))}
            </div>
          </div>
        )}
      </GameDialog>
      
      <GameDialog 
        title="Ceramic Vase"
        description="A beautiful blue ceramic vase."
        isOpen={showVaseDialog}
        onClose={() => setShowVaseDialog(false)}
      >
        {keyFound ? (
          <p>The vase is empty. You've already taken the silver key that was inside.</p>
        ) : colorPuzzleSolved ? (
          <div className="text-center">
            <p>The vase tilts slightly, revealing something inside.</p>
            <div className="mt-4 flex justify-center">
              <Button onClick={handleVaseInspect}>Reach Inside</Button>
            </div>
          </div>
        ) : (
          <p>A decorative ceramic vase. It's firmly attached to its pedestal, but it looks like it might move if something were activated.</p>
        )}
      </GameDialog>
      
      <GameDialog 
        title="Ornate Door"
        description="A beautifully crafted door with a silver lock."
        isOpen={showDoorDialog}
        onClose={() => setShowDoorDialog(false)}
        confirmText={keyFound ? "Use Silver Key" : undefined}
        onConfirm={keyFound ? handleDoorTry : undefined}
      >
        <p>
          The door has an ornate silver lock that requires a matching key.
          {keyFound ? " Your silver key looks like it might fit." : " You'll need to find the right key."}
        </p>
      </GameDialog>
    </GameLayout>
  );
};

export default Level2;
