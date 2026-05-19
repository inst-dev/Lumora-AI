/**
 * ====================================================
 * LUMORA AI - Admin Subscriptions Management
 * ====================================================
 * Manage subscription plans, pricing, and features.
 */

'use client';

import { useState } from 'react';
import { CreditCard, Edit3, Plus, Trash2, Check, Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import clsx from 'clsx';

export default function AdminSubscriptionsPage() {
  const plans = [
    { name: 'Free', slug: 'free', priceMonthly: 0, priceYearly: 0, subscribers: 8432, active: true },
    { name: 'Pro', slug: 'pro', priceMonthly: 19, priceYearly: 190, subscribers: 2891, active: true },
    { name: 'Enterprise', slug: 'enterprise', priceMonthly: 49, priceYearly: 490, subscribers: 530, active: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Subscriptions</h1>
          <p className="text-sm text-surface-500 mt-1">Manage plans and pricing</p>
        </div>
        <Button variant="primary" icon={Plus}>Add Plan</Button>
      </div>

      {/* Plans grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.slug} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-surface-900 dark:text-white">{plan.name}</h3>
              <Badge variant={plan.active ? 'success' : 'default'} dot>{plan.active ? 'Active' : 'Inactive'}</Badge>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-surface-900 dark:text-white">${plan.priceMonthly}</span>
              <span className="text-surface-500">/mo</span>
            </div>
            <div className="flex items-center gap-2 mb-6 text-sm text-surface-500">
              <Users className="w-4 h-4" />
              {plan.subscribers.toLocaleString()} subscribers
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" icon={Edit3} fullWidth>Edit</Button>
              {plan.slug !== 'free' && (
                <Button variant="ghost" size="sm" icon={Trash2} className="text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Coupons section */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Active Coupons</h2>
          <Button variant="secondary" size="sm" icon={Plus}>Create Coupon</Button>
        </div>
        <div className="space-y-3">
          {[
            { code: 'WELCOME20', type: '20% off', uses: '45/100', expires: 'Jun 30, 2024' },
            { code: 'ANNUAL50', type: '$50 off yearly', uses: '12/50', expires: 'Dec 31, 2024' },
          ].map((coupon, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-50 dark:bg-surface-800">
              <div className="flex items-center gap-3">
                <code className="px-2 py-1 rounded bg-brand-100 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-mono">
                  {coupon.code}
                </code>
                <span className="text-sm text-surface-600 dark:text-surface-400">{coupon.type}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-surface-500">
                <span>Used: {coupon.uses}</span>
                <span>Expires: {coupon.expires}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
