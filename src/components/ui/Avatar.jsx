import { cn } from '../../utils/cn';

export function Avatar({ src, alt, initials, size = 'md', className }) {
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  return (
    <div className={cn(
      'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-brand-100 dark:bg-brand-900 shrink-0',
      sizes[size],
      className
    )}>
      {src ? (
        <img src={src} alt={alt || initials} className="w-full h-full object-cover" />
      ) : (
        <span className="font-medium text-brand-600 dark:text-brand-300">
          {initials?.substring(0, 2).toUpperCase() || '?'}
        </span>
      )}
    </div>
  );
}
