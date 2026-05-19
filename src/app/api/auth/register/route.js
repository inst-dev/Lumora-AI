/**
 * ====================================================
 * LUMORA AI - Registration API Route
 * ====================================================
 * Handles new user registration with email verification.
 * Validates input, hashes passwords, and creates user record.
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/database/db';
import { hashPassword } from '@/lib/security/password';
import { validateRequest, registerSchema } from '@/lib/security/validation';
import { generateId, getClientIP } from '@/utils/helpers';
import { generateRandomToken } from '@/lib/security/encryption';
import { checkRateLimit } from '@/lib/security/rate-limiter';

export async function POST(request) {
  try {
    const ip = getClientIP(request);

    // Rate limiting
    const rateLimit = checkRateLimit(`register:${ip}`, { windowMs: 3600000, maxRequests: 5 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateRequest(body, registerSchema);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Check if email already exists
    const existing = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate verification token
    const verificationToken = generateRandomToken(32);

    // Create user
    const userId = generateId();
    await query(
      `INSERT INTO users (id, name, email, password, verification_token, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [userId, name, email, hashedPassword, verificationToken]
    );

    // Assign free plan
    const freePlan = await query('SELECT id FROM subscription_plans WHERE slug = ? LIMIT 1', ['free']);
    if (freePlan.length > 0) {
      await query(
        `INSERT INTO user_subscriptions (id, user_id, plan_id, status, billing_cycle) 
         VALUES (?, ?, ?, 'active', 'monthly')`,
        [generateId(), userId, freePlan[0].id]
      );
    }

    // TODO: Send verification email (implement with SMTP service)
    // await sendVerificationEmail(email, name, verificationToken);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.',
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
