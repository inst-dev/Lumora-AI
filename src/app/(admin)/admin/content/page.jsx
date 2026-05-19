/**
 * ====================================================
 * LUMORA AI - Admin Content Management
 * ====================================================
 * Manage landing page, blog, FAQ, and legal pages.
 */

'use client';

import { FileText, Plus, Edit3, Eye, Globe } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Content Management</h1>
          <p className="text-sm text-surface-500 mt-1">Manage pages, blog posts, and site content</p>
        </div>
        <Button variant="primary" icon={Plus}>New Post</Button>
      </div>

      {/* Quick links */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { name: 'Landing Page', icon: Globe, href: '#' },
          { name: 'Blog Posts', icon: FileText, href: '#' },
          { name: 'FAQ Page', icon: FileText, href: '#' },
          { name: 'Legal Pages', icon: FileText, href: '#' },
        ].map((item, i) => (
          <button key={i} className="glass-card p-4 flex items-center gap-3 hover-lift text-left">
            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-500/10 flex items-center justify-center">
              <item.icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <span className="text-sm font-medium text-surface-900 dark:text-white">{item.name}</span>
          </button>
        ))}
      </div>

      {/* Blog posts */}
      <div className="glass-card">
        <div className="p-4 border-b border-surface-200 dark:border-surface-700">
          <h2 className="font-semibold text-surface-900 dark:text-white">Blog Posts</h2>
        </div>
        <div className="divide-y divide-surface-200 dark:divide-surface-700">
          {blogPosts.map((post, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-800/50">
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">{post.title}</p>
                <p className="text-xs text-surface-500 mt-1">{post.date} • {post.views} views</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={post.status === 'published' ? 'success' : 'warning'}>{post.status}</Badge>
                <Button variant="ghost" size="xs" icon={Edit3} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const blogPosts = [
  { title: 'Introducing Lumora AI - The Future of AI Chat', status: 'published', date: 'May 15, 2024', views: '1,234' },
  { title: 'How to Get the Most Out of AI Models', status: 'published', date: 'May 10, 2024', views: '892' },
  { title: 'Understanding Token Limits and Usage', status: 'draft', date: 'May 8, 2024', views: '0' },
];
