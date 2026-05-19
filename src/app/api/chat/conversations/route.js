/**
 * ====================================================
 * LUMORA AI - Conversations API
 * ====================================================
 * CRUD operations for chat conversations.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/security/jwt';
import { query } from '@/lib/database/db';

/**
 * GET - List user's conversations
 */
export async function GET(request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = (page - 1) * limit;

    const conversations = await query(
      `SELECT id, title, model, provider, pinned, shared, message_count, last_message_at, created_at, updated_at
       FROM conversations 
       WHERE user_id = ? AND status = ?
       ORDER BY pinned DESC, last_message_at DESC, created_at DESC
       LIMIT ? OFFSET ?`,
      [user.id, status, limit, offset]
    );

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Conversations error:', error);
    return NextResponse.json({ error: 'Failed to load conversations' }, { status: 500 });
  }
}

/**
 * DELETE - Delete a conversation
 */
export async function DELETE(request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 });
    }

    // Soft delete (mark as deleted)
    await query(
      'UPDATE conversations SET status = "deleted" WHERE id = ? AND user_id = ?',
      [id, user.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete conversation error:', error);
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
  }
}

/**
 * PATCH - Update conversation (rename, pin, archive)
 */
export async function PATCH(request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, title, pinned, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 });
    }

    const updates = [];
    const params = [];

    if (title !== undefined) { updates.push('title = ?'); params.push(title); }
    if (pinned !== undefined) { updates.push('pinned = ?'); params.push(pinned); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    params.push(id, user.id);
    await query(
      `UPDATE conversations SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
      params
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update conversation error:', error);
    return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 });
  }
}

/**
 * Helper: Get authenticated user from session
 */
async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('lumora_session')?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  return decoded;
}
