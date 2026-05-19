/**
 * ====================================================
 * LUMORA AI - Login API Route
 * ====================================================
 * Handles user authentication with email/password.
 * Implements rate limiting and secure session creation.
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/database/db';
import { verifyPassword } from '@/lib/security/password';
import { generateAccessToken, generateRefreshToken } from '@/lib/security/jwt';
import { checkAuthRateLimit, resetRateLimit } from '@/lib/security/rate-limiter';
import { validateRequest, loginSchema } from '@/lib/security/validation';
import { generateId, getClientIP } from '@/utils/helpers';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const ip = getClientIP(request);

    // Rate limiting check
    const rateLimit = checkAuthRateLimit(ip);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: `Too many attempts. Try again in ${rateLimit.retryAfter} seconds.` },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateRequest(body, loginSchema);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password, rememberMe } = validation.data;

    // Find user by email
    const users = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return NextResponse.json(
        { success: false, error: 'Account is temporarily locked. Please try again later.' },
        { status: 423 }
      );
    }

    // Check if account is banned
    if (user.status === 'banned') {
      return NextResponse.json(
        { success: false, error: 'Your account has been suspended.' },
        { status: 403 }
      );
    }

    // Verify password
    const passwordValid = await verifyPassword(password, user.password);
    if (!passwordValid) {
      // Increment login attempts
      const attempts = (user.login_attempts || 0) + 1;
      const lockUntil = attempts >= 5
        ? new Date(Date.now() + 15 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ')
        : null;

      await query(
        'UPDATE users SET login_attempts = ?, locked_until = ? WHERE id = ?',
        [attempts, lockUntil, user.id]
      );

      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Successful login - reset attempts and rate limit
    await query(
      'UPDATE users SET login_attempts = 0, locked_until = NULL, last_login = NOW() WHERE id = ?',
      [user.id]
    );
    resetRateLimit(`auth:${ip}`);

    // Generate tokens
    const tokenPayload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Create session record
    const sessionId = generateId();
    await query(
      `INSERT INTO user_sessions (id, user_id, token, refresh_token, ip_address, user_agent, expires_at) 
       VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))`,
      [
        sessionId,
        user.id,
        accessToken,
        refreshToken,
        ip,
        request.headers.get('user-agent') || '',
        rememberMe ? 30 : 7,
      ]
    );

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('lumora_session', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60, // 30d or 7d
      path: '/',
    });

    // Return user data (exclude sensitive fields)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
