/**
 * ====================================================
 * LUMORA AI - Authentication Provider
 * ====================================================
 * Manages user authentication state across the application.
 * Provides login, logout, and session refresh functionality.
 */

'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Authentication context
const AuthContext = createContext(null);

/**
 * Auth Provider Component
 * Wraps the application to provide authentication state
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  /**
   * Check current session on mount
   */
  useEffect(() => {
    checkSession();
  }, []);

  /**
   * Verify existing session with server
   */
  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      // Session invalid or expired
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user with credentials
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} rememberMe - Persist session
   * @returns {Object} Login result
   */
  const login = async (email, password, rememberMe = false) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, user: data.user };
      }

      return { success: false, error: data.error || 'Login failed' };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  /**
   * Register new user
   * @param {Object} userData - Registration data
   * @returns {Object} Registration result
   */
  const register = async (userData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        return { success: true, message: data.message };
      }

      return { success: false, error: data.error || 'Registration failed' };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  /**
   * Logout user and clear session
   */
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Silent fail on logout API
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    }
  }, [router]);

  /**
   * Update user profile data
   * @param {Object} updates - Profile updates
   */
  const updateUser = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access authentication context
 * @returns {Object} Auth context value
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
