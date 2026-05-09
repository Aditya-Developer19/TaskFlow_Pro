import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Card = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm dark:border-gray-800 dark:bg-surface-cardDark dark:text-gray-50',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
Card.displayName = 'Card';
