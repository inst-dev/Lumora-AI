/**
 * ====================================================
 * LUMORA AI - Registration Page
 * ====================================================
 * Premium sign-up form with password strength indicator
 * and real-time validation.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/components/ui/Toast';
import clsx from 'clsx';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const router = useRouter();

  // Password strength calculation
  const passwordStrength = calculateStrength(formData.password);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Minimum 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!agreed) newErrors.terms = 'You must agree to the terms';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      toast.success('Account created! Please check your email to verify.');
      router.push('/login');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          Create your account
        </h1>
        <p className="text-sm text-surface-500">
          Start chatting with AI in seconds
        </p>
      </div>

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          icon={User}
          value={formData.name}
          onChange={handleChange('name')}
          placeholder="John Doe"
          error={errors.name}
        />

        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          value={formData.email}
          onChange={handleChange('email')}
          placeholder="you@example.com"
          error={errors.email}
        />

        <div>
          <Input
            label="Password"
            type="password"
            icon={Lock}
            value={formData.password}
            onChange={handleChange('password')}
            placeholder="Minimum 8 characters"
            error={errors.password}
          />
          {/* Password strength indicator */}
          {formData.password && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={clsx(
                      'h-1.5 flex-1 rounded-full transition-colors',
                      level <= passwordStrength.score
                        ? passwordStrength.color
                        : 'bg-surface-200 dark:bg-surface-700'
                    )}
                  />
                ))}
              </div>
              <p className={clsx('text-xs', passwordStrength.textColor)}>
                {passwordStrength.label}
              </p>
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          icon={Lock}
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          placeholder="Repeat your password"
          error={errors.confirmPassword}
        />

        {/* Terms agreement */}
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-surface-300 text-brand-500 focus:ring-brand-500"
          />
          <span className="text-sm text-surface-600 dark:text-surface-400">
            I agree to the{' '}
            <Link href="/terms" className="text-brand-500 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-brand-500 hover:underline">Privacy Policy</Link>
          </span>
        </label>
        {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}

        {/* Submit button */}
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          fullWidth
          loading={loading}
          icon={ArrowRight}
          iconPosition="right"
        >
          Create Account
        </Button>
      </form>

      {/* Login link */}
      <p className="text-center text-sm text-surface-500">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-500 hover:text-brand-600 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}

/**
 * Calculate password strength score
 */
function calculateStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  const levels = [
    { label: 'Very Weak', color: 'bg-red-500', textColor: 'text-red-500' },
    { label: 'Weak', color: 'bg-orange-500', textColor: 'text-orange-500' },
    { label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
    { label: 'Good', color: 'bg-green-400', textColor: 'text-green-500' },
    { label: 'Strong', color: 'bg-green-500', textColor: 'text-green-600' },
  ];

  return { score, ...levels[Math.min(score, 4)] };
}
