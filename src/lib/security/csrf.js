/**
 * ====================================================
 * LUMORA AI - CSRF Protection
 * ====================================================
 * Implements CSRF token generation and validation
 * using double-submit cookie pattern.
 */

import { generateRandomToken, generateHash } from './encryption';

const CSRF_SECRET = process.env.CSRF_SECRET || 'csrf-default-secret';

/**
 * Generate a CSRF token
 * @returns {string} CSRF token
 */
export function generateCsrfToken() {
  const token = generateRandomToken(32);
  const signature = generateHash(token + CSRF_SECRET);
  return `${token}.${signature}`;
}

/**
 * Validate a CSRF token
 * @param {string} token - Token to validate
 * @returns {boolean} True if valid
 */
export function validateCsrfToken(token) {
  if (!token || !token.includes('.')) return false;
  
  const [tokenValue, signature] = token.split('.');
  const expectedSignature = generateHash(tokenValue + CSRF_SECRET);
  
  return signature === expectedSignature;
}
