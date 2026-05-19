/**
 * ====================================================
 * LUMORA AI - Messages API
 * ====================================================
 * Retrieves messages for a conversation.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/security/jwt';
import { query } from '@/lib/database/db';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('lumora_session')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid session' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 });
    }

    // Verify conversation belongs to user
    const conversation = await query(
      'SELECT id FROM conversations WHERE id = ? AND user_id = ?',
      [conversationId, decoded.id]
    );

    if (conversation.length === 0) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Fetch messages
    const messages = await query(
      `SELECT id, role, content, model, tokens_used, edited, created_at 
       FROM messages 
       WHERE conversation_id = ? 
       ORDER BY created_at ASC`,
      [conversationId]
    );

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Messages error:', error);
    return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 });
  }
}
