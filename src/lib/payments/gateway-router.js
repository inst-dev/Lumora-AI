/**
 * ====================================================
 * LUMORA AI - Payment Gateway Router
 * ====================================================
 * Routes payment requests to the appropriate gateway.
 * Supports easy expansion of new payment methods.
 */

import { createCheckoutSession as stripeCheckout } from './stripe';

/**
 * Available payment gateways configuration
 * Add new gateways here for easy expansion
 */
const gateways = {
  stripe: {
    name: 'Stripe',
    createSession: stripeCheckout,
    enabled: !!process.env.STRIPE_SECRET_KEY,
  },
  paypal: {
    name: 'PayPal',
    createSession: async (options) => {
      // PayPal integration - implement when API keys available
      throw new Error('PayPal integration pending configuration');
    },
    enabled: !!process.env.PAYPAL_CLIENT_ID,
  },
  razorpay: {
    name: 'Razorpay',
    createSession: async (options) => {
      // Razorpay integration
      throw new Error('Razorpay integration pending configuration');
    },
    enabled: !!process.env.RAZORPAY_KEY_ID,
  },
  payhere: {
    name: 'PayHere',
    createSession: async (options) => {
      // PayHere Sri Lanka integration
      throw new Error('PayHere integration pending configuration');
    },
    enabled: !!process.env.PAYHERE_MERCHANT_ID,
  },
  paddle: {
    name: 'Paddle',
    createSession: async (options) => {
      throw new Error('Paddle integration pending configuration');
    },
    enabled: !!process.env.PADDLE_VENDOR_ID,
  },
  lemonsqueezy: {
    name: 'LemonSqueezy',
    createSession: async (options) => {
      throw new Error('LemonSqueezy integration pending configuration');
    },
    enabled: !!process.env.LEMONSQUEEZY_API_KEY,
  },
  manual: {
    name: 'Manual Payment',
    createSession: async (options) => {
      // Manual payment - admin approval required
      return { sessionId: null, url: null, manual: true };
    },
    enabled: true,
  },
};

/**
 * Get list of enabled payment gateways
 * @returns {Array} Enabled gateways
 */
export function getEnabledGateways() {
  return Object.entries(gateways)
    .filter(([_, config]) => config.enabled)
    .map(([id, config]) => ({ id, name: config.name }));
}

/**
 * Process payment through selected gateway
 * @param {string} gatewayId - Gateway identifier
 * @param {Object} options - Payment options
 * @returns {Object} Payment result
 */
export async function processPayment(gatewayId, options) {
  const gateway = gateways[gatewayId];
  
  if (!gateway) {
    throw new Error(`Unknown payment gateway: ${gatewayId}`);
  }

  if (!gateway.enabled) {
    throw new Error(`Payment gateway ${gateway.name} is not configured`);
  }

  return gateway.createSession(options);
}
