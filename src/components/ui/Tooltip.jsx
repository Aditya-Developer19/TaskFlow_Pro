import { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

export function Tooltip({ children, content, className }) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  useEffect(() => {
    if (show && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 32, // position above
        left: rect.left + rect.width / 2,
      });
    }
  }, [show]);

  return (
    <div 
      className="inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      ref={triggerRef}
    >
      {children}
      {show && (
        <div 
          className={cn(
            "fixed z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-sm -translate-x-1/2 pointer-events-none animate-in fade-in zoom-in-95",
            className
          )}
          style={{ top: position.top, left: position.left }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
