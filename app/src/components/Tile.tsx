import React from 'react';
import { cn } from '@/lib/utils';

interface TileProps {
  children: React.ReactNode;
  className?: string;
  hasShadow?: boolean;
  noHover?: boolean;
}

export const Tile: React.FC<TileProps> = ({ 
  children, 
  className = '', 
  hasShadow = true,
  noHover = false 
}) => {
  return (
    <div 
      className={cn(
        'bg-white border-[3px] border-broco-dark rounded-tile overflow-hidden',
        hasShadow && 'shadow-tile',
        !noHover && 'hover:shadow-tile-hover hover:-translate-y-1 transition-all duration-200',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Tile;
