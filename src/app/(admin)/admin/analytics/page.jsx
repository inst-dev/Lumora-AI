/**
 * ====================================================
 * LUMORA AI - Admin Analytics Page
 * ====================================================
 * Platform analytics and usage statistics.
 */

'use client';

import { BarChart3, TrendingUp, MessageSquare, Users, Cpu, Clock } from 'lucide-react';
import clsx from 'clsx';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-surface-500 mt-1">Platform usage and performance metrics</p>
      </div>

      {/* Analytics cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: 'Total Messages Today', value: '24,581', change: '+12%', icon: MessageSquare, color: 'text-blue-500 bg-blue-100 dark:bg-blue-500/10' },
          { label: 'Active Users (24h)', value: '1,847', change: '+5%', icon: Users, color: 'text-green-500 bg-green-100 dark:bg-green-500/10' },
          { label: 'API Calls Today', value: '48,290', change: '+18%', icon: Cpu, color: 'text-purple-500 bg-purple-100 dark:bg-purple-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-surface-500">{stat.label}</span>
              <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center', stat.color)}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-green-500 mt-1">{stat.change} from yesterday</p>
          </div>
        ))}
      </div>

      {/* Usage by provider */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Usage by Provider</h2>
        <div className="space-y-4">
          {[
            { name: 'Google Gemini', percentage: 45, messages: '124,500', color: 'bg-blue-500' },
            { name: 'OpenAI', percentage: 30, messages: '83,200', color: 'bg-green-500' },
            { name: 'Claude', percentage: 18, messages: '49,800', color: 'bg-orange-500' },
            { name: 'Grok', percentage: 7, messages: '19,400', color: 'bg-purple-500' },
          ].map((provider, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-32 text-sm text-surface-700 dark:text-surface-300">{provider.name}</span>
              <div className="flex-1 h-3 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
                <div className={clsx('h-full rounded-full transition-all', provider.color)} style={{ width: `${provider.percentage}%` }} />
              </div>
              <span className="text-sm text-surface-500 w-20 text-right">{provider.percentage}%</span>
              <span className="text-sm text-surface-400 w-24 text-right">{provider.messages}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Peak hours */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Peak Usage Hours</h2>
        <div className="flex items-end gap-1 h-40">
          {[20, 15, 10, 8, 12, 25, 40, 65, 80, 90, 85, 75, 70, 60, 55, 50, 65, 80, 95, 100, 90, 70, 45, 30].map((value, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={clsx('w-full rounded-t transition-all', value > 80 ? 'bg-brand-500' : value > 50 ? 'bg-brand-300' : 'bg-surface-200 dark:bg-surface-700')}
                style={{ height: `${value}%` }}
              />
              {i % 4 === 0 && <span className="text-[10px] text-surface-500">{i}h</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
