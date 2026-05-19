/**
 * ====================================================
 * LUMORA AI - Password Hashing & Verification
 * ====================================================
 * Uses bcryptjs for secure password hashing with configurable rounds.
 */

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hash a plain text password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * Compare plain text password with hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} True if passwords match
 */
export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with score and messages
 */
export function validatePasswordStrength(password) {
  const errors = [];
  let score = 0;

  if (password.length >= 8) score++;
  else errors.push('Password must be at least 8 characters');

  if (/[A-Z]/.test(password)) score++;
  else errors.push('Include at least one uppercase letter');

  if (/[a-z]/.test(password)) score++;
  else errors.push('Include at least one lowercase letter');

  if (/\d/.test(password)) score++;
  else errors.push('Include at least one number');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  else errors.push('Include at least one special character');

  return {
    isValid: score >= 4,
    score,
    maxScore: 5,
    errors,
    strength: score <= 2 ? 'weak' : score <= 3 ? 'fair' : score <= 4 ? 'good' : 'strong',
  };
}
