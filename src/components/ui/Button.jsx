/**
 * ====================================================
 * LUMORA AI - Button Component
 * ====================================================
 * Reusable button with multiple variants, sizes, and states.
 * Supports loading states and icon placement.
 */

'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';

const variants = {
  primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40',
  secondary: 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-900 dark:text-surface-100 border border-surface-200 dark:border-surface-700',
  ghost: 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25',
  gradient: 'gradient-brand text-white shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50',
  outline: 'border-2 border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs rounded-md',
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
  xl: 'px-8 py-4 text-lg rounded-xl',
};

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
        'focus-ring disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-[0.98]',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}

      {/* Icon (left) */}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}

      {/* Button text */}
      {children}

      {/* Icon (right) */}
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
