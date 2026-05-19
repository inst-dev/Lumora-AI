/**
 * ====================================================
 * LUMORA AI - Admin Support Tickets
 * ====================================================
 */

'use client';

import { MessageSquare, Clock, CheckCircle } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function AdminSupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Support Tickets</h1>
        <p className="text-sm text-surface-500 mt-1">Manage user support requests</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <p className="text-sm text-surface-500">Open Tickets</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">12</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-surface-500">In Progress</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">5</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-surface-500">Resolved Today</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">8</p>
        </div>
      </div>

      <div className="glass-card">
        <div className="divide-y divide-surface-200 dark:divide-surface-700">
          {tickets.map((ticket, i) => (
            <div key={i} className="p-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 cursor-pointer transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">
                    {ticket.user[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-white">{ticket.subject}</p>
                    <p className="text-xs text-surface-500">{ticket.user} • {ticket.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={ticket.priority === 'high' ? 'danger' : ticket.priority === 'medium' ? 'warning' : 'default'}>
                    {ticket.priority}
                  </Badge>
                  <Badge variant={ticket.status === 'open' ? 'info' : ticket.status === 'resolved' ? 'success' : 'warning'}>
                    {ticket.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const tickets = [
  { subject: 'Cannot access Pro features', user: 'John Doe', priority: 'high', status: 'open', date: '2 hours ago' },
  { subject: 'Payment not processed', user: 'Sarah Smith', priority: 'high', status: 'in_progress', date: '5 hours ago' },
  { subject: 'How to change model?', user: 'Mike Johnson', priority: 'low', status: 'open', date: '1 day ago' },
  { subject: 'API rate limit issue', user: 'Emily Brown', priority: 'medium', status: 'resolved', date: '2 days ago' },
];
