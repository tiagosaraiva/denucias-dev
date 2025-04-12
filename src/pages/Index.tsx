
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GameProvider, useGameContext } from '@/contexts/GameContext';
import { motion } from 'framer-motion';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const GameIntro = () => {
  const { resetGame, gameState } = useGameContext();
  const [isMuted, setIsMuted] = useState(true);
  const navigate = useNavigate();

  const handleStartGame = () => {
    resetGame();
    navigate('/level/1');
  };

  const handleContinueGame = () => {
    navigate(`/level/${gameState.currentLevel + 1}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <motion.div
        className="max-w-2xl w-full px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center mb-8">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-2 text-gradient"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Escape Quest
          </motion.h1>
          <motion.p
            className="text-lg text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Find the clues. Solve the puzzles. Escape the rooms.
          </motion.p>
        </div>

        <motion.div
          className="glass-panel p-8 mb-8"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Welcome to Escape Quest</h2>
          <p className="mb-6 text-gray-600">
            You find yourself trapped in a series of mysterious rooms. Your only way out is to use your 
            wit and observation skills to solve puzzles and advance through all five levels.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {gameState.currentLevel > 0 ? (
              <Button 
                className="btn-game flex items-center gap-2 px-8 py-6 text-base"
                onClick={handleContinueGame}
              >
                <Play size={18} />
                Continue (Level {gameState.currentLevel + 1})
              </Button>
            ) : null}
            
            <Button 
              variant={gameState.currentLevel > 0 ? "outline" : "default"}
              className={`flex items-center gap-2 px-8 py-6 text-base ${gameState.currentLevel === 0 ? 'btn-game' : ''}`}
              onClick={handleStartGame}
            >
              <Play size={18} />
              {gameState.currentLevel > 0 ? 'Start New Game' : 'Start Game'}
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Info size={16} />
                <span>How to Play</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Game Instructions</DialogTitle>
                <DialogDescription>
                  Welcome to Escape Quest! Here's how to play:
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm">
                  In each room, you'll need to find clues and solve puzzles to advance to the next level.
                </p>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Tips:</h3>
                  <ul className="list-disc pl-5 text-sm">
                    <li>Click on objects to interact with them</li>
                    <li>Collect items for your inventory</li>
                    <li>Use items from your inventory on the environment</li>
                    <li>You have 3 hints available if you get stuck</li>
                    <li>Pay attention to details - everything could be a clue!</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span>{isMuted ? 'Sound Off' : 'Sound On'}</span>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

const Index = () => {
  return (
    <GameProvider>
      <GameIntro />
    </GameProvider>
  );
};

export default Index;
