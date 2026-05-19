/**
 * ====================================================
 * LUMORA AI - Landing Page
 * ====================================================
 * Premium SaaS landing page with hero, features,
 * pricing, testimonials, and CTA sections.
 */

import Link from 'next/link';
import {
  Sparkles, Zap, Shield, Globe, Brain, MessageSquare,
  ArrowRight, Check, Star, ChevronRight, Code2, Image,
  Users, CreditCard, Cpu, Lock
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-950">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-surface-200/50 dark:border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-surface-900 dark:text-white">Lumora AI</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-surface-600 dark:text-surface-400 hover:text-brand-500 transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-surface-600 dark:text-surface-400 hover:text-brand-500 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-sm text-surface-600 dark:text-surface-400 hover:text-brand-500 transition-colors">Testimonials</a>
              <Link href="/blog" className="text-sm text-surface-600 dark:text-surface-400 hover:text-brand-500 transition-colors">Blog</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-surface-700 dark:text-surface-300 hover:text-brand-500 transition-colors">
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium rounded-lg gradient-brand text-white shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 transition-all"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Powered by GPT-4, Gemini, Claude & Grok
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-surface-900 dark:text-white mb-6">
            Experience the Future of{' '}
            <span className="gradient-text">AI Conversation</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-surface-600 dark:text-surface-400 max-w-2xl mx-auto mb-10">
            One platform, all the best AI models. Generate text, code, and images
            with enterprise-grade security and a beautiful interface.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-xl gradient-brand text-white shadow-neon-lg hover:shadow-neon transition-all hover-lift"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-xl border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-all"
            >
              See Features
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-surface-500">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>10,000+ Users</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>1M+ Messages</span>
            </div>
          </div>
        </div>

        {/* Hero image / Chat preview */}
        <div className="relative max-w-4xl mx-auto mt-16">
          <div className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-glass-lg overflow-hidden">
            <div className="h-8 bg-surface-100 dark:bg-surface-800 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-brand-600" />
                </div>
                <div className="flex-1 bg-surface-50 dark:bg-surface-800 rounded-xl p-4">
                  <p className="text-sm text-surface-700 dark:text-surface-300">Help me write a Python function to sort a list using merge sort</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 bg-brand-50 dark:bg-brand-500/5 border border-brand-100 dark:border-brand-500/20 rounded-xl p-4">
                  <p className="text-sm text-surface-700 dark:text-surface-300">Here&apos;s an efficient merge sort implementation in Python...</p>
                  <div className="mt-3 bg-surface-900 rounded-lg p-3">
                    <code className="text-xs text-green-400 font-mono">def merge_sort(arr):<br/>    if len(arr) &lt;= 1:<br/>        return arr<br/>    mid = len(arr) // 2<br/>    ...</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-surface-50/50 dark:bg-surface-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
              Everything you need in one platform
            </h2>
            <p className="text-lg text-surface-500 max-w-2xl mx-auto">
              Built for teams and individuals who want the best AI experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="glass-card p-6 hover-lift group">
                <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-surface-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-surface-500">Start free, upgrade when you need more</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative glass-card p-8 ${plan.popular ? 'border-brand-500 dark:border-brand-400 ring-2 ring-brand-500/20' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-brand text-white text-xs font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-surface-900 dark:text-white">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-surface-900 dark:text-white">${plan.price}</span>
                  <span className="text-surface-500">/mo</span>
                </div>
                <ul className="space-y-3 mb-8">
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
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 bg-surface-50/50 dark:bg-surface-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
              Loved by thousands of users
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-surface-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-6">
            Ready to experience the future of AI?
          </h2>
          <p className="text-lg text-surface-500 mb-8">
            Join thousands of users who are already using Lumora AI to boost productivity.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-xl gradient-brand text-white shadow-neon-lg hover-lift"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200 dark:border-surface-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-surface-900 dark:text-white">Lumora AI</span>
              </div>
              <p className="text-sm text-surface-500">Next-generation AI chat platform for everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold text-surface-900 dark:text-white mb-3">Product</h4>
              <div className="space-y-2">
                <Link href="/features" className="block text-sm text-surface-500 hover:text-brand-500">Features</Link>
                <Link href="/pricing" className="block text-sm text-surface-500 hover:text-brand-500">Pricing</Link>
                <Link href="/blog" className="block text-sm text-surface-500 hover:text-brand-500">Blog</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-surface-900 dark:text-white mb-3">Support</h4>
              <div className="space-y-2">
                <Link href="/contact" className="block text-sm text-surface-500 hover:text-brand-500">Contact</Link>
                <Link href="/faq" className="block text-sm text-surface-500 hover:text-brand-500">FAQ</Link>
                <Link href="/terms" className="block text-sm text-surface-500 hover:text-brand-500">Terms</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-surface-900 dark:text-white mb-3">Legal</h4>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-sm text-surface-500 hover:text-brand-500">Privacy Policy</Link>
                <Link href="/terms" className="block text-sm text-surface-500 hover:text-brand-500">Terms of Service</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-surface-200 dark:border-surface-800 mt-8 pt-8 text-center text-sm text-surface-500">
            &copy; {new Date().getFullYear()} Lumora AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// ====================================================
// DATA
// ====================================================

const features = [
  { icon: Brain, title: 'Multi-Model AI', description: 'Access GPT-4, Gemini Pro, Claude, and Grok all in one interface. Switch models seamlessly.' },
  { icon: Zap, title: 'Streaming Responses', description: 'Real-time AI responses with beautiful typing animation and instant feedback.' },
  { icon: Code2, title: 'Code Generation', description: 'Generate, debug, and explain code with syntax highlighting and one-click copy.' },
  { icon: Image, title: 'Image Generation', description: 'Create stunning AI images with DALL-E integration and prompt optimization.' },
  { icon: Shield, title: 'Enterprise Security', description: 'End-to-end encryption, CSRF protection, rate limiting, and secure authentication.' },
  { icon: Globe, title: 'Multi-Language', description: 'Chat in any language with AI that understands and responds in your preferred language.' },
  { icon: CreditCard, title: 'Flexible Billing', description: 'Multiple payment gateways including Stripe, PayPal, Razorpay, and more.' },
  { icon: Cpu, title: 'High Performance', description: 'Optimized for speed with lazy loading, streaming, and efficient caching.' },
  { icon: Lock, title: 'Privacy First', description: 'Your conversations are private. No data sharing with third parties.' },
];

const plans = [
  {
    name: 'Free',
    price: 0,
    popular: false,
    cta: 'Start Free',
    features: ['50 messages/day', 'Gemini Flash model', 'Basic chat features', 'Community support'],
  },
  {
    name: 'Pro',
    price: 19,
    popular: true,
    cta: 'Upgrade to Pro',
    features: ['500 messages/day', 'All AI models', 'Image generation', 'Priority support', 'Advanced features', 'API access'],
  },
  {
    name: 'Enterprise',
    price: 49,
    popular: false,
    cta: 'Contact Sales',
    features: ['Unlimited messages', 'All AI models', 'Unlimited images', 'Dedicated support', 'Custom integrations', 'Team management'],
  },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Software Engineer', text: 'Lumora AI has completely transformed how I write code. The multi-model approach means I always get the best answer.' },
  { name: 'Marcus Johnson', role: 'Content Creator', text: 'The image generation and writing assistance are incredible. Best AI tool I have ever used for content creation.' },
  { name: 'Priya Patel', role: 'Startup Founder', text: 'We replaced 3 different AI subscriptions with Lumora. The value is unmatched and the interface is beautiful.' },
];
