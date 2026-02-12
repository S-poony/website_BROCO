import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface RuleProps {
  orientation: 'vertical' | 'horizontal';
  className?: string;
  light?: boolean;
}

export const Rule = forwardRef<HTMLDivElement, RuleProps>(
  ({ orientation, className = '', light = false }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          orientation === 'vertical' ? 'w-[3px]' : 'h-[3px]',
          light ? 'bg-white/35' : 'bg-[var(--color-border-light)]',
          className
        )}
      />
    );
  }
);

Rule.displayName = 'Rule';

export default Rule;
