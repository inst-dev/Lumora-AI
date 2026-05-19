/**
 * ====================================================
 * LUMORA AI - Rate Limiting
 * ====================================================
 * In-memory rate limiter for API endpoint protection.
 * Prevents brute force attacks and API abuse.
 */

// In-memory store (use Redis in production for multi-instance)
const rateLimitStore = new Map();

/**
 * Rate limit configuration
 */
const DEFAULT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
};

const AUTH_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // Only 5 login attempts per window
};

/**
 * Check if request is rate limited
 * @param {string} key - Unique identifier (IP or user ID)
 * @param {Object} config - Rate limit configuration
 * @returns {Object} Rate limit status
 */
export function checkRateLimit(key, config = DEFAULT_CONFIG) {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Get existing record or create new
  let record = rateLimitStore.get(key);
  
  if (!record || record.resetAt < now) {
    record = {
      count: 0,
      resetAt: now + config.windowMs,
      firstRequest: now,
    };
  }

  // Clean old entries periodically
  if (rateLimitStore.size > 10000) {
    cleanExpiredEntries();
  }

  record.count++;
  rateLimitStore.set(key, record);

  const remaining = Math.max(0, config.maxRequests - record.count);
  const isLimited = record.count > config.maxRequests;

  return {
    success: !isLimited,
    remaining,
    limit: config.maxRequests,
    resetAt: record.resetAt,
    retryAfter: isLimited ? Math.ceil((record.resetAt - now) / 1000) : 0,
  };
}

/**
 * Check auth-specific rate limit (stricter)
 * @param {string} key - IP address or identifier
 * @returns {Object} Rate limit status
 */
export function checkAuthRateLimit(key) {
  return checkRateLimit(`auth:${key}`, AUTH_CONFIG);
}

/**
 * Reset rate limit for a key (e.g., after successful login)
 * @param {string} key - Rate limit key
 */
export function resetRateLimit(key) {
  rateLimitStore.delete(key);
}

/**
 * Clean expired entries from memory
 */
function cleanExpiredEntries() {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}
