/**
 * ====================================================
 * LUMORA AI - Input Validation & Sanitization
 * ====================================================
 * Validates and sanitizes user input to prevent XSS,
 * SQL injection, and other security vulnerabilities.
 */

import { z } from 'zod';

/**
 * Sanitize string input - removes potential XSS
 * @param {string} input - Raw user input
 * @returns {string} Sanitized string
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize HTML content (allows basic formatting)
 * @param {string} html - HTML string
 * @returns {string} Sanitized HTML
 */
export function sanitizeHtml(html) {
  if (typeof html !== 'string') return '';
  // Remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript\s*:/gi, '');
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function isValidEmail(email) {
  const schema = z.string().email();
  return schema.safeParse(email).success;
}

/**
 * Validate UUID format
 * @param {string} id - UUID to validate
 * @returns {boolean} True if valid UUID
 */
export function isValidUUID(id) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// ====================================================
// VALIDATION SCHEMAS
// ====================================================

/** Login validation schema */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

/** Registration validation schema */
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

/** Chat message validation schema */
export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(50000),
  model: z.string().optional(),
  conversationId: z.string().uuid().optional(),
});

/** Subscription schema */
export const subscriptionSchema = z.object({
  planId: z.string().uuid(),
  billingCycle: z.enum(['monthly', 'yearly']),
  gateway: z.string(),
  couponCode: z.string().optional(),
});

/** Contact form schema */
export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(5000),
});

/**
 * Validate request body against a schema
 * @param {Object} body - Request body
 * @param {z.ZodSchema} schema - Zod validation schema
 * @returns {Object} Validation result
 */
export function validateRequest(body, schema) {
  const result = schema.safeParse(body);
  if (result.success) {
    return { valid: true, data: result.data, errors: null };
  }
  return {
    valid: false,
    data: null,
    errors: result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    })),
  };
}
