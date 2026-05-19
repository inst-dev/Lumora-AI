/**
 * ====================================================
 * LUMORA AI - Utility Helpers
 * ====================================================
 * Common utility functions used throughout the application.
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a UUID v4
 * @returns {string} New UUID
 */
export function generateId() {
  return uuidv4();
}

/**
 * Format a date to relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return past.toLocaleDateString();
}

/**
 * Format number to compact notation (e.g., 1.2K)
 * @param {number} num - Number to format
 * @returns {string} Formatted string
 */
export function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

/**
 * Format currency amount
 * @param {number} amount - Amount
 * @param {string} currency - Currency code (default USD)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Generate a slug from text
 * @param {string} text - Text to slugify
 * @returns {string} URL-friendly slug
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Debounce a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

/**
 * Sleep/delay for specified milliseconds
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Parse JSON safely
 * @param {string} str - JSON string
 * @param {*} fallback - Fallback value on error
 * @returns {*} Parsed value or fallback
 */
export function parseJSON(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * Get client IP from request
 * @param {Request} request - Next.js request
 * @returns {string} Client IP address
 */
export function getClientIP(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * Create API response helper
 * @param {Object} data - Response data
 * @param {number} status - HTTP status code
 * @returns {Response} JSON response
 */
export function apiResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Create error response helper
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @returns {Response} JSON error response
 */
export function apiError(message, status = 400) {
  return new Response(
    JSON.stringify({ success: false, error: message }),
    { status, headers: { 'Content-Type': 'application/json' } }
  );
}

/**
 * Estimate token count from text (rough approximation)
 * @param {string} text - Text to estimate
 * @returns {number} Estimated token count
 */
export function estimateTokens(text) {
  if (!text) return 0;
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}

/**
 * Extract initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 chars)
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
