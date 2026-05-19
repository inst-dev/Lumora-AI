/**
 * ====================================================
 * LUMORA AI - Installation Wizard
 * ====================================================
 * Premium step-by-step installer with system checks,
 * license verification, and database setup.
 */

'use client';

import { useState } from 'react';
import { Sparkles, CheckCircle, XCircle, AlertCircle, ArrowRight, ArrowLeft, Loader2, Shield, Database, Server, Key } from 'lucide-react';
import clsx from 'clsx';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// Installation steps
const STEPS = [
  { id: 'welcome', title: 'Welcome', icon: Sparkles },
  { id: 'requirements', title: 'Requirements', icon: Server },
  { id: 'license', title: 'License', icon: Key },
  { id: 'database', title: 'Database', icon: Database },
  { id: 'admin', title: 'Admin Account', icon: Shield },
  { id: 'complete', title: 'Complete', icon: CheckCircle },
];

export default function InstallPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [installData, setInstallData] = useState({
    purchaseCode: '',
    dbHost: 'localhost',
    dbPort: '3306',
    dbName: 'lumora_ai',
    dbUser: 'root',
    dbPassword: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    appName: 'Lumora AI',
    appUrl: '',
  });
  const [checks, setChecks] = useState(null);
  const [licenseValid, setLicenseValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateData = (field, value) => {
    setInstallData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  // Step navigation
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  /**
   * Check server requirements
   */
  const checkRequirements = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/install/check');
      const data = await res.json();
      setChecks(data.checks);
    } catch {
      setError('Failed to check requirements');
    }
    setLoading(false);
  };

  /**
   * Verify purchase code
   */
  const verifyLicense = async () => {
    if (!installData.purchaseCode) {
      setError('Purchase code is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/install/verify-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchaseCode: installData.purchaseCode }),
      });
      const data = await res.json();
      if (data.valid) {
        setLicenseValid(true);
        nextStep();
      } else {
        setError(data.error || 'Invalid purchase code');
      }
    } catch {
      setError('Verification failed. Please try again.');
    }
    setLoading(false);
  };

  /**
   * Test database connection
   */
  const testDatabase = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/install/test-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: installData.dbHost,
          port: installData.dbPort,
          name: installData.dbName,
          user: installData.dbUser,
          password: installData.dbPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        nextStep();
      } else {
        setError(data.error || 'Database connection failed');
      }
    } catch {
      setError('Connection test failed');
    }
    setLoading(false);
  };

  /**
   * Complete installation
   */
  const completeInstall = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/install/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(installData),
      });
      const data = await res.json();
      if (data.success) {
        nextStep();
      } else {
        setError(data.error || 'Installation failed');
      }
    } catch {
      setError('Installation failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-brand-50/20 to-surface-100 dark:from-surface-950 dark:via-brand-950/10 dark:to-surface-900 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center shadow-neon">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Lumora AI</h1>
              <p className="text-sm text-surface-500">Installation Wizard v1.0.0</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                index < currentStep
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                  ? 'bg-brand-500 text-white shadow-neon'
                  : 'bg-surface-200 dark:bg-surface-700 text-surface-500'
              )}>
                {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
              </div>
              {index < STEPS.length - 1 && (
                <div className={clsx(
                  'w-8 h-0.5 mx-1',
                  index < currentStep ? 'bg-green-500' : 'bg-surface-200 dark:bg-surface-700'
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          {/* Step content */}
          {currentStep === 0 && <WelcomeStep onNext={nextStep} />}
          {currentStep === 1 && (
            <RequirementsStep
              checks={checks}
              loading={loading}
              onCheck={checkRequirements}
              onNext={nextStep}
            />
          )}
          {currentStep === 2 && (
            <LicenseStep
              purchaseCode={installData.purchaseCode}
              onChange={(v) => updateData('purchaseCode', v)}
              onVerify={verifyLicense}
              loading={loading}
              error={error}
            />
          )}
          {currentStep === 3 && (
            <DatabaseStep
              data={installData}
              onChange={updateData}
              onTest={testDatabase}
              loading={loading}
              error={error}
            />
          )}
          {currentStep === 4 && (
            <AdminStep
              data={installData}
              onChange={updateData}
              onComplete={completeInstall}
              loading={loading}
              error={error}
            />
          )}
          {currentStep === 5 && <CompleteStep />}

          {/* Navigation */}
          {currentStep > 0 && currentStep < 5 && currentStep !== 2 && currentStep !== 3 && currentStep !== 4 && (
            <div className="flex justify-between mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
              <Button variant="ghost" onClick={prevStep} icon={ArrowLeft}>
                Back
              </Button>
              <Button variant="primary" onClick={nextStep} icon={ArrowRight} iconPosition="right">
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ====================================================
// STEP COMPONENTS
// ====================================================

function WelcomeStep({ onNext }) {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center mx-auto shadow-neon-lg">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
          Welcome to Lumora AI
        </h2>
        <p className="text-surface-500">
          Let&apos;s set up your AI chat platform in just a few steps.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 text-left">
        {['Multi AI Providers', 'Subscription System', 'Admin Dashboard', 'Premium UI/UX'].map((feature) => (
          <div key={feature} className="flex items-center gap-2 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-surface-700 dark:text-surface-300">{feature}</span>
          </div>
        ))}
      </div>
      <Button variant="gradient" size="lg" onClick={onNext} icon={ArrowRight} iconPosition="right">
        Start Installation
      </Button>
    </div>
  );
}

function RequirementsStep({ checks, loading, onCheck, onNext }) {
  const allPassed = checks && checks.every((c) => c.passed);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">System Requirements</h2>
        <p className="text-sm text-surface-500">Checking your server compatibility</p>
      </div>

      {!checks ? (
        <div className="text-center py-8">
          <Button onClick={onCheck} loading={loading} variant="primary" size="lg">
            Check Requirements
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {checks.map((check, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
              {check.passed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-surface-900 dark:text-white">{check.name}</p>
                <p className="text-xs text-surface-500">{check.message}</p>
              </div>
            </div>
          ))}
          {allPassed && (
            <Button variant="primary" fullWidth onClick={onNext} icon={ArrowRight} iconPosition="right">
              All Checks Passed - Continue
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function LicenseStep({ purchaseCode, onChange, onVerify, loading, error }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">License Verification</h2>
        <p className="text-sm text-surface-500">Enter your Envato purchase code to activate</p>
      </div>

      <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20">
        <p className="text-sm text-brand-700 dark:text-brand-300">
          Find your purchase code in your Envato Market downloads page.
          It looks like: <code className="font-mono text-xs">xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</code>
        </p>
      </div>

      <Input
        label="Purchase Code"
        icon={Key}
        value={purchaseCode}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your Envato purchase code"
        error={error}
      />

      <Button variant="gradient" fullWidth loading={loading} onClick={onVerify}>
        Verify & Activate
      </Button>
    </div>
  );
}

function DatabaseStep({ data, onChange, onTest, loading, error }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">Database Setup</h2>
        <p className="text-sm text-surface-500">Configure your MySQL database connection</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Host" value={data.dbHost} onChange={(e) => onChange('dbHost', e.target.value)} />
        <Input label="Port" value={data.dbPort} onChange={(e) => onChange('dbPort', e.target.value)} />
      </div>
      <Input label="Database Name" value={data.dbName} onChange={(e) => onChange('dbName', e.target.value)} />
      <Input label="Username" value={data.dbUser} onChange={(e) => onChange('dbUser', e.target.value)} />
      <Input label="Password" type="password" value={data.dbPassword} onChange={(e) => onChange('dbPassword', e.target.value)} />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button variant="gradient" fullWidth loading={loading} onClick={onTest}>
        Test Connection & Continue
      </Button>
    </div>
  );
}

function AdminStep({ data, onChange, onComplete, loading, error }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">Create Admin Account</h2>
        <p className="text-sm text-surface-500">Set up your administrator account</p>
      </div>

      <Input label="App Name" value={data.appName} onChange={(e) => onChange('appName', e.target.value)} />
      <Input label="App URL" value={data.appUrl} onChange={(e) => onChange('appUrl', e.target.value)} placeholder="https://yourdomain.com" />
      <Input label="Admin Name" value={data.adminName} onChange={(e) => onChange('adminName', e.target.value)} />
      <Input label="Admin Email" type="email" value={data.adminEmail} onChange={(e) => onChange('adminEmail', e.target.value)} />
      <Input label="Admin Password" type="password" value={data.adminPassword} onChange={(e) => onChange('adminPassword', e.target.value)} />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button variant="gradient" fullWidth loading={loading} onClick={onComplete}>
        Complete Installation
      </Button>
    </div>
  );
}

function CompleteStep() {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Installation Complete!</h2>
        <p className="text-surface-500">Your Lumora AI platform is ready to use.</p>
      </div>
      <div className="space-y-3">
        <a href="/admin/dashboard" className="block">
          <Button variant="gradient" fullWidth size="lg">
            Go to Admin Dashboard
          </Button>
        </a>
        <a href="/" className="block">
          <Button variant="secondary" fullWidth>
            Visit Homepage
          </Button>
        </a>
      </div>
    </div>
  );
}
