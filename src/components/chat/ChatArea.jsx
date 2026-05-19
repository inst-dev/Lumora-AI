/**
 * ====================================================
 * LUMORA AI - Chat Area Component
 * ====================================================
 * Main chat viewport with auto-scroll, streaming display,
 * and empty state.
 */

'use client';

import { useEffect, useRef } from 'react';
import { Sparkles, Zap, Brain, Image, Code } from 'lucide-react';
import clsx from 'clsx';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useChat } from '@/providers/ChatProvider';
import { MessageSkeleton } from '@/components/ui/Skeleton';

export default function ChatArea() {
  const { messages, isGenerating, streamingMessage, regenerateLastMessage } = useChat();
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin"
      >
        {hasMessages ? (
          <div className="max-w-3xl mx-auto">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id || index}
                message={message}
                onRegenerate={index === messages.length - 1 ? regenerateLastMessage : undefined}
              />
            ))}

            {/* Streaming message */}
            {isGenerating && streamingMessage && (
              <ChatMessage
                message={{ role: 'assistant', content: streamingMessage }}
                isStreaming={true}
              />
            )}

            {/* Loading indicator */}
            {isGenerating && !streamingMessage && (
              <div className="flex gap-3 px-4 py-5">
                <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white animate-pulse-soft" />
                </div>
                <div className="flex items-center gap-1 pt-2">
                  <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Chat input */}
      <ChatInput />
    </div>
  );
}

/**
 * Empty state shown when no messages exist
 */
function EmptyState() {
  const { sendMessage } = useChat();

  const suggestions = [
    { icon: Code, text: 'Help me write a React component', color: 'text-blue-500' },
    { icon: Brain, text: 'Explain quantum computing simply', color: 'text-purple-500' },
    { icon: Image, text: 'Generate a creative story idea', color: 'text-pink-500' },
    { icon: Zap, text: 'Optimize my website performance', color: 'text-yellow-500' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo & welcome */}
        <div className="space-y-4 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto shadow-neon">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
            How can I help you today?
          </h1>
          <p className="text-surface-500 text-lg">
            Powered by the world&apos;s most advanced AI models
          </p>
        </div>

        {/* Suggestion cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-slide-up">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => sendMessage(suggestion.text)}
              className={clsx(
                'flex items-center gap-3 p-4 rounded-xl text-left',
                'border border-surface-200 dark:border-surface-700',
                'hover:border-brand-300 dark:hover:border-brand-500/50',
                'hover:bg-brand-50/50 dark:hover:bg-brand-500/5',
                'transition-all duration-200 hover-lift'
              )}
            >
              <suggestion.icon className={clsx('w-5 h-5 flex-shrink-0', suggestion.color)} />
              <span className="text-sm text-surface-700 dark:text-surface-300">
                {suggestion.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
