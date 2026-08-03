import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  items: DropdownItem[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  value,
  onChange,
  placeholder = 'Select option...',
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find((i) => i.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={cn('relative inline-block w-full', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-900/60 dark:bg-slate-800/80 border border-slate-700/60 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
      >
        <span className="flex items-center gap-2">
          {selectedItem?.icon}
          {selectedItem ? selectedItem.label : placeholder}
        </span>
        <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-slate-900 dark:bg-slate-850 border border-slate-700/60 rounded-xl shadow-xl py-1 max-h-60 overflow-y-auto">
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                onChange(item.value);
                setIsOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors',
                item.value === value ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-slate-300'
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
