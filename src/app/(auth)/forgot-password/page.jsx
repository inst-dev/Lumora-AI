/**
 * ====================================================
 * LUMORA AI - Forgot Password Page
 * ====================================================
 * Password reset request form with email validation.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      // Always show success to prevent email enumeration
      setSent(true);
    } catch {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Check your email</h1>
        <p className="text-sm text-surface-500">
          If an account exists for <strong>{email}</strong>, we&apos;ve sent password reset instructions.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-600 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Reset password</h1>
        <p className="text-sm text-surface-500">Enter your email and we&apos;ll send reset instructions</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <Button type="submit" variant="gradient" size="lg" fullWidth loading={loading}>
          Send Reset Link
        </Button>
      </form>

      <p className="text-center">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700">
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </p>
    </div>
  );
}
