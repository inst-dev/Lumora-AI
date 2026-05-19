/**
 * ====================================================
 * LUMORA AI - Chat Provider
 * ====================================================
 * Manages chat state, conversations, and message streaming.
 * Provides a complete chat interface API for components.
 */

'use client';

import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { generateId } from '@/utils/helpers';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  // Chat state
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [streamingMessage, setStreamingMessage] = useState('');
  
  // Refs for abort control
  const abortControllerRef = useRef(null);
  const router = useRouter();

  /**
   * Load user's conversation list
   */
  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/chat/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  }, []);

  /**
   * Load messages for a specific conversation
   * @param {string} conversationId - Conversation UUID
   */
  const loadMessages = useCallback(async (conversationId) => {
    try {
      const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        setActiveConversation(conversationId);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, []);

  /**
   * Send a message and stream the AI response
   * @param {string} content - User message content
   * @param {string} conversationId - Optional existing conversation ID
   */
  const sendMessage = useCallback(async (content, conversationId = null) => {
    if (isGenerating || !content.trim()) return;

    setIsGenerating(true);
    setStreamingMessage('');

    // Create user message
    const userMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Create abort controller for stop functionality
    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          conversationId: conversationId || activeConversation,
          model: selectedModel,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      // Handle streaming response
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      let newConversationId = conversationId || activeConversation;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullResponse += parsed.content;
                setStreamingMessage(fullResponse);
              }
              if (parsed.conversationId) {
                newConversationId = parsed.conversationId;
              }
            } catch {
              // Skip malformed JSON chunks
            }
          }
        }
      }

      // Finalize assistant message
      const assistantMessage = {
        id: generateId(),
        role: 'assistant',
        content: fullResponse,
        model: selectedModel,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingMessage('');

      // Update conversation if new
      if (newConversationId && !activeConversation) {
        setActiveConversation(newConversationId);
        router.push(`/c/${newConversationId}`);
        loadConversations();
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        // User stopped generation
        if (streamingMessage) {
          const partialMessage = {
            id: generateId(),
            role: 'assistant',
            content: streamingMessage,
            model: selectedModel,
            created_at: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, partialMessage]);
        }
      } else {
        // Show error message
        const errorMessage = {
          id: generateId(),
          role: 'assistant',
          content: `⚠️ ${error.message || 'Something went wrong. Please try again.'}`,
          created_at: new Date().toISOString(),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsGenerating(false);
      setStreamingMessage('');
      abortControllerRef.current = null;
    }
  }, [isGenerating, activeConversation, selectedModel, streamingMessage, router, loadConversations]);

  /**
   * Stop the current generation
   */
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  /**
   * Create a new conversation
   */
  const newConversation = useCallback(() => {
    setActiveConversation(null);
    setMessages([]);
    setStreamingMessage('');
    router.push('/dashboard');
  }, [router]);

  /**
   * Delete a conversation
   * @param {string} conversationId - Conversation to delete
   */
  const deleteConversation = useCallback(async (conversationId) => {
    try {
      await fetch(`/api/chat/conversations?id=${conversationId}`, { method: 'DELETE' });
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      if (activeConversation === conversationId) {
        newConversation();
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  }, [activeConversation, newConversation]);

  /**
   * Regenerate the last assistant message
   */
  const regenerateLastMessage = useCallback(async () => {
    if (messages.length < 2) return;
    
    // Remove last assistant message
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      setMessages((prev) => prev.slice(0, -1));
      await sendMessage(lastUserMessage.content, activeConversation);
    }
  }, [messages, activeConversation, sendMessage]);

  const value = {
    conversations,
    activeConversation,
    messages,
    isGenerating,
    selectedModel,
    streamingMessage,
    setSelectedModel,
    loadConversations,
    loadMessages,
    sendMessage,
    stopGeneration,
    newConversation,
    deleteConversation,
    regenerateLastMessage,
    setActiveConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

/**
 * Hook to access chat context
 */
export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}
