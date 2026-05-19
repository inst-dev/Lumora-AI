/**
 * ====================================================
 * LUMORA AI - Next.js Middleware
 * ====================================================
 * Handles route protection, security headers, and
 * installation status checking at the edge.
 */

import { NextResponse } from 'next/server';

/**
 * Middleware function - runs on every request
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // ====================================================
  // SECURITY HEADERS
  // ====================================================
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // ====================================================
  // INSTALLATION CHECK
  // ====================================================
  const isInstalled = process.env.INSTALLED === 'true';
  const isInstallRoute = pathname.startsWith('/install');
  const isApiInstallRoute = pathname.startsWith('/api/install');

  // If not installed, redirect all routes to installer (except install routes)
  if (!isInstalled && !isInstallRoute && !isApiInstallRoute && !pathname.startsWith('/_next') && !pathname.startsWith('/favicon')) {
    return NextResponse.redirect(new URL('/install', request.url));
  }

  // If already installed, block access to installer
  if (isInstalled && isInstallRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // ====================================================
  // AUTHENTICATION ROUTE PROTECTION
  // ====================================================
  const token = request.cookies.get('lumora_session')?.value;
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/forgot-password');
  const isProtectedRoute = pathname.startsWith('/c/') || pathname.startsWith('/dashboard') || pathname.startsWith('/settings') || pathname.startsWith('/billing');
  const isAdminRoute = pathname.startsWith('/admin');

  // Redirect authenticated users away from auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login for protected routes
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes require token (role check done in API)
  if (!token && isAdminRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

/**
 * Configure which routes the middleware runs on
 */
export const config = {
  matcher: [
    // Match all routes except static files and API internals
    '/((?!_next/static|_next/image|images|favicon.ico).*)',
  ],
};
