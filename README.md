# Lumora AI - Next-Generation AI Chat Platform

<div align="center">
  <h3>Multi-Model AI Chat • Subscription System • Admin Dashboard • Premium UI/UX</h3>
  <p>A complete production-ready AI SaaS platform built with Next.js, Tailwind CSS, and MySQL</p>
</div>

---

## ✨ Features

### Core Features
- 🤖 **Multi-AI Provider Support** - Google Gemini, OpenAI GPT-4, Anthropic Claude, xAI Grok
- 💬 **Real-time Streaming** - Smooth typing animation with streaming responses
- 🎨 **Premium UI/UX** - Glassmorphism design, dark/light mode, responsive
- 🔐 **Enterprise Security** - JWT auth, rate limiting, CSRF protection, XSS prevention
- 💳 **Multi-Gateway Payments** - Stripe, PayPal, Razorpay, PayHere, Paddle, LemonSqueezy
- 📊 **Admin Dashboard** - Complete SaaS management panel
- 🛡️ **License System** - Envato purchase code verification
- 📱 **Fully Responsive** - Perfect on mobile, tablet, and desktop

### User Features
- Chat with multiple AI models
- Conversation history with search
- Message editing, deletion, regeneration
- Code syntax highlighting
- Image generation (Pro+)
- Subscription management
- Dark/Light theme

### Admin Features
- Revenue analytics dashboard
- User management (ban, roles, etc.)
- AI provider configuration
- Payment gateway settings
- Subscription plan editor
- Coupon management
- Blog/content management
- Support ticket system
- System settings

---

## 🚀 Quick Start

### Requirements
- Node.js 18+
- MySQL 5.7+
- npm or yarn

### Installation

1. **Upload files** to your server
2. **Navigate to your domain** - Installer will launch automatically
3. **Follow the wizard** - System checks, license, database, admin setup
4. **Done!** Access your admin panel

### Manual Setup

```bash
# Clone the repository
git clone <repo-url> lumora-ai
cd lumora-ai

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your settings

# Import database
mysql -u root -p lumora_ai < src/lib/database/schema.sql

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

---

## 📁 Project Structure

```
lumora-ai/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (admin)/         # Admin panel routes
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (dashboard)/     # User dashboard routes
│   │   ├── (public)/        # Public marketing pages
│   │   ├── api/             # API routes
│   │   └── install/         # Installation wizard
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base UI primitives
│   │   ├── chat/            # Chat interface components
│   │   └── layout/          # Layout components
│   ├── config/              # App configuration
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Core libraries
│   │   ├── ai-providers/    # AI API integrations
│   │   ├── database/        # MySQL connection & schema
│   │   ├── email/           # Email service
│   │   ├── payments/        # Payment gateways
│   │   └── security/        # Auth, encryption, validation
│   ├── providers/           # React context providers
│   └── utils/               # Utility functions
├── public/                  # Static assets
├── .env.example             # Environment template
├── next.config.mjs          # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json             # Dependencies
```

---

## ⚙️ Configuration

### AI Providers
Add your API keys in `.env.local`:
- `GEMINI_API_KEY` - Google AI Studio
- `OPENAI_API_KEY` - OpenAI Platform
- `CLAUDE_API_KEY` - Anthropic Console
- `GROK_API_KEY` - xAI Platform

### Payment Gateways
Configure payment providers:
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLIC_KEY`
- `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET`
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`

### Email (SMTP)
Configure transactional emails:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`

---

## 🛡️ Security

- Password hashing with bcrypt (12 rounds)
- JWT token authentication with secure cookies
- Rate limiting on all sensitive endpoints
- CSRF token validation
- XSS prevention through input sanitization
- SQL injection prevention (parameterized queries)
- Security headers (CSP, HSTS-ready)
- Encrypted API key storage

---

## 📄 License

This is a commercial product. A valid Envato purchase code is required for installation.

---

## 🤝 Support

For support, please create a ticket through the admin panel or contact us via the marketplace.
