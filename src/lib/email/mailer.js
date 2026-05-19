/**
 * ====================================================
 * LUMORA AI - Email Service
 * ====================================================
 * Handles transactional email sending via SMTP.
 * Includes templates for common email types.
 */

import nodemailer from 'nodemailer';

/**
 * Create email transporter from environment config
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

/**
 * Send an email
 * @param {Object} options - Email options
 */
export async function sendEmail({ to, subject, html, text }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn('Email not configured - skipping send');
    return { sent: false, reason: 'SMTP not configured' };
  }

  const transporter = createTransporter();
  const fromName = process.env.SMTP_FROM_NAME || 'Lumora AI';
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  const info = await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    html,
    text,
  });

  return { sent: true, messageId: info.messageId };
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(email, name, token) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  return sendEmail({
    to: email,
    subject: 'Verify your email - Lumora AI',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Lumora AI, ${name}!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Verify Email
        </a>
        <p style="color: #666; font-size: 14px; margin-top: 16px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email, name, token) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  
  return sendEmail({
    to: email,
    subject: 'Reset your password - Lumora AI',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hi ${name}, we received a request to reset your password.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 14px; margin-top: 16px;">
          This link expires in 1 hour. If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
  });
}
