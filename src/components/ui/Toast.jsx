/**
 * ====================================================
 * LUMORA AI - Toast Notification Component
 * ====================================================
 * Non-intrusive notification system with auto-dismiss.
 */

'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const ToastContext = createContext(null);

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: 'text-green-500 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20',
  error: 'text-red-500 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20',
  info: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
  warning: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    warning: (msg) => addToast(msg, 'warning'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl border animate-slide-left',
                'shadow-glass backdrop-blur-sm',
                colors[t.type]
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium text-surface-800 dark:text-surface-200 flex-1">
                {t.message}
              </p>
              <button
                onClick={() => removeToast(t.id)}
                className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
