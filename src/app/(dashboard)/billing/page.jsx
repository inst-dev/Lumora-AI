/**
 * ====================================================
 * LUMORA AI - Billing & Subscription Page
 * ====================================================
 * User subscription management with plan comparison
 * and billing history.
 */

'use client';

import { useState } from 'react';
import { Check, Crown, CreditCard, Download, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/providers/AuthProvider';

export default function BillingPage() {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Free', slug: 'free', price: { monthly: 0, yearly: 0 },
      features: ['50 messages/day', 'Gemini Flash only', 'Basic features'],
      current: user?.subscription?.plan_slug === 'free',
    },
    {
      name: 'Pro', slug: 'pro', price: { monthly: 19, yearly: 190 }, popular: true,
      features: ['500 messages/day', 'All AI models', 'Image generation', '50 image credits', 'Priority support'],
      current: user?.subscription?.plan_slug === 'pro',
    },
    {
      name: 'Enterprise', slug: 'enterprise', price: { monthly: 49, yearly: 490 },
      features: ['Unlimited messages', 'All AI models', 'Unlimited images', 'API access', 'Dedicated support', 'Team features'],
      current: user?.subscription?.plan_slug === 'enterprise',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Billing & Subscription</h1>
        <p className="text-sm text-surface-500 mt-1">Manage your plan and payment methods</p>
      </div>

      {/* Current plan */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold text-surface-900 dark:text-white">
                Current Plan: <span className="text-brand-500">{user?.subscription?.plan_name || 'Free'}</span>
              </p>
              <p className="text-sm text-surface-500">
                {user?.subscription?.billing_cycle === 'yearly' ? 'Billed annually' : 'Billed monthly'}
              </p>
            </div>
          </div>
          <Badge variant="success" dot>Active</Badge>
        </div>
      </div>

      {/* Billing cycle toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex p-1 rounded-xl bg-surface-100 dark:bg-surface-800">
          {['monthly', 'yearly'].map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={clsx(
                'px-6 py-2 rounded-lg text-sm font-medium transition-all',
                billingCycle === cycle
                  ? 'bg-white dark:bg-surface-700 shadow text-surface-900 dark:text-white'
                  : 'text-surface-500'
              )}
            >
              {cycle === 'monthly' ? 'Monthly' : 'Yearly (Save 17%)'}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.slug}
            className={clsx(
              'glass-card p-6 relative',
              plan.popular && 'ring-2 ring-brand-500',
              plan.current && 'bg-brand-50/50 dark:bg-brand-500/5'
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-brand text-white text-xs font-medium">
                Popular
              </div>
            )}
            <h3 className="text-lg font-bold text-surface-900 dark:text-white">{plan.name}</h3>
            <div className="mt-3 mb-5">
              <span className="text-3xl font-bold text-surface-900 dark:text-white">
                ${plan.price[billingCycle]}
              </span>
              <span className="text-surface-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
                  <Check className="w-4 h-4 text-green-500" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.current ? 'secondary' : plan.popular ? 'gradient' : 'outline'}
              fullWidth
              disabled={plan.current}
            >
              {plan.current ? 'Current Plan' : 'Upgrade'}
            </Button>
          </div>
        ))}
      </div>

      {/* Billing history */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Billing History</h2>
        <div className="space-y-3">
          {billingHistory.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-surface-400" />
                <div>
                  <p className="text-sm font-medium text-surface-900 dark:text-white">{item.description}</p>
                  <p className="text-xs text-surface-500">{item.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-surface-900 dark:text-white">${item.amount}</span>
                <button className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-700">
                  <Download className="w-4 h-4 text-surface-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const billingHistory = [
  { description: 'Pro Plan - Monthly', date: 'May 1, 2024', amount: '19.00' },
  { description: 'Pro Plan - Monthly', date: 'Apr 1, 2024', amount: '19.00' },
  { description: 'Pro Plan - Monthly', date: 'Mar 1, 2024', amount: '19.00' },
];
