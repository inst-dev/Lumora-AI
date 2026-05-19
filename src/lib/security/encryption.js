/**
 * ====================================================
 * LUMORA AI - Encryption Utilities
 * ====================================================
 * Provides AES encryption/decryption for sensitive data
 * like API keys and license information.
 */

import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';

/**
 * Encrypt sensitive data using AES-256
 * @param {string} text - Plain text to encrypt
 * @returns {string} Encrypted string
 */
export function encrypt(text) {
  if (!text) return '';
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

/**
 * Decrypt AES-256 encrypted data
 * @param {string} ciphertext - Encrypted string
 * @returns {string} Decrypted plain text
 */
export function decrypt(ciphertext) {
  if (!ciphertext) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return '';
  }
}

/**
 * Generate a secure random hash
 * @param {string} input - Input string
 * @returns {string} SHA-256 hash
 */
export function generateHash(input) {
  return CryptoJS.SHA256(input).toString();
}

/**
 * Generate a random token string
 * @param {number} length - Token length (default 64)
 * @returns {string} Random hex token
 */
export function generateRandomToken(length = 64) {
  return CryptoJS.lib.WordArray.random(length / 2).toString();
}
