/**
 * ====================================================
 * LUMORA AI - Logout API Route
 * ====================================================
 * Invalidates session and clears cookies.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/security/jwt';
import { query } from '@/lib/database/db';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('lumora_session')?.value;

    if (token) {
      // Verify and remove session from database
      const decoded = verifyToken(token);
      if (decoded) {
        await query('DELETE FROM user_sessions WHERE user_id = ? AND token = ?', [decoded.id, token]);
      }
    }

    // Clear session cookie
    cookieStore.delete('lumora_session');

    return NextResponse.json({ success: true });
  } catch (error) {
    // Always succeed on logout even if there's an error
    return NextResponse.json({ success: true });
  }
}
