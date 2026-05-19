/**
 * ====================================================
 * LUMORA AI - Theme Provider
 * ====================================================
 * Manages dark/light mode with system preference detection.
 * Uses next-themes for SSR-safe theme switching.
 */

'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
