/**
 * ====================================================
 * LUMORA AI - Pricing Page
 * ====================================================
 */

import Link from 'next/link';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Pricing - Lumora AI',
  description: 'Simple, transparent pricing for everyone. Start free, upgrade when ready.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-surface-900 dark:text-white mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-surface-500 mb-12">No hidden fees. Cancel anytime.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className={`glass-card p-8 relative ${plan.popular ? 'ring-2 ring-brand-500' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-brand text-white text-xs font-medium">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-surface-900 dark:text-white">{plan.name}</h3>
              <p className="text-sm text-surface-500 mt-1 mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-surface-900 dark:text-white">${plan.price}</span>
                <span className="text-surface-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`block text-center py-3 rounded-xl font-medium transition-all ${
                  plan.popular
                    ? 'gradient-brand text-white shadow-lg shadow-brand-500/30'
                    : 'border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const plans = [
  {
    name: 'Free', price: 0, popular: false, cta: 'Get Started',
    description: 'Perfect for trying out',
    features: ['50 messages per day', 'Gemini Flash model', 'Basic chat features', 'Search conversations', 'Community support'],
  },
  {
    name: 'Pro', price: 19, popular: true, cta: 'Upgrade to Pro',
    description: 'For power users',
    features: ['500 messages per day', 'All AI models (GPT-4, Claude, Grok)', 'Image generation (50/mo)', 'Priority support', 'Advanced features', 'API access'],
  },
  {
    name: 'Enterprise', price: 49, popular: false, cta: 'Contact Sales',
    description: 'For teams and businesses',
    features: ['Unlimited messages', 'All AI models', 'Unlimited image generation', 'Dedicated support', 'Custom integrations', 'Team management', 'SLA guarantee'],
  },
];
