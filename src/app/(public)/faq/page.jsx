/**
 * ====================================================
 * LUMORA AI - FAQ Page
 * ====================================================
 */

'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-surface-900 dark:text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-surface-500">Everything you need to know about Lumora AI</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="text-sm font-medium text-surface-900 dark:text-white pr-4">{question}</span>
        <ChevronDown className={clsx('w-5 h-5 text-surface-400 transition-transform flex-shrink-0', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-surface-600 dark:text-surface-400 leading-relaxed animate-slide-down">
          {answer}
        </div>
      )}
    </div>
  );
}

const faqs = [
  { question: 'What AI models are available?', answer: 'Lumora AI supports Google Gemini, OpenAI GPT-4, Anthropic Claude, and xAI Grok. Free users get access to Gemini Flash, while paid users can use all models.' },
  { question: 'Can I cancel my subscription anytime?', answer: 'Yes! You can cancel your subscription at any time from your billing page. You\'ll continue to have access until the end of your current billing period.' },
  { question: 'Is my data secure?', answer: 'Absolutely. We use enterprise-grade encryption, secure authentication, and never share your conversation data with third parties. Your privacy is our top priority.' },
  { question: 'What payment methods do you accept?', answer: 'We accept credit/debit cards via Stripe, PayPal, Razorpay, and several other regional payment gateways. Contact us if you need alternative payment methods.' },
  { question: 'Is there a free plan?', answer: 'Yes! Our free plan includes 50 messages per day with the Gemini Flash model. No credit card required to get started.' },
  { question: 'Can I use the API?', answer: 'Pro and Enterprise users have access to our API for programmatic access to AI models. Full API documentation is available in your dashboard.' },
  { question: 'Do you offer refunds?', answer: 'We offer a 14-day money-back guarantee on all paid plans. If you\'re not satisfied, contact our support team for a full refund.' },
  { question: 'How do I upgrade my plan?', answer: 'Go to your Billing page in the dashboard and select the plan you want to upgrade to. The change takes effect immediately with prorated billing.' },
];
