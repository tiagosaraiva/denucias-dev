
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type InventoryItem = {
  id: string;
  name: string;
  image: string;
  description: string;
};

export type GameState = {
  currentLevel: number;
  inventory: InventoryItem[];
  solvedPuzzles: string[];
  hints: number;
  startTime: number | null;
  completionTime: number | null;
};

const initialGameState: GameState = {
  currentLevel: 0,
  inventory: [],
  solvedPuzzles: [],
  hints: 3,
  startTime: null,
  completionTime: null,
};

type GameContextType = {
  gameState: GameState;
  addToInventory: (item: InventoryItem) => void;
  removeFromInventory: (itemId: string) => void;
  solvePuzzle: (puzzleId: string) => void;
  isPuzzleSolved: (puzzleId: string) => boolean;
  useHint: () => void;
  advanceLevel: () => void;
  resetGame: () => void;
  getElapsedTime: () => string;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  // Initialize the game when the component mounts
  useEffect(() => {
    const savedState = localStorage.getItem('escapeQuestGameState');
    if (savedState) {
      try {
        setGameState(JSON.parse(savedState));
      } catch (error) {
        console.error('Failed to load saved game state:', error);
        resetGame();
      }
    } else {
      resetGame();
    }
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    if (gameState.startTime !== null) {
      localStorage.setItem('escapeQuestGameState', JSON.stringify(gameState));
    }
  }, [gameState]);

  const addToInventory = (item: InventoryItem) => {
    if (!gameState.inventory.some(i => i.id === item.id)) {
      setGameState(prev => ({
        ...prev,
        inventory: [...prev.inventory, item]
      }));
      toast.success(`Added ${item.name} to inventory`);
    }
  };

  const removeFromInventory = (itemId: string) => {
    setGameState(prev => ({
      ...prev,
      inventory: prev.inventory.filter(item => item.id !== itemId)
    }));
  };

  const solvePuzzle = (puzzleId: string) => {
    if (!gameState.solvedPuzzles.includes(puzzleId)) {
      setGameState(prev => ({
        ...prev,
        solvedPuzzles: [...prev.solvedPuzzles, puzzleId]
      }));
      toast.success("Puzzle solved!");
    }
  };

  const isPuzzleSolved = (puzzleId: string) => {
    return gameState.solvedPuzzles.includes(puzzleId);
  };

  const useHint = () => {
    if (gameState.hints > 0) {
      setGameState(prev => ({
        ...prev,
        hints: prev.hints - 1
      }));
      return true;
    }
    toast.error("No hints remaining!");
    return false;
  };

  const advanceLevel = () => {
    if (gameState.currentLevel < 5) {
      setGameState(prev => ({
        ...prev,
        currentLevel: prev.currentLevel + 1
      }));

      if (gameState.currentLevel === 4) {
        // Game completed
        setGameState(prev => ({
          ...prev,
          completionTime: Date.now()
        }));
      }
    }
  };

  const resetGame = () => {
    setGameState({
      ...initialGameState,
      startTime: Date.now()
    });
  };

  const getElapsedTime = (): string => {
    if (!gameState.startTime) return "00:00";
    
    const endTime = gameState.completionTime || Date.now();
    const elapsedMilliseconds = endTime - gameState.startTime;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        addToInventory,
        removeFromInventory,
        solvePuzzle,
        isPuzzleSolved,
        useHint,
        advanceLevel,
        resetGame,
        getElapsedTime,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
