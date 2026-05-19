/**
 * ====================================================
 * LUMORA AI - User Settings Page
 * ====================================================
 * Account management with profile, password, and preferences.
 */

'use client';

import { useState } from 'react';
import { User, Lock, Bell, Palette, Shield, Save } from 'lucide-react';
import clsx from 'clsx';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/components/ui/Toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'password', name: 'Password', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'security', name: 'Security', icon: Shield },
  ];

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Settings saved successfully');
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Settings</h1>
        <Button variant="primary" icon={Save} loading={saving} onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Tabs */}
        <nav className="w-48 flex-shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 glass-card p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Profile Information</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full gradient-brand flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.[0] || 'U'}
                </div>
                <Button variant="secondary" size="sm">Change Avatar</Button>
              </div>
              <Input label="Full Name" defaultValue={user?.name || ''} />
              <Input label="Email Address" defaultValue={user?.email || ''} disabled helperText="Contact support to change email" />
            </div>
          )}

          {activeTab === 'password' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Change Password</h2>
              <Input label="Current Password" type="password" />
              <Input label="New Password" type="password" />
              <Input label="Confirm New Password" type="password" />
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Appearance</h2>
              <div className="grid grid-cols-3 gap-4">
                {['Light', 'Dark', 'System'].map((theme) => (
                  <button
                    key={theme}
                    className={clsx(
                      'p-4 rounded-xl border-2 text-center transition-all',
                      theme === 'Dark'
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                        : 'border-surface-200 dark:border-surface-700 hover:border-brand-300'
                    )}
                  >
                    <Palette className="w-6 h-6 mx-auto mb-2 text-surface-600 dark:text-surface-400" />
                    <span className="text-sm font-medium text-surface-900 dark:text-white">{theme}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Security</h2>
              <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-900 dark:text-white">Active Sessions</p>
                  <p className="text-xs text-surface-500">Manage your logged-in devices</p>
                </div>
                <Button variant="secondary" size="sm">Manage</Button>
              </div>
              <div className="p-4 rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Danger Zone</p>
                <p className="text-xs text-red-500 mt-1 mb-3">Permanently delete your account and all data</p>
                <Button variant="danger" size="sm">Delete Account</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
