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
  hasShadow = false,
  noHover = false
}) => {
  return (
    <div
      className={cn(
        'bg-white border border-[var(--color-border)] rounded-none overflow-hidden',
        hasShadow && 'shadow-sm',
        !noHover && 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Tile;
