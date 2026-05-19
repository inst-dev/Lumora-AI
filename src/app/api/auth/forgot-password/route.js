/**
 * ====================================================
 * LUMORA AI - Forgot Password API
 * ====================================================
 * Sends password reset email with secure token.
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/database/db';
import { generateRandomToken } from '@/lib/security/encryption';
import { sendPasswordResetEmail } from '@/lib/email/mailer';
import { checkRateLimit } from '@/lib/security/rate-limiter';
import { getClientIP } from '@/utils/helpers';

export async function POST(request) {
  try {
    const ip = getClientIP(request);
    const rateLimit = checkRateLimit(`reset:${ip}`, { windowMs: 3600000, maxRequests: 3 });
    if (!rateLimit.success) {
      // Always return success to prevent email enumeration
      return NextResponse.json({ success: true });
    }

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ success: true }); // Don't reveal if email exists
    }

    const users = await query('SELECT id, name, email FROM users WHERE email = ? LIMIT 1', [email]);
    
    if (users.length > 0) {
      const user = users[0];
      const resetToken = generateRandomToken(32);
      const expiresAt = new Date(Date.now() + 3600000).toISOString().slice(0, 19).replace('T', ' '); // 1 hour

      await query(
        'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
        [resetToken, expiresAt, user.id]
      );

      // Send reset email
      await sendPasswordResetEmail(user.email, user.name, resetToken);
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ success: true });
  }
}
