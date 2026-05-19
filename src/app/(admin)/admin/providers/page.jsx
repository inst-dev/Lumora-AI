/**
 * ====================================================
 * LUMORA AI - Admin AI Providers Management
 * ====================================================
 * Manage AI provider API keys and model settings.
 */

'use client';

import { useState } from 'react';
import { Cpu, Eye, EyeOff, Save, TestTube, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

const providers = [
  { id: 'gemini', name: 'Google Gemini', models: ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash'], color: 'text-blue-500 bg-blue-100 dark:bg-blue-500/10' },
  { id: 'openai', name: 'OpenAI', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'], color: 'text-green-500 bg-green-100 dark:bg-green-500/10' },
  { id: 'claude', name: 'Anthropic Claude', models: ['claude-3-5-sonnet', 'claude-3-haiku', 'claude-3-opus'], color: 'text-orange-500 bg-orange-100 dark:bg-orange-500/10' },
  { id: 'grok', name: 'xAI Grok', models: ['grok-2', 'grok-2-mini'], color: 'text-purple-500 bg-purple-100 dark:bg-purple-500/10' },
];

export default function AdminProvidersPage() {
  const [showKeys, setShowKeys] = useState({});
  const [activeStates, setActiveStates] = useState({ gemini: true, openai: true, claude: true, grok: false });

  const toggleKey = (id) => setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleActive = (id) => setActiveStates(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">AI Providers</h1>
          <p className="text-sm text-surface-500 mt-1">Configure AI model API keys and settings</p>
        </div>
        <Button variant="primary" icon={Save}>Save All</Button>
      </div>

      <div className="space-y-4">
        {providers.map((provider) => (
          <div key={provider.id} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', provider.color)}>
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-surface-900 dark:text-white">{provider.name}</h3>
                  <p className="text-xs text-surface-500">{provider.models.length} models available</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={activeStates[provider.id] ? 'success' : 'default'} dot>
                  {activeStates[provider.id] ? 'Active' : 'Inactive'}
                </Badge>
                <button
                  onClick={() => toggleActive(provider.id)}
                  className={clsx(
                    'relative w-11 h-6 rounded-full transition-colors',
                    activeStates[provider.id] ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-600'
                  )}
                >
                  <span className={clsx(
                    'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                    activeStates[provider.id] && 'translate-x-5'
                  )} />
                </button>
              </div>
            </div>

            {/* API Key input */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <Input
                  label="API Key"
                  type={showKeys[provider.id] ? 'text' : 'password'}
                  placeholder={`Enter ${provider.name} API key`}
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={() => toggleKey(provider.id)}
                  className="p-2.5 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800"
                >
                  {showKeys[provider.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <Button variant="secondary" size="md" icon={TestTube}>Test</Button>
              </div>
            </div>

            {/* Models */}
            <div>
              <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Available Models</p>
              <div className="flex flex-wrap gap-2">
                {provider.models.map((model) => (
                  <span key={model} className="px-3 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-xs font-mono text-surface-600 dark:text-surface-400">
                    {model}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
