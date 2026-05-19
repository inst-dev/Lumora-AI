/**
 * ====================================================
 * LUMORA AI - Dropdown Component
 * ====================================================
 * Animated dropdown menu with proper positioning.
 * Closes on outside click and escape key.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

export default function Dropdown({ trigger, children, align = 'right', className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={clsx(
            'absolute z-50 mt-2 min-w-[180px] rounded-xl py-1.5',
            'bg-white dark:bg-surface-850 shadow-glass-lg',
            'border border-surface-200 dark:border-surface-700',
            'animate-scale-in origin-top',
            align === 'right' && 'right-0',
            align === 'left' && 'left-0',
            className
          )}
        >
          {typeof children === 'function' ? children(() => setIsOpen(false)) : children}
        </div>
      )}
    </div>
  );
}

/**
 * Dropdown menu item
 */
export function DropdownItem({ icon: Icon, children, onClick, danger = false, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-2.5 w-full px-4 py-2 text-sm transition-colors',
        danger
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
          : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800',
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
    </button>
  );
}
