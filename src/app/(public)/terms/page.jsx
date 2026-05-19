/**
 * ====================================================
 * LUMORA AI - Terms of Service Page
 * ====================================================
 */

export const metadata = { title: 'Terms of Service - Lumora AI' };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1>Terms of Service</h1>
        <p className="text-surface-500">Last updated: May 2024</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using Lumora AI, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.</p>

        <h2>2. Description of Service</h2>
        <p>Lumora AI provides an AI-powered chat platform that allows users to interact with multiple AI language models for text generation, code assistance, and image creation.</p>

        <h2>3. User Accounts</h2>
        <p>You must create an account to use our service. You are responsible for maintaining the security of your account credentials and for all activities under your account.</p>

        <h2>4. Acceptable Use</h2>
        <p>You agree not to use our service to generate harmful, illegal, or abusive content. We reserve the right to suspend accounts that violate our usage policies.</p>

        <h2>5. Subscriptions and Payments</h2>
        <p>Paid plans are billed according to the selected billing cycle. You may cancel at any time, with access continuing until the end of your billing period.</p>

        <h2>6. Intellectual Property</h2>
        <p>Content generated through our platform belongs to you. However, our platform, code, and branding remain our intellectual property.</p>

        <h2>7. Limitation of Liability</h2>
        <p>Lumora AI is provided &ldquo;as is&rdquo; without warranties. We are not liable for any damages arising from use of our service.</p>

        <h2>8. Changes to Terms</h2>
        <p>We may update these terms from time to time. Continued use after changes constitutes acceptance of new terms.</p>

        <h2>9. Contact</h2>
        <p>For questions about these terms, please contact us at support@lumora.ai</p>
      </div>
    </div>
  );
}
