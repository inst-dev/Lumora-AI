/**
 * ====================================================
 * LUMORA AI - Admin Payments Page
 * ====================================================
 * Payment history and gateway management.
 */

'use client';

import { CreditCard, DollarSign, TrendingUp, Download } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Payments</h1>
        <p className="text-sm text-surface-500 mt-1">Transaction history and revenue tracking</p>
      </div>

      {/* Revenue stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <p className="text-sm text-surface-500 mb-2">This Month</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white">$12,847</p>
          <p className="text-xs text-green-500 mt-1">+15% from last month</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-surface-500 mb-2">Total Revenue</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white">$148,250</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-surface-500 mb-2">Pending Payouts</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white">$3,420</p>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
          <h2 className="font-semibold text-surface-900 dark:text-white">Recent Transactions</h2>
          <Button variant="secondary" size="sm" icon={Download}>Export</Button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-200 dark:border-surface-700">
              <th className="text-left px-6 py-3 text-xs font-medium text-surface-500 uppercase">User</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-surface-500 uppercase">Amount</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-surface-500 uppercase">Gateway</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-surface-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-surface-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
            {transactions.map((tx, i) => (
              <tr key={i} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                <td className="px-6 py-4 text-sm text-surface-900 dark:text-white">{tx.user}</td>
                <td className="px-6 py-4 text-sm font-medium text-surface-900 dark:text-white">${tx.amount}</td>
                <td className="px-6 py-4 text-sm text-surface-500">{tx.gateway}</td>
                <td className="px-6 py-4">
                  <Badge variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'danger'}>
                    {tx.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-surface-500">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const transactions = [
  { user: 'John Doe', amount: '19.00', gateway: 'Stripe', status: 'completed', date: 'May 19, 2024' },
  { user: 'Sarah Smith', amount: '49.00', gateway: 'PayPal', status: 'completed', date: 'May 18, 2024' },
  { user: 'Mike Johnson', amount: '19.00', gateway: 'Stripe', status: 'pending', date: 'May 18, 2024' },
  { user: 'Emily Brown', amount: '190.00', gateway: 'Stripe', status: 'completed', date: 'May 17, 2024' },
  { user: 'Alex Wilson', amount: '19.00', gateway: 'Razorpay', status: 'failed', date: 'May 17, 2024' },
];
