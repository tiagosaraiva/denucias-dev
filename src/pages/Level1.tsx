
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

const Level1 = () => {
  const navigate = useNavigate();
  const { 
    addToInventory, 
    isPuzzleSolved, 
    solvePuzzle, 
    advanceLevel 
  } = useGameContext();
  
  // Dialog states
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [showSafeDialog, setShowSafeDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [showBookDialog, setShowBookDialog] = useState(false);
  
  // Puzzle states
  const [safeCode, setSafeCode] = useState('');
  const [safeSolved, setSafeSolved] = useState(isPuzzleSolved('safe'));
  const [keyFound, setKeyFound] = useState(isPuzzleSolved('key'));
  const [doorUnlocked, setDoorUnlocked] = useState(isPuzzleSolved('door'));
  
  const handleSafeSubmit = () => {
    if (safeCode === '4827') {
      solvePuzzle('safe');
      setSafeSolved(true);
      toast.success("The safe clicks and opens!");
      setShowSafeDialog(false);
      setTimeout(() => {
        setShowKeyDialog(true);
      }, 500);
    } else {
      toast.error("Incorrect combination.");
    }
  };
  
  const handleKeyPick = () => {
    solvePuzzle('key');
    setKeyFound(true);
    setShowKeyDialog(false);
    addToInventory({
      id: 'brass_key',
      name: 'Brass Key',
      image: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      description: 'An old brass key that might unlock something.'
    });
  };
  
  const handleUseDoor = () => {
    if (keyFound && !doorUnlocked) {
      solvePuzzle('door');
      setDoorUnlocked(true);
      toast.success("The door unlocks!");
      setTimeout(() => {
        advanceLevel();
        navigate('/level/2');
      }, 1500);
    } else if (!keyFound) {
      toast.error("The door is locked. You need a key.");
    }
  };
  
  // Check if all puzzles are solved
  const isLevelComplete = safeSolved && keyFound && doorUnlocked;

  return (
    <GameLayout levelTitle="The Study">
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div 
          className="w-full max-w-3xl aspect-[16/9] bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg shadow-inner relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Room background */}
          <div className="absolute inset-0 p-8 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-8 text-center">Welcome to The Study</h2>
            <p className="text-center max-w-md mb-8">
              You find yourself in a small study room. There's a desk, some bookshelves, and a locked door. Find clues to escape!
            </p>
            
            {/* Interactive elements */}
            <div className="relative w-full h-[300px]">
              {/* Bookshelf */}
              <Clue 
                id="bookshelf"
                x="20%"
                y="50%"
                width="120px"
                height="200px"
                tooltip="A bookshelf filled with old books"
                onClick={() => setShowBookDialog(true)}
              >
                <div className="w-[120px] h-[200px] bg-amber-800 rounded-md flex flex-col justify-between p-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-full h-8 bg-amber-700 rounded" />
                  ))}
                </div>
              </Clue>
              
              {/* Desk with note */}
              <Clue 
                id="desk"
                x="50%"
                y="70%"
                width="200px"
                height="50px"
                tooltip="A wooden desk with a note on it"
                onClick={() => setShowNoteDialog(true)}
              >
                <div className="w-[200px] h-[50px] bg-amber-600 rounded-md">
                  <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 w-10 h-12 bg-yellow-100 rotate-12"></div>
                </div>
              </Clue>
              
              {/* Safe */}
              <Clue 
                id="safe"
                x="80%"
                y="50%"
                width="80px"
                height="100px"
                tooltip="A wall safe with a combination lock"
                onClick={() => setShowSafeDialog(true)}
              >
                <div className="w-[80px] h-[100px] bg-gray-600 rounded-md flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
                    <div className="w-4 h-4 bg-gray-700 rounded-full" />
                  </div>
                </div>
              </Clue>
              
              {/* Door */}
              <Clue 
                id="door"
                x="50%"
                y="30%"
                width="80px"
                height="120px"
                tooltip={doorUnlocked ? "The door is unlocked" : "A locked wooden door"}
                onClick={handleUseDoor}
              >
                <div className={`w-[80px] h-[120px] ${doorUnlocked ? 'bg-amber-500' : 'bg-amber-700'} rounded-t-md flex flex-col items-center justify-center`}>
                  <div className="w-4 h-4 bg-yellow-600 rounded-full absolute right-2" />
                </div>
              </Clue>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Dialogs */}
      <GameDialog 
        title="Bookshelf"
        description="You examine the books on the shelf."
        isOpen={showBookDialog}
        onClose={() => setShowBookDialog(false)}
      >
        <p>The bookshelf contains various old volumes. One book titled "Secret Combinations" catches your eye.</p>
        <p className="mt-2 text-sm text-muted-foreground">You open it and find a page with some text highlighted:</p>
        <div className="mt-4 p-4 bg-muted rounded-md">
          <p className="italic">
            "The answer lies in the equation: <span className="font-bold">4 x 8 ÷ 2 + 7 = ?</span>"
          </p>
        </div>
      </GameDialog>
      
      <GameDialog 
        title="Note on Desk"
        description="You find a handwritten note."
        isOpen={showNoteDialog}
        onClose={() => setShowNoteDialog(false)}
      >
        <div className="p-4 bg-yellow-50 rounded-md rotate-1 transform">
          <p className="font-handwriting">
            Don't forget to check the books! The combination is the solution to the math puzzle.
          </p>
          <p className="font-handwriting mt-2">
            - Your past self
          </p>
        </div>
      </GameDialog>
      
      <GameDialog 
        title="Safe"
        description="A sturdy wall safe with a 4-digit combination lock."
        isOpen={showSafeDialog}
        onClose={() => setShowSafeDialog(false)}
        confirmText={safeSolved ? undefined : "Try Code"}
        onConfirm={safeSolved ? undefined : handleSafeSubmit}
      >
        {safeSolved ? (
          <p>The safe is already open and empty. You've taken the key.</p>
        ) : (
          <div className="space-y-4">
            <p>Enter the 4-digit combination:</p>
            <Input 
              type="text" 
              maxLength={4} 
              value={safeCode} 
              onChange={(e) => setSafeCode(e.target.value)} 
              placeholder="0000"
              className="text-center text-2xl font-mono"
            />
          </div>
        )}
      </GameDialog>
      
      <GameDialog 
        title="Key Found!"
        description="You found a key inside the safe."
        isOpen={showKeyDialog}
        onClose={() => setShowKeyDialog(false)}
        confirmText="Take Key"
        onConfirm={handleKeyPick}
      >
        <div className="flex justify-center p-4">
          <div className="w-20 h-20 bg-amber-300 rounded-md flex items-center justify-center">
            <div className="w-8 h-16 bg-amber-600">
              <div className="w-8 h-8 border-4 border-amber-600 rounded-full mt-12"></div>
            </div>
          </div>
        </div>
        <p className="text-center mt-4">A brass key that might unlock the door.</p>
      </GameDialog>
    </GameLayout>
  );
};

export default Level1;
