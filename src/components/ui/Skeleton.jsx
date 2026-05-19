/**
 * ====================================================
 * LUMORA AI - Skeleton Loader Component
 * ====================================================
 * Beautiful loading placeholders with shimmer animation.
 */

'use client';

import clsx from 'clsx';

export default function Skeleton({ className = '', variant = 'rectangular', width, height }) {
  const variants = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded-md h-4',
  };

  return (
    <div
      className={clsx('skeleton', variants[variant], className)}
      style={{ width, height }}
    />
  );
}

/**
 * Chat message skeleton loader
 */
export function MessageSkeleton() {
  return (
    <div className="flex gap-3 p-4 animate-fade-in">
      <Skeleton variant="circular" width={36} height={36} />
      <div className="flex-1 space-y-2">
        <Skeleton width="30%" height={16} />
        <Skeleton width="80%" height={16} />
        <Skeleton width="60%" height={16} />
      </div>
    </div>
  );
}

/**
 * Sidebar conversation skeleton
 */
export function ConversationSkeleton() {
  return (
    <div className="px-3 py-2 space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton variant="circular" width={32} height={32} />
          <div className="flex-1 space-y-1.5">
            <Skeleton width="70%" height={14} />
            <Skeleton width="40%" height={12} />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Dashboard card skeleton
 */
export function CardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton width="40%" height={20} />
        <Skeleton variant="circular" width={40} height={40} />
      </div>
      <Skeleton width="60%" height={32} />
      <Skeleton width="80%" height={14} />
    </div>
  );
}
