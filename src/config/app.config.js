/**
 * ====================================================
 * LUMORA AI - Application Configuration
 * ====================================================
 * Central configuration file for the entire application.
 * All configurable values are managed here for easy customization.
 */

const appConfig = {
  // Application metadata
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Lumora AI',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    description: 'Next-generation AI chat platform with multi-provider support',
    logo: '/images/logo.svg',
    favicon: '/favicon.ico',
  },

  // Authentication configuration
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiry: process.env.JWT_EXPIRY || '7d',
    refreshExpiry: process.env.REFRESH_TOKEN_EXPIRY || '30d',
    cookieName: process.env.SESSION_COOKIE_NAME || 'lumora_session',
    bcryptRounds: 12,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },

  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    name: process.env.DB_NAME || 'lumora_ai',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  },

  // AI Provider defaults
  ai: {
    defaultModel: 'gemini-pro',
    maxTokens: 4096,
    temperature: 0.7,
    streamingEnabled: true,
    freeModelLimit: 50, // messages per day for free users
    providers: {
      gemini: {
        name: 'Google Gemini',
        models: ['gemini-pro', 'gemini-pro-vision', 'gemini-1.5-pro', 'gemini-1.5-flash'],
        freeModels: ['gemini-1.5-flash'],
      },
      openai: {
        name: 'OpenAI',
        models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        freeModels: [],
      },
      claude: {
        name: 'Anthropic Claude',
        models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'],
        freeModels: [],
      },
      grok: {
        name: 'xAI Grok',
        models: ['grok-2', 'grok-2-mini'],
        freeModels: [],
      },
    },
  },

  // Subscription tiers
  subscriptions: {
    plans: {
      free: {
        name: 'Free',
        messagesPerDay: 50,
        maxTokensPerMessage: 2048,
        imageGeneration: false,
        models: ['gemini-1.5-flash'],
        price: { monthly: 0, yearly: 0 },
      },
      pro: {
        name: 'Pro',
        messagesPerDay: 500,
        maxTokensPerMessage: 4096,
        imageGeneration: true,
        imageCreditsPerMonth: 50,
        models: ['all'],
        price: { monthly: 19, yearly: 190 },
      },
      enterprise: {
        name: 'Enterprise',
        messagesPerDay: -1, // unlimited
        maxTokensPerMessage: 8192,
        imageGeneration: true,
        imageCreditsPerMonth: 500,
        models: ['all'],
        price: { monthly: 49, yearly: 490 },
      },
    },
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    authMaxAttempts: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '5'),
  },

  // File upload limits
  upload: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '10485760'),
    allowedTypes: (process.env.UPLOAD_ALLOWED_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(','),
  },

  // Email configuration
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    fromName: process.env.SMTP_FROM_NAME || 'Lumora AI',
    fromEmail: process.env.SMTP_FROM_EMAIL || 'noreply@lumora.ai',
  },

  // Security settings
  security: {
    csrfSecret: process.env.CSRF_SECRET,
    encryptionKey: process.env.ENCRYPTION_KEY,
    allowedOrigins: [process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'],
    secureHeaders: true,
  },

  // Pagination defaults
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
};

export default appConfig;
