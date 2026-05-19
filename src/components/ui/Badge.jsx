/**
 * ====================================================
 * LUMORA AI - Badge Component
 * ====================================================
 * Status badges and labels with various styles.
 */

'use client';

import clsx from 'clsx';

const variants = {
  default: 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300',
  primary: 'bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300',
  success: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300',
  warning: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
  danger: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
  info: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
};

export default function Badge({ children, variant = 'default', size = 'sm', dot = false, className = '' }) {
  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', `bg-current`)} />}
      {children}
    </span>
  );
}
