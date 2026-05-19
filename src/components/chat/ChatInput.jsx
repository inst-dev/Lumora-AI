/**
 * ====================================================
 * LUMORA AI - Chat Input Component
 * ====================================================
 * Premium chat input with auto-resize, model selection,
 * and streaming control buttons.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Square, Paperclip, Sparkles, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { useChat } from '@/providers/ChatProvider';
import Dropdown, { DropdownItem } from '@/components/ui/Dropdown';

// Available AI models for selection
const models = [
  { id: 'gemini-2.0-flash', name: 'Gemini Flash', provider: 'Google', free: true },
  { id: 'gemini-1.5-pro', name: 'Gemini Pro', provider: 'Google', free: false },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', free: false },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', free: false },
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', free: false },
  { id: 'grok-2', name: 'Grok 2', provider: 'xAI', free: false },
];

export default function ChatInput() {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const { sendMessage, stopGeneration, isGenerating, selectedModel, setSelectedModel } = useChat();

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [input]);

  /**
   * Handle message submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    sendMessage(input);
    setInput('');
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const currentModel = models.find((m) => m.id === selectedModel) || models[0];

  return (
    <div className="border-t border-surface-200 dark:border-surface-800 bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl">
      <div className="max-w-3xl mx-auto px-4 py-3">
        {/* Model selector */}
        <div className="flex items-center gap-2 mb-2">
          <Dropdown
            align="left"
            trigger={
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 transition-colors">
                <Sparkles className="w-3 h-3 text-brand-500" />
                {currentModel.name}
                <ChevronDown className="w-3 h-3" />
              </button>
            }
          >
            {(close) => (
              <div className="max-h-64 overflow-y-auto">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => { setSelectedModel(model.id); close(); }}
                    className={clsx(
                      'flex items-center justify-between w-full px-4 py-2 text-sm transition-colors',
                      model.id === selectedModel
                        ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400'
                        : 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300'
                    )}
                  >
                    <div>
                      <p className="font-medium">{model.name}</p>
                      <p className="text-xs text-surface-500">{model.provider}</p>
                    </div>
                    {model.free && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 font-medium">
                        FREE
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </Dropdown>
        </div>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="relative">
          <div className={clsx(
            'flex items-end gap-2 rounded-2xl border transition-all duration-200',
            'bg-surface-50 dark:bg-surface-900',
            'border-surface-200 dark:border-surface-700',
            'focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20',
            'px-4 py-3'
          )}>
            {/* Attachment button */}
            <button
              type="button"
              className="p-1.5 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              rows={1}
              className={clsx(
                'flex-1 resize-none bg-transparent border-none outline-none',
                'text-surface-900 dark:text-white text-sm',
                'placeholder:text-surface-400 dark:placeholder:text-surface-500',
                'max-h-[200px] scrollbar-thin'
              )}
            />

            {/* Send/Stop button */}
            {isGenerating ? (
              <button
                type="button"
                onClick={stopGeneration}
                className="p-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors"
                title="Stop generating"
              >
                <Square className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className={clsx(
                  'p-2 rounded-xl transition-all duration-200',
                  input.trim()
                    ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                    : 'bg-surface-200 dark:bg-surface-700 text-surface-400 cursor-not-allowed'
                )}
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Footer hint */}
          <p className="text-center text-[11px] text-surface-400 mt-2">
            Lumora AI can make mistakes. Consider checking important information.
          </p>
        </form>
      </div>
    </div>
  );
}
