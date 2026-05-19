/**
 * ====================================================
 * LUMORA AI - JWT Token Management
 * ====================================================
 * Handles JWT token creation, verification, and refresh.
 * Uses secure signing with configurable expiration.
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default-dev-secret-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
const REFRESH_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '30d';

/**
 * Generate access token for authenticated user
 * @param {Object} payload - User data to encode
 * @returns {string} Signed JWT token
 */
export function generateAccessToken(payload) {
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      type: 'access',
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

/**
 * Generate refresh token for session renewal
 * @param {Object} payload - User data to encode
 * @returns {string} Signed refresh token
 */
export function generateRefreshToken(payload) {
  return jwt.sign(
    {
      id: payload.id,
      type: 'refresh',
    },
    JWT_SECRET,
    { expiresIn: REFRESH_EXPIRY }
  );
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Decode token without verification (for inspection)
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload
 */
export function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
}

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired
 */
export function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
}
