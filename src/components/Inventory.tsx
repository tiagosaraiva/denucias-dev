
import React from 'react';
import { useGameContext } from '@/contexts/GameContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

export const Inventory: React.FC = () => {
  const { gameState } = useGameContext();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Inventory</span>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-2">
          {gameState.inventory.length === 0 ? (
            <span className="text-xs text-muted-foreground italic">Empty</span>
          ) : (
            <motion.div 
              className="flex items-center gap-2"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {gameState.inventory.map((inventoryItem) => (
                <TooltipProvider key={inventoryItem.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div 
                        className="inventory-item" 
                        variants={item}
                      >
                        <img src={inventoryItem.image} alt={inventoryItem.name} className="w-8 h-8 object-contain" />
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{inventoryItem.name}</p>
                      <p className="text-xs text-muted-foreground">{inventoryItem.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
