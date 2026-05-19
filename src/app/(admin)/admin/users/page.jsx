/**
 * ====================================================
 * LUMORA AI - Admin Users Management
 * ====================================================
 * User listing with search, filters, and actions.
 */

'use client';

import { useState } from 'react';
import { Search, Filter, MoreHorizontal, Ban, Mail, Eye, Trash2, Shield } from 'lucide-react';
import clsx from 'clsx';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Dropdown, { DropdownItem } from '@/components/ui/Dropdown';

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Users</h1>
          <p className="text-sm text-surface-500 mt-1">Manage platform users and access</p>
        </div>
        <Button variant="primary" icon={Shield}>Add User</Button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
            <option value="moderator">Moderators</option>
          </select>
        </div>
      </div>

      {/* Users table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                <th className="text-left px-6 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">Plan</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">Joined</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
              {sampleUsers.map((user, i) => (
                <tr key={i} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-surface-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-surface-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === 'admin' ? 'primary' : 'default'}>{user.role}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.plan === 'Pro' ? 'primary' : user.plan === 'Enterprise' ? 'info' : 'default'}>
                      {user.plan}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.status === 'active' ? 'success' : user.status === 'banned' ? 'danger' : 'warning'} dot>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-500">{user.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <Dropdown
                      trigger={
                        <button className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700">
                          <MoreHorizontal className="w-4 h-4 text-surface-500" />
                        </button>
                      }
                    >
                      {(close) => (
                        <>
                          <DropdownItem icon={Eye} onClick={close}>View Details</DropdownItem>
                          <DropdownItem icon={Mail} onClick={close}>Send Email</DropdownItem>
                          <DropdownItem icon={Ban} onClick={close}>Ban User</DropdownItem>
                          <DropdownItem icon={Trash2} onClick={close} danger>Delete</DropdownItem>
                        </>
                      )}
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const sampleUsers = [
  { name: 'John Doe', email: 'john@example.com', role: 'admin', plan: 'Enterprise', status: 'active', joined: 'Jan 15, 2024' },
  { name: 'Sarah Smith', email: 'sarah@example.com', role: 'user', plan: 'Pro', status: 'active', joined: 'Feb 3, 2024' },
  { name: 'Mike Johnson', email: 'mike@example.com', role: 'user', plan: 'Free', status: 'active', joined: 'Mar 10, 2024' },
  { name: 'Emily Brown', email: 'emily@example.com', role: 'moderator', plan: 'Pro', status: 'active', joined: 'Mar 22, 2024' },
  { name: 'Alex Wilson', email: 'alex@example.com', role: 'user', plan: 'Free', status: 'banned', joined: 'Apr 5, 2024' },
];
