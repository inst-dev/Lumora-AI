/**
 * ====================================================
 * LUMORA AI - Session Verification API
 * ====================================================
 * Validates current user session and returns user data.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/security/jwt';
import { query } from '@/lib/database/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('lumora_session')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Verify JWT token
    const decoded = verifyToken(token);
    if (!decoded || decoded.type !== 'access') {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Fetch user from database
    const users = await query(
      'SELECT id, name, email, role, avatar, status, created_at FROM users WHERE id = ? AND status != "banned" LIMIT 1',
      [decoded.id]
    );

    if (users.length === 0) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = users[0];

    // Get subscription info
    const subscriptions = await query(
      `SELECT us.*, sp.name as plan_name, sp.slug as plan_slug, sp.messages_per_day, sp.max_tokens, sp.image_generation
       FROM user_subscriptions us
       JOIN subscription_plans sp ON us.plan_id = sp.id
       WHERE us.user_id = ? AND us.status = 'active'
       ORDER BY us.created_at DESC LIMIT 1`,
      [user.id]
    );

    return NextResponse.json({
      user: {
        ...user,
        subscription: subscriptions[0] || null,
      },
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
