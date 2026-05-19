/**
 * ====================================================
 * LUMORA AI - Next.js Configuration
 * ====================================================
 * Production-optimized Next.js configuration.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  poweredByHeader: false, // Security: remove X-Powered-By header

  // Turbopack config (Next.js 16+)
  turbopack: {},

  // Image optimization
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

  // Redirect trailing slashes
  trailingSlash: false,
};

export default nextConfig;
