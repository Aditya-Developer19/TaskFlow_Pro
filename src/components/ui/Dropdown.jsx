import { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

export function Dropdown({ trigger, children, align = 'right', className }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      
      {open && (
        <div className={cn(
          "absolute z-50 mt-2 w-56 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-cardDark shadow-lg focus:outline-none py-1 animate-in fade-in slide-in-from-top-2",
          align === 'right' ? 'right-0' : 'left-0',
          className
        )}>
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, onClick, className, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left",
        className
      )}
    >
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
}
