/**
 * ====================================================
 * LUMORA AI - Input Component
 * ====================================================
 * Premium styled input with validation states,
 * floating labels, and icon support.
 */

'use client';

import { forwardRef, useState } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  containerClassName = '',
  helperText,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={clsx('space-y-1.5', containerClassName)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Left icon */}
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        {/* Input field */}
        <input
          ref={ref}
          type={inputType}
          className={clsx(
            'w-full rounded-xl border bg-white dark:bg-surface-900',
            'px-4 py-2.5 text-sm transition-all duration-200',
            'placeholder:text-surface-400 dark:placeholder:text-surface-500',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
            Icon && 'pl-10',
            isPassword && 'pr-10',
            error
              ? 'border-red-400 dark:border-red-500'
              : 'border-surface-200 dark:border-surface-700',
            'text-surface-900 dark:text-surface-100',
            className
          )}
          {...props}
        />

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p className="text-xs text-surface-500 mt-1">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
