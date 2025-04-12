
import React, { useEffect } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import { Inventory } from './Inventory';
import { GameControls } from './GameControls';
import { motion } from 'framer-motion';

type GameLayoutProps = {
  children: React.ReactNode;
  levelTitle: string;
};

export const GameLayout: React.FC<GameLayoutProps> = ({ children, levelTitle }) => {
  const { gameState, getElapsedTime } = useGameContext();
  const [time, setTime] = React.useState(getElapsedTime());

  // Update the timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getElapsedTime());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [getElapsedTime]);

  return (
    <div className="game-container">
      <motion.div 
        className="room"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <header className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 glass-panel m-4 rounded-full">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs">{gameState.currentLevel}/5</span>
            </div>
            <h1 className="text-lg font-medium">{levelTitle}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">
              Time: <span className="font-mono">{time}</span>
            </div>
            <div className="text-sm font-medium">
              Hints: <span className="font-mono">{gameState.hints}</span>
            </div>
          </div>
        </header>

        <main className="relative h-full w-full flex flex-col justify-center items-center p-8 pt-20 pb-24">
          {children}
        </main>

        <footer className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-4 glass-panel mx-4 mb-4 rounded-full">
          <Inventory />
          <GameControls />
        </footer>
      </motion.div>
    </div>
  );
};
