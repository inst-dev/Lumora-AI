/**
 * ====================================================
 * LUMORA AI - Admin License Management
 * ====================================================
 * View and manage license activation status.
 */

'use client';

import { CheckCircle, Key, Globe, Calendar, Shield, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function AdminLicensePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">License</h1>
        <p className="text-sm text-surface-500 mt-1">License activation and verification status</p>
      </div>

      {/* License status card */}
      <div className="glass-card p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-surface-900 dark:text-white">License Active</h2>
            <p className="text-sm text-surface-500">Your installation is properly licensed</p>
          </div>
          <Badge variant="success" className="ml-auto" dot>Verified</Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-surface-400" />
              <span className="text-xs font-medium text-surface-500">Purchase Code</span>
            </div>
            <p className="text-sm font-mono text-surface-900 dark:text-white">xxxxxxxx-xxxx-xxxx-xxxx-xxxx</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-surface-400" />
              <span className="text-xs font-medium text-surface-500">Registered Domain</span>
            </div>
            <p className="text-sm text-surface-900 dark:text-white">yourdomain.com</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-surface-400" />
              <span className="text-xs font-medium text-surface-500">Activation Date</span>
            </div>
            <p className="text-sm text-surface-900 dark:text-white">May 19, 2024</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-surface-400" />
              <span className="text-xs font-medium text-surface-500">License Type</span>
            </div>
            <p className="text-sm text-surface-900 dark:text-white">Regular License</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" icon={RefreshCw}>Re-verify License</Button>
          <Button variant="ghost" className="text-red-500 hover:text-red-600">Deactivate</Button>
        </div>
      </div>
    </div>
  );
}
