/**
 * ====================================================
 * LUMORA AI - Chat Conversation Page
 * ====================================================
 * Individual chat conversation with URL-based routing.
 * Format: /c/{conversation-uuid}
 */

'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import ChatArea from '@/components/chat/ChatArea';
import { useChat } from '@/providers/ChatProvider';

export default function ConversationPage() {
  const params = useParams();
  const { loadMessages, setActiveConversation } = useChat();

  // Load conversation messages on mount
  useEffect(() => {
    if (params.id) {
      setActiveConversation(params.id);
      loadMessages(params.id);
    }
  }, [params.id, loadMessages, setActiveConversation]);

  return <ChatArea />;
}
