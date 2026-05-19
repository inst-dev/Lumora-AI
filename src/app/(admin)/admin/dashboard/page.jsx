/**
 * ====================================================
 * LUMORA AI - Admin Dashboard
 * ====================================================
 * Overview analytics with key metrics, charts,
 * and recent activity.
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Users, CreditCard, MessageSquare, TrendingUp,
  ArrowUpRight, ArrowDownRight, DollarSign, Cpu
} from 'lucide-react';
import clsx from 'clsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated stats - in production, fetch from API
    setStats({
      totalUsers: 12847,
      usersGrowth: 12.5,
      totalRevenue: 48250,
      revenueGrowth: 8.3,
      totalMessages: 1284750,
      messagesGrowth: 23.1,
      activeSubscriptions: 3421,
      subscriptionsGrowth: 5.7,
    });
    setLoading(false);
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers, growth: stats?.usersGrowth, icon: Users, color: 'text-blue-500 bg-blue-100 dark:bg-blue-500/10' },
    { label: 'Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, growth: stats?.revenueGrowth, icon: DollarSign, color: 'text-green-500 bg-green-100 dark:bg-green-500/10' },
    { label: 'Messages', value: stats?.totalMessages?.toLocaleString(), growth: stats?.messagesGrowth, icon: MessageSquare, color: 'text-purple-500 bg-purple-100 dark:bg-purple-500/10' },
    { label: 'Active Subs', value: stats?.activeSubscriptions?.toLocaleString(), growth: stats?.subscriptionsGrowth, icon: CreditCard, color: 'text-orange-500 bg-orange-100 dark:bg-orange-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-surface-500 mt-1">Overview of your platform performance</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="glass-card p-5 hover-lift">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-surface-500">{card.label}</span>
              <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center', card.color)}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">
              {loading ? '---' : card.value}
            </p>
            {card.growth && (
              <div className="flex items-center gap-1 mt-2">
                {card.growth > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={clsx('text-xs font-medium', card.growth > 0 ? 'text-green-500' : 'text-red-500')}>
                  {Math.abs(card.growth)}%
                </span>
                <span className="text-xs text-surface-500">vs last month</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent activity & Quick actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent users */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Recent Users</h2>
          <div className="space-y-3">
            {recentUsers.map((user, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">
                  {user.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-surface-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-surface-500">{user.email}</p>
                </div>
                <span className={clsx(
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  user.plan === 'Pro' ? 'bg-brand-100 dark:bg-brand-500/10 text-brand-600' :
                  user.plan === 'Enterprise' ? 'bg-purple-100 dark:bg-purple-500/10 text-purple-600' :
                  'bg-surface-100 dark:bg-surface-800 text-surface-500'
                )}>
                  {user.plan}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, i) => (
              <button
                key={i}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-500/10 flex items-center justify-center">
                  <action.icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                </div>
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sample data
const recentUsers = [
  { name: 'John Doe', email: 'john@example.com', plan: 'Pro' },
  { name: 'Sarah Smith', email: 'sarah@example.com', plan: 'Enterprise' },
  { name: 'Mike Johnson', email: 'mike@example.com', plan: 'Free' },
  { name: 'Emily Brown', email: 'emily@example.com', plan: 'Pro' },
  { name: 'Alex Wilson', email: 'alex@example.com', plan: 'Free' },
];

const quickActions = [
  { label: 'Add New User', icon: Users },
  { label: 'Create Coupon', icon: CreditCard },
  { label: 'Manage Providers', icon: Cpu },
  { label: 'View Support Tickets', icon: MessageSquare },
  { label: 'System Settings', icon: TrendingUp },
];
