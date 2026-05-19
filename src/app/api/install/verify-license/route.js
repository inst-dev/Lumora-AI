/**
 * ====================================================
 * LUMORA AI - License Verification API
 * ====================================================
 * Verifies Envato purchase code via Envato API.
 * Securely validates purchase and registers activation.
 */

import { NextResponse } from 'next/server';
import { getClientIP } from '@/utils/helpers';

const ENVATO_TOKEN = process.env.ENVATO_PERSONAL_TOKEN;
const ENVATO_ITEM_ID = process.env.ENVATO_ITEM_ID;

export async function POST(request) {
  try {
    const { purchaseCode } = await request.json();

    if (!purchaseCode || purchaseCode.length < 30) {
      return NextResponse.json(
        { valid: false, error: 'Invalid purchase code format' },
        { status: 400 }
      );
    }

    // Skip verification in development mode
    if (process.env.APP_ENVIRONMENT === 'development') {
      return NextResponse.json({
        valid: true,
        buyer: 'Development Mode',
        purchaseDate: new Date().toISOString(),
      });
    }

    // Verify with Envato API
    if (!ENVATO_TOKEN) {
      return NextResponse.json(
        { valid: false, error: 'License verification not configured' },
        { status: 500 }
      );
    }

    const verificationResult = await verifyEnvatoPurchase(purchaseCode);

    if (!verificationResult.valid) {
      return NextResponse.json(
        { valid: false, error: verificationResult.error },
        { status: 400 }
      );
    }

    // Verify item ID matches (prevent code sharing between different products)
    if (ENVATO_ITEM_ID && verificationResult.item_id !== ENVATO_ITEM_ID) {
      return NextResponse.json(
        { valid: false, error: 'This purchase code belongs to a different product' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      buyer: verificationResult.buyer,
      purchaseDate: verificationResult.sold_at,
      license: verificationResult.license,
    });
  } catch (error) {
    console.error('License verification error:', error);
    return NextResponse.json(
      { valid: false, error: 'Verification service unavailable' },
      { status: 500 }
    );
  }
}

/**
 * Verify purchase code with Envato API
 * @param {string} purchaseCode - Envato purchase code
 * @returns {Object} Verification result
 */
async function verifyEnvatoPurchase(purchaseCode) {
  try {
    const response = await fetch(
      `https://api.envato.com/v3/market/author/sale?code=${purchaseCode}`,
      {
        headers: {
          'Authorization': `Bearer ${ENVATO_TOKEN}`,
          'User-Agent': 'Lumora AI Installer',
        },
      }
    );

    if (response.status === 404) {
      return { valid: false, error: 'Purchase code not found' };
    }

    if (response.status === 403) {
      return { valid: false, error: 'Verification access denied' };
    }

    if (!response.ok) {
      return { valid: false, error: 'Verification service error' };
    }

    const data = await response.json();

    return {
      valid: true,
      buyer: data.buyer,
      item_id: String(data.item?.id),
      sold_at: data.sold_at,
      license: data.license,
      support_amount: data.support_amount,
      supported_until: data.supported_until,
    };
  } catch (error) {
    return { valid: false, error: 'Network error during verification' };
  }
}
