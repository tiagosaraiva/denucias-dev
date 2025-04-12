
import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ClueProps = {
  id: string;
  x: string;
  y: string;
  width?: string;
  height?: string;
  tooltip?: string;
  children: React.ReactNode;
  onClick: () => void;
  isHintActive?: boolean;
};

export const Clue: React.FC<ClueProps> = ({
  id,
  x,
  y,
  width = 'auto',
  height = 'auto',
  tooltip,
  children,
  onClick,
  isHintActive = false
}) => {
  const style = {
    position: 'absolute',
    left: x,
    top: y,
    width,
    height,
    transform: 'translate(-50%, -50%)',
  } as React.CSSProperties;

  const clueElement = (
    <motion.div
      id={id}
      className={`clue ${isHintActive ? 'animate-pulse-subtle ring-2 ring-yellow-300 ring-opacity-70' : ''}`}
      style={style}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {clueElement}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return clueElement;
};
