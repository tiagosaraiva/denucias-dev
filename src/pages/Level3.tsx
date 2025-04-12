
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLayout } from '@/components/GameLayout';
import { Clue } from '@/components/Clue';
import { GameDialog } from '@/components/Dialog';
import { useGameContext } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Level3 = () => {
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
  const [showComputerDialog, setShowComputerDialog] = useState(false);
  const [showLockerDialog, setShowLockerDialog] = useState(false);
  const [showWhiteboardDialog, setShowWhiteboardDialog] = useState(false);
  const [showDoorDialog, setShowDoorDialog] = useState(false);
  
  // Puzzle states
  const [password, setPassword] = useState('');
  const [computerHacked, setComputerHacked] = useState(isPuzzleSolved('computer'));
  const [accessCard, setAccessCard] = useState(isPuzzleSolved('accessCard'));
  const [doorOpen, setDoorOpen] = useState(isPuzzleSolved('labDoor'));
  
  const handlePasswordSubmit = () => {
    if (password.toLowerCase() === 'algorithm') {
      solvePuzzle('computer');
      setComputerHacked(true);
      toast.success("Access granted! You've unlocked the system.");
    } else {
      toast.error("Incorrect password. Access denied.");
    }
  };
  
  const handleLockerOpen = () => {
    if (computerHacked && !accessCard) {
      solvePuzzle('accessCard');
      setAccessCard(true);
      addToInventory({
        id: 'access_card',
        name: 'Access Card',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        description: 'A security access card for the laboratory.'
      });
      toast.success("You found an access card!");
    }
  };
  
  const handleUseDoor = () => {
    if (gameState.inventory.some(item => item.id === 'access_card')) {
      solvePuzzle('labDoor');
      setDoorOpen(true);
      removeFromInventory('access_card');
      toast.success("The door unlocks with your access card!");
      setTimeout(() => {
        advanceLevel();
        navigate('/level/4');
      }, 1500);
    } else {
      toast.error("You need an access card to open this door.");
    }
  };
  
  return (
    <GameLayout levelTitle="The Laboratory">
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div 
          className="w-full max-w-3xl aspect-[16/9] bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg shadow-inner relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Room background */}
          <div className="absolute inset-0 p-8 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-8 text-center">The Laboratory</h2>
            <p className="text-center max-w-md mb-8">
              You've entered a high-tech laboratory. There's a computer, a locked equipment locker, and a security door.
            </p>
            
            {/* Interactive elements */}
            <div className="relative w-full h-[300px]">
              {/* Computer */}
              <Clue 
                id="computer"
                x="30%"
                y="50%"
                width="100px"
                height="80px"
                tooltip="A laboratory computer terminal"
                onClick={() => setShowComputerDialog(true)}
              >
                <div className="w-[100px] h-[80px] bg-gray-800 rounded-md flex flex-col">
                  <div className="h-[60px] bg-blue-900 m-1 rounded-sm flex items-center justify-center">
                    <div className={`text-xs text-blue-300 font-mono ${computerHacked ? '' : 'animate-pulse'}`}>
                      {computerHacked ? 'UNLOCKED' : 'LOCKED'}
                    </div>
                  </div>
                  <div className="h-[20px] bg-gray-700 mx-1 mb-1 rounded-sm"></div>
                </div>
              </Clue>
              
              {/* Equipment Locker */}
              <Clue 
                id="locker"
                x="70%"
                y="50%"
                width="80px"
                height="120px"
                tooltip="A secure equipment locker"
                onClick={() => setShowLockerDialog(true)}
              >
                <div className="w-[80px] h-[120px] bg-gray-400 rounded-md flex items-center justify-center">
                  <div className={`w-4 h-4 rounded-full ${computerHacked ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              </Clue>
              
              {/* Whiteboard */}
              <Clue 
                id="whiteboard"
                x="30%"
                y="20%"
                width="120px"
                height="60px"
                tooltip="A whiteboard with notes"
                onClick={() => setShowWhiteboardDialog(true)}
              >
                <div className="w-[120px] h-[60px] bg-white rounded-md border border-gray-300"></div>
              </Clue>
              
              {/* Security Door */}
              <Clue 
                id="door"
                x="70%"
                y="20%"
                width="80px"
                height="100px"
                tooltip="A high-security laboratory door"
                onClick={() => setShowDoorDialog(true)}
              >
                <div className="w-[80px] h-[100px] bg-gray-600 rounded-md flex items-center justify-center">
                  <div className="w-6 h-10 bg-gray-800 rounded-sm"></div>
                </div>
              </Clue>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Dialogs */}
      <GameDialog 
        title="Computer Terminal"
        description="A laboratory computer system."
        isOpen={showComputerDialog}
        onClose={() => setShowComputerDialog(false)}
        confirmText={computerHacked ? undefined : "Login"}
        onConfirm={computerHacked ? undefined : handlePasswordSubmit}
      >
        <div className="p-4 bg-gray-900 rounded-md text-gray-100 font-mono">
          {computerHacked ? (
            <div className="space-y-4">
              <p className="text-green-400">ACCESS GRANTED</p>
              <p>User: Dr. J. Mitchell</p>
              <p>Status: All laboratory systems unlocked</p>
              <p className="text-gray-400">- Equipment locker released</p>
              <p className="text-gray-400">- Lab data accessible</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-400">LAB-OS v4.2</p>
              <p className="text-red-400">ACCESS REQUIRED</p>
              <div className="mt-4">
                <p className="mb-2">Password:</p>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Hint: The science of problem-solving with steps</p>
            </div>
          )}
        </div>
      </GameDialog>
      
      <GameDialog 
        title="Equipment Locker"
        description="A secure storage locker for laboratory equipment."
        isOpen={showLockerDialog}
        onClose={() => setShowLockerDialog(false)}
        confirmText={computerHacked && !accessCard ? "Open Locker" : undefined}
        onConfirm={computerHacked && !accessCard ? handleLockerOpen : undefined}
      >
        {accessCard ? (
          <p>The locker is open and empty. You've already taken the access card.</p>
        ) : computerHacked ? (
          <p>The locker's electronic lock shows a green light. It can now be opened.</p>
        ) : (
          <p>The locker is electronically locked with a red indicator light. It seems to be connected to the laboratory's computer system.</p>
        )}
      </GameDialog>
      
      <GameDialog 
        title="Whiteboard"
        description="A whiteboard with laboratory notes."
        isOpen={showWhiteboardDialog}
        onClose={() => setShowWhiteboardDialog(false)}
      >
        <div className="p-4 bg-white rounded-md">
          <p className="font-handwriting">Meeting notes:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Update security protocols</li>
            <li>Remember to use the new password system</li>
            <li>Today's password is based on our research topic</li>
          </ul>
          <p className="font-handwriting mt-4">Research Topics:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><span className="line-through">Neural Networks</span></li>
            <li><span className="font-bold">Algorithm Development</span></li>
            <li><span className="line-through">Quantum Computing</span></li>
          </ul>
        </div>
      </GameDialog>
      
      <GameDialog 
        title="Security Door"
        description="A high-security door with a card reader."
        isOpen={showDoorDialog}
        onClose={() => setShowDoorDialog(false)}
        confirmText={gameState.inventory.some(item => item.id === 'access_card') ? "Use Access Card" : undefined}
        onConfirm={gameState.inventory.some(item => item.id === 'access_card') ? handleUseDoor : undefined}
      >
        <div className="space-y-4">
          <p>A reinforced security door with an electronic card reader.</p>
          {gameState.inventory.some(item => item.id === 'access_card') ? (
            <p>You have an access card that might work with this door.</p>
          ) : (
            <p>You'll need an authorized access card to open this door.</p>
          )}
        </div>
      </GameDialog>
    </GameLayout>
  );
};

export default Level3;
