/**
 * ====================================================
 * LUMORA AI - Contact Page
 * ====================================================
 */

'use client';

import { useState } from 'react';
import { Send, Mail, MessageSquare, MapPin } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-surface-900 dark:text-white mb-4">Get in Touch</h1>
          <p className="text-lg text-surface-500">We&apos;d love to hear from you</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-6">
            {[
              { icon: Mail, label: 'Email', value: 'support@lumora.ai' },
              { icon: MessageSquare, label: 'Live Chat', value: 'Available 24/7' },
              { icon: MapPin, label: 'Address', value: 'San Francisco, CA' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-500/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-900 dark:text-white">{item.label}</p>
                  <p className="text-sm text-surface-500">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="md:col-span-2 glass-card p-6">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-surface-900 dark:text-white">Message Sent!</h3>
                <p className="text-surface-500 mt-2">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Name" placeholder="Your name" required />
                  <Input label="Email" type="email" placeholder="you@example.com" required />
                </div>
                <Input label="Subject" placeholder="How can we help?" required />
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us more..."
                    required
                    className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                  />
                </div>
                <Button type="submit" variant="gradient" size="lg" loading={loading} icon={Send} iconPosition="right">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
