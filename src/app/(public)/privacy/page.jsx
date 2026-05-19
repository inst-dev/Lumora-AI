/**
 * ====================================================
 * LUMORA AI - Privacy Policy Page
 * ====================================================
 */

export const metadata = { title: 'Privacy Policy - Lumora AI' };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-surface-500">Last updated: May 2024</p>

        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly: name, email, payment details. We also collect usage data such as conversations, model preferences, and platform interactions.</p>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information to provide and improve our service, process payments, send service updates, and ensure platform security.</p>

        <h2>3. Data Security</h2>
        <p>We implement industry-standard security measures including encryption, secure authentication, and regular security audits to protect your data.</p>

        <h2>4. Data Retention</h2>
        <p>Your conversations are stored securely and retained until you delete them or your account. Payment records are kept as required by law.</p>

        <h2>5. Third-Party Services</h2>
        <p>We use third-party AI providers (Google, OpenAI, Anthropic, xAI) to process your messages. These providers have their own privacy policies.</p>

        <h2>6. Your Rights</h2>
        <p>You have the right to access, export, and delete your personal data. Contact us at privacy@lumora.ai to exercise these rights.</p>

        <h2>7. Cookies</h2>
        <p>We use essential cookies for authentication and session management. No third-party tracking cookies are used.</p>

        <h2>8. Changes</h2>
        <p>We may update this policy occasionally. Significant changes will be communicated via email.</p>

        <h2>9. Contact</h2>
        <p>For privacy concerns, contact: privacy@lumora.ai</p>
      </div>
    </div>
  );
}
