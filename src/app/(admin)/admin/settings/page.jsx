/**
 * ====================================================
 * LUMORA AI - Admin Settings Page
 * ====================================================
 * System configuration with grouped settings.
 */

'use client';

import { useState } from 'react';
import { Save, Globe, Mail, Palette, Shield, Bell, Database } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import clsx from 'clsx';

const settingsTabs = [
  { id: 'general', name: 'General', icon: Globe },
  { id: 'email', name: 'Email', icon: Mail },
  { id: 'appearance', name: 'Appearance', icon: Palette },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'database', name: 'Database', icon: Database },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Settings</h1>
          <p className="text-sm text-surface-500 mt-1">Configure your platform settings</p>
        </div>
        <Button variant="primary" icon={Save} loading={saving} onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Tabs */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors',
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
        </div>

        {/* Content */}
        <div className="flex-1 glass-card p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">General Settings</h2>
              <Input label="Site Name" defaultValue="Lumora AI" />
              <Input label="Site URL" defaultValue="https://lumora.ai" />
              <Input label="Site Description" defaultValue="Next-generation AI chat platform" />
              <div className="flex items-center justify-between p-4 rounded-lg bg-surface-50 dark:bg-surface-800">
                <div>
                  <p className="text-sm font-medium text-surface-900 dark:text-white">Registration</p>
                  <p className="text-xs text-surface-500">Allow new user registration</p>
                </div>
                <ToggleSwitch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-surface-50 dark:bg-surface-800">
                <div>
                  <p className="text-sm font-medium text-surface-900 dark:text-white">Maintenance Mode</p>
                  <p className="text-xs text-surface-500">Show maintenance page to visitors</p>
                </div>
                <ToggleSwitch />
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Email Settings (SMTP)</h2>
              <Input label="SMTP Host" defaultValue="smtp.gmail.com" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="SMTP Port" defaultValue="587" />
                <Input label="Encryption" defaultValue="TLS" />
              </div>
              <Input label="SMTP Username" defaultValue="" placeholder="your-email@gmail.com" />
              <Input label="SMTP Password" type="password" defaultValue="" />
              <Input label="From Name" defaultValue="Lumora AI" />
              <Input label="From Email" defaultValue="noreply@lumora.ai" />
              <Button variant="secondary">Send Test Email</Button>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Appearance</h2>
              <Input label="Primary Color" type="color" defaultValue="#6366f1" />
              <Input label="Logo URL" defaultValue="/images/logo.svg" />
              <Input label="Favicon URL" defaultValue="/favicon.ico" />
              <div className="flex items-center justify-between p-4 rounded-lg bg-surface-50 dark:bg-surface-800">
                <div>
                  <p className="text-sm font-medium text-surface-900 dark:text-white">Default Theme</p>
                  <p className="text-xs text-surface-500">Default theme for new users</p>
                </div>
                <select className="px-3 py-1.5 rounded-lg bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-sm">
                  <option>Dark</option>
                  <option>Light</option>
                  <option>System</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Security Settings</h2>
              <div className="flex items-center justify-between p-4 rounded-lg bg-surface-50 dark:bg-surface-800">
                <div>
                  <p className="text-sm font-medium text-surface-900 dark:text-white">Two-Factor Authentication</p>
                  <p className="text-xs text-surface-500">Require 2FA for admin accounts</p>
                </div>
                <ToggleSwitch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-surface-50 dark:bg-surface-800">
                <div>
                  <p className="text-sm font-medium text-surface-900 dark:text-white">Rate Limiting</p>
                  <p className="text-xs text-surface-500">Protect against brute force attacks</p>
                </div>
                <ToggleSwitch defaultChecked />
              </div>
              <Input label="Max Login Attempts" defaultValue="5" type="number" />
              <Input label="Lockout Duration (minutes)" defaultValue="15" type="number" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({ defaultChecked = false }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button
      onClick={() => setChecked(!checked)}
      className={clsx(
        'relative w-11 h-6 rounded-full transition-colors',
        checked ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-600'
      )}
    >
      <span className={clsx(
        'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
        checked && 'translate-x-5'
      )} />
    </button>
  );
}
