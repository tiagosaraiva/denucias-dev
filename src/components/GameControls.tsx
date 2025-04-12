
import React, { useState } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { HelpCircle, RotateCcw, PanelRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const GameControls: React.FC = () => {
  const { useHint, resetGame } = useGameContext();
  const [helpOpen, setHelpOpen] = useState(false);
  const navigate = useNavigate();

  const handleUseHint = () => {
    const hintUsed = useHint();
    if (hintUsed) {
      toast.info("Check highlighted areas for clues!");
      // Additional logic for specific level hints would be implemented here
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the game? All progress will be lost.")) {
      resetGame();
      navigate("/");
      toast.success("Game reset. Good luck!");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleUseHint} 
        className="flex items-center gap-1"
      >
        <HelpCircle size={16} />
        <span>Hint</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleReset}
        className="flex items-center gap-1"
      >
        <RotateCcw size={16} />
        <span>Reset</span>
      </Button>
      
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <PanelRight size={16} />
            <span>Help</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Game Instructions</DialogTitle>
            <DialogDescription>
              Welcome to the Escape Room! Your goal is to solve puzzles and find clues to advance through 5 levels and escape.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">How to Play</h3>
              <ul className="list-disc pl-5 text-sm">
                <li>Examine the room for interactive objects and clues</li>
                <li>Click on objects to interact with them</li>
                <li>Collect items to your inventory by clicking on them</li>
                <li>Use inventory items by clicking on them and then clicking where you want to use them</li>
                <li>Solve all puzzles in a level to unlock the next level</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Controls</h3>
              <ul className="list-disc pl-5 text-sm">
                <li><strong>Hint:</strong> Use a hint if you're stuck (limited to 3 per game)</li>
                <li><strong>Reset:</strong> Start the game over from the beginning</li>
                <li><strong>Help:</strong> Show this help screen</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
