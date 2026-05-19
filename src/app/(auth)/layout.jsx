/**
 * ====================================================
 * LUMORA AI - Auth Layout
 * ====================================================
 * Beautiful authentication pages layout with gradient
 * background and centered card design.
 */

import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 via-brand-50/30 to-surface-100 dark:from-surface-950 dark:via-brand-950/20 dark:to-surface-900 p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      {/* Auth card */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-neon">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-surface-900 dark:text-white">
              Lumora AI
            </span>
          </Link>
        </div>

        {/* Card content */}
        <div className="glass-card p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
