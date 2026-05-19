/**
 * ====================================================
 * LUMORA AI - Sidebar Component
 * ====================================================
 * Premium chat sidebar with conversation history,
 * search, and session management.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  MessageSquarePlus, Search, Pin, Archive, MoreHorizontal,
  Trash2, Edit3, Share2, Sparkles, Settings, LogOut,
  ChevronDown, Crown, X
} from 'lucide-react';
import clsx from 'clsx';
import { useChat } from '@/providers/ChatProvider';
import { useAuth } from '@/providers/AuthProvider';
import Dropdown, { DropdownItem } from '@/components/ui/Dropdown';
import { timeAgo, truncate } from '@/utils/helpers';

export default function Sidebar({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState([]);
  const { conversations, activeConversation, loadConversations, newConversation, deleteConversation } = useChat();
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Filter conversations by search
  useEffect(() => {
    if (searchQuery) {
      setFilteredConversations(
        conversations.filter((c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations]);

  // Group conversations by date
  const groupedConversations = groupByDate(filteredConversations);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto',
          'w-[280px] flex flex-col',
          'bg-white/95 dark:bg-surface-950/95 backdrop-blur-xl',
          'border-r border-surface-200 dark:border-surface-800',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-surface-900 dark:text-white">Lumora AI</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800"
          >
            <X className="w-5 h-5 text-surface-500" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => { newConversation(); onClose?.(); }}
            className={clsx(
              'w-full flex items-center gap-2 px-4 py-2.5 rounded-xl',
              'bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400',
              'border border-brand-500/20 transition-all duration-200',
              'font-medium text-sm'
            )}
          >
            <MessageSquarePlus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={clsx(
                'w-full pl-9 pr-4 py-2 text-sm rounded-lg',
                'bg-surface-100 dark:bg-surface-900 border-none',
                'text-surface-900 dark:text-surface-100',
                'placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30'
              )}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-2">
          {Object.entries(groupedConversations).map(([group, convos]) => (
            <div key={group} className="mb-4">
              <p className="px-3 py-1.5 text-xs font-medium text-surface-500 uppercase tracking-wider">
                {group}
              </p>
              {convos.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={activeConversation === conversation.id}
                  onSelect={() => {
                    router.push(`/c/${conversation.id}`);
                    onClose?.();
                  }}
                  onDelete={() => deleteConversation(conversation.id)}
                />
              ))}
            </div>
          ))}

          {filteredConversations.length === 0 && (
            <div className="text-center py-8 text-surface-500">
              <MessageSquarePlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
            </div>
          )}
        </div>

        {/* User section */}
        <div className="border-t border-surface-200 dark:border-surface-800 p-3">
          <Dropdown
            align="left"
            trigger={
              <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 font-medium text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-surface-900 dark:text-white truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-surface-500 truncate">{user?.email || ''}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-surface-400" />
              </button>
            }
          >
            {(close) => (
              <>
                <DropdownItem icon={Crown} onClick={() => { router.push('/billing'); close(); }}>
                  Upgrade Plan
                </DropdownItem>
                <DropdownItem icon={Settings} onClick={() => { router.push('/settings'); close(); }}>
                  Settings
                </DropdownItem>
                <div className="border-t border-surface-200 dark:border-surface-700 my-1" />
                <DropdownItem icon={LogOut} onClick={logout} danger>
                  Sign Out
                </DropdownItem>
              </>
            )}
          </Dropdown>
        </div>
      </aside>
    </>
  );
}

/**
 * Single conversation list item
 */
function ConversationItem({ conversation, isActive, onSelect, onDelete }) {
  return (
    <div
      className={clsx(
        'group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150',
        isActive
          ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300'
          : 'hover:bg-surface-100 dark:hover:bg-surface-800/50 text-surface-700 dark:text-surface-300'
      )}
      onClick={onSelect}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate font-medium">
          {conversation.pinned && <Pin className="inline w-3 h-3 mr-1" />}
          {truncate(conversation.title, 30)}
        </p>
        <p className="text-xs text-surface-500 mt-0.5">
          {timeAgo(conversation.updated_at || conversation.created_at)}
        </p>
      </div>

      {/* Actions dropdown */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
        <Dropdown
          trigger={
            <button className="p-1 rounded hover:bg-surface-200 dark:hover:bg-surface-700">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          }
        >
          {(close) => (
            <>
              <DropdownItem icon={Edit3} onClick={close}>Rename</DropdownItem>
              <DropdownItem icon={Pin} onClick={close}>Pin</DropdownItem>
              <DropdownItem icon={Share2} onClick={close}>Share</DropdownItem>
              <DropdownItem icon={Archive} onClick={close}>Archive</DropdownItem>
              <div className="border-t border-surface-200 dark:border-surface-700 my-1" />
              <DropdownItem icon={Trash2} onClick={() => { onDelete(); close(); }} danger>
                Delete
              </DropdownItem>
            </>
          )}
        </Dropdown>
      </div>
    </div>
  );
}

/**
 * Group conversations by relative date
 */
function groupByDate(conversations) {
  const groups = { Today: [], Yesterday: [], 'This Week': [], 'This Month': [], Older: [] };
  const now = new Date();

  conversations.forEach((conv) => {
    const date = new Date(conv.updated_at || conv.created_at);
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) groups['Today'].push(conv);
    else if (diffDays === 1) groups['Yesterday'].push(conv);
    else if (diffDays < 7) groups['This Week'].push(conv);
    else if (diffDays < 30) groups['This Month'].push(conv);
    else groups['Older'].push(conv);
  });

  // Remove empty groups
  return Object.fromEntries(Object.entries(groups).filter(([_, v]) => v.length > 0));
}
