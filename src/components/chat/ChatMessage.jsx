/**
 * ====================================================
 * LUMORA AI - Chat Message Component
 * ====================================================
 * Renders individual chat messages with markdown support,
 * code highlighting, and action buttons.
 */

'use client';

import { useState, memo } from 'react';
import {
  Copy, Check, RefreshCw, ThumbsUp, ThumbsDown,
  Edit3, Trash2, Sparkles, User, MoreHorizontal
} from 'lucide-react';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Dropdown, { DropdownItem } from '@/components/ui/Dropdown';

const ChatMessage = memo(function ChatMessage({ message, isStreaming = false, onRegenerate, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isError = message.isError;

  /**
   * Copy message content to clipboard
   */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={clsx(
        'group flex gap-3 px-4 py-5 transition-colors',
        isUser ? 'bg-transparent' : 'bg-surface-50/50 dark:bg-surface-900/30',
        isError && 'bg-red-50/50 dark:bg-red-500/5'
      )}
    >
      {/* Avatar */}
      <div className={clsx(
        'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
        isUser
          ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
          : 'gradient-brand text-white'
      )}>
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Role label */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-surface-900 dark:text-white">
            {isUser ? 'You' : 'Lumora AI'}
          </span>
          {message.model && !isUser && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-500">
              {message.model}
            </span>
          )}
        </div>

        {/* Content */}
        <div className={clsx(
          'text-sm leading-relaxed text-surface-800 dark:text-surface-200',
          isUser ? '' : 'markdown-content'
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                // Custom code block renderer
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  if (!inline && match) {
                    return (
                      <CodeBlock
                        language={match[1]}
                        code={String(children).replace(/\n$/, '')}
                      />
                    );
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}

          {/* Streaming cursor */}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-brand-500 animate-pulse-soft ml-1 rounded-sm" />
          )}
        </div>

        {/* Action buttons (shown on hover) */}
        {!isStreaming && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <ActionButton
              icon={copied ? Check : Copy}
              onClick={handleCopy}
              title="Copy"
              active={copied}
            />
            {!isUser && (
              <>
                <ActionButton icon={RefreshCw} onClick={onRegenerate} title="Regenerate" />
                <ActionButton icon={ThumbsUp} title="Good response" />
                <ActionButton icon={ThumbsDown} title="Bad response" />
              </>
            )}
            <Dropdown
              trigger={
                <ActionButton icon={MoreHorizontal} title="More" />
              }
            >
              {(close) => (
                <>
                  <DropdownItem icon={Edit3} onClick={() => { onEdit?.(); close(); }}>Edit</DropdownItem>
                  <DropdownItem icon={Trash2} onClick={() => { onDelete?.(); close(); }} danger>Delete</DropdownItem>
                </>
              )}
            </Dropdown>
          </div>
        )}
      </div>
    </div>
  );
});

/**
 * Code block with copy button and language label
 */
function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group/code my-3 rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface-100 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
        <span className="text-xs font-mono text-surface-500">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      {/* Code content */}
      <pre className="p-4 overflow-x-auto bg-surface-950 text-surface-100">
        <code className={`language-${language} text-sm font-mono`}>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Small action button for message actions
 */
function ActionButton({ icon: Icon, onClick, title, active = false }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={clsx(
        'p-1.5 rounded-lg transition-colors',
        active
          ? 'text-brand-500'
          : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
      )}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

export default ChatMessage;
