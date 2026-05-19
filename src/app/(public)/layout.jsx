/**
 * ====================================================
 * LUMORA AI - Public Pages Layout
 * ====================================================
 * Layout for public pages with navigation and footer.
 */

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-surface-200/50 dark:border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-surface-900 dark:text-white">Lumora AI</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-sm text-surface-600 dark:text-surface-400 hover:text-brand-500">Features</Link>
              <Link href="/pricing" className="text-sm text-surface-600 dark:text-surface-400 hover:text-brand-500">Pricing</Link>
              <Link href="/faq" className="text-sm text-surface-600 dark:text-surface-400 hover:text-brand-500">FAQ</Link>
              <Link href="/contact" className="text-sm text-surface-600 dark:text-surface-400 hover:text-brand-500">Contact</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-surface-700 dark:text-surface-300">Sign In</Link>
              <Link href="/register" className="px-4 py-2 text-sm font-medium rounded-lg gradient-brand text-white shadow-lg shadow-brand-500/30">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      {children}

      {/* Footer */}
      <footer className="border-t border-surface-200 dark:border-surface-800 py-8 px-4 bg-white dark:bg-surface-950">
        <div className="max-w-7xl mx-auto text-center text-sm text-surface-500">
          &copy; {new Date().getFullYear()} Lumora AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
