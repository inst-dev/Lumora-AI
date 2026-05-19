/**
 * ====================================================
 * LUMORA AI - Stripe Payment Integration
 * ====================================================
 * Handles Stripe subscription creation, webhooks,
 * and payment processing.
 */

import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

/**
 * Create a Stripe checkout session for subscription
 * @param {Object} options - Checkout options
 * @returns {Object} Session URL and ID
 */
export async function createCheckoutSession({ priceId, customerId, email, successUrl, cancelUrl }) {
  if (!stripe) throw new Error('Stripe not configured');

  const sessionParams = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
    cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
  };

  // Use existing customer or create from email
  if (customerId) {
    sessionParams.customer = customerId;
  } else if (email) {
    sessionParams.customer_email = email;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  return {
    sessionId: session.id,
    url: session.url,
  };
}

/**
 * Create a Stripe customer
 * @param {Object} userData - User information
 * @returns {string} Stripe customer ID
 */
export async function createCustomer({ email, name }) {
  if (!stripe) throw new Error('Stripe not configured');

  const customer = await stripe.customers.create({ email, name });
  return customer.id;
}

/**
 * Cancel a subscription
 * @param {string} subscriptionId - Stripe subscription ID
 * @returns {Object} Cancelled subscription
 */
export async function cancelSubscription(subscriptionId) {
  if (!stripe) throw new Error('Stripe not configured');
  return stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Verify Stripe webhook signature
 * @param {string} payload - Request body
 * @param {string} signature - Stripe signature header
 * @returns {Object} Verified event
 */
export function verifyWebhookSignature(payload, signature) {
  if (!stripe) throw new Error('Stripe not configured');
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
}

/**
 * Get customer portal URL
 * @param {string} customerId - Stripe customer ID
 * @returns {string} Portal URL
 */
export async function getCustomerPortalUrl(customerId) {
  if (!stripe) throw new Error('Stripe not configured');
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
  });
  return session.url;
}
