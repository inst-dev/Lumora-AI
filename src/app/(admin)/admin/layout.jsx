/**
 * ====================================================
 * LUMORA AI - Admin Layout
 * ====================================================
 * Professional admin dashboard layout with sidebar
 * navigation and top bar.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, CreditCard, Cpu, Settings,
  FileText, BarChart3, MessageSquare, Sparkles, Menu,
  X, Bell, Tag, Shield, BookOpen, Megaphone, Key
} from 'lucide-react';
import clsx from 'clsx';

const adminNav = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { name: 'AI Providers', href: '/admin/providers', icon: Cpu },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Content', href: '/admin/content', icon: FileText },
  { name: 'Support', href: '/admin/support', icon: MessageSquare },
  { name: 'License', href: '/admin/license', icon: Key },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-surface-50 dark:bg-surface-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Admin Sidebar */}
      <aside className={clsx(
        'fixed lg:relative inset-y-0 left-0 z-50 w-64 flex flex-col',
        'bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800',
        'transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-800">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-surface-900 dark:text-white text-sm">Lumora AI</span>
              <span className="block text-[10px] text-surface-500">Admin Panel</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-5 h-5 text-surface-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto scrollbar-thin">
          <ul className="space-y-1">
            {adminNav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                      isActive
                        ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400'
                        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-surface-200 dark:border-surface-800">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-surface-500 hover:text-brand-500 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Back to Chat
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="w-5 h-5 text-surface-600" />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800">
              <Bell className="w-5 h-5 text-surface-500" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
