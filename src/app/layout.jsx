/**
 * ====================================================
 * LUMORA AI - Root Layout
 * ====================================================
 * Application root with providers, fonts, and metadata.
 */

import './globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { ChatProvider } from '@/providers/ChatProvider';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata = {
  title: 'Lumora AI - Next-Generation AI Chat Platform',
  description: 'Experience the future of AI conversation with multi-model support, premium features, and enterprise-grade security.',
  keywords: 'AI, chatbot, GPT, Gemini, Claude, Grok, SaaS, chat platform',
  openGraph: {
    title: 'Lumora AI - Next-Generation AI Chat Platform',
    description: 'Experience the future of AI conversation with multi-model support.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts - Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white dark:bg-surface-950 text-surface-900 dark:text-surface-100 antialiased">
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <ChatProvider>
                {children}
              </ChatProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
