/**
 * ====================================================
 * LUMORA AI - Chat Send API Route
 * ====================================================
 * Processes user messages and streams AI responses.
 * Supports multiple AI providers with failover.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/security/jwt';
import { query } from '@/lib/database/db';
import { generateId } from '@/utils/helpers';
import { sanitizeInput, messageSchema, validateRequest } from '@/lib/security/validation';
import { callAIProvider } from '@/lib/ai-providers/router';

export async function POST(request) {
  try {
    // Authenticate user
    const cookieStore = await cookies();
    const token = cookieStore.get('lumora_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Parse and validate request
    const body = await request.json();
    const validation = validateRequest(body, messageSchema);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors[0].message }, { status: 400 });
    }

    const { content, conversationId, model } = validation.data;
    const userId = decoded.id;

    // Check user subscription limits
    const usageCheck = await checkUsageLimits(userId);
    if (!usageCheck.allowed) {
      return NextResponse.json({ error: usageCheck.message }, { status: 403 });
    }

    // Check model access
    const modelAccess = await checkModelAccess(userId, model);
    if (!modelAccess.allowed) {
      return NextResponse.json({ error: 'Your plan does not include access to this model. Please upgrade.' }, { status: 403 });
    }

    // Get or create conversation
    let convId = conversationId;
    if (!convId) {
      convId = generateId();
      await query(
        `INSERT INTO conversations (id, user_id, title, model, provider) VALUES (?, ?, ?, ?, ?)`,
        [convId, userId, 'New Chat', model, getProvider(model)]
      );
    }

    // Save user message
    const userMessageId = generateId();
    await query(
      `INSERT INTO messages (id, conversation_id, role, content) VALUES (?, ?, 'user', ?)`,
      [userMessageId, convId, sanitizeInput(content)]
    );

    // Get conversation history for context
    const history = await query(
      `SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT 20`,
      [convId]
    );

    // Stream AI response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = '';

          // Send conversation ID first
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ conversationId: convId })}\n\n`)
          );

          // Call AI provider with streaming
          await callAIProvider({
            model,
            messages: history.map(m => ({ role: m.role, content: m.content })),
            onChunk: (chunk) => {
              fullResponse += chunk;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
              );
            },
          });

          // Save assistant message
          const assistantMessageId = generateId();
          const tokensUsed = Math.ceil(fullResponse.length / 4);
          await query(
            `INSERT INTO messages (id, conversation_id, role, content, model, tokens_used) VALUES (?, ?, 'assistant', ?, ?, ?)`,
            [assistantMessageId, convId, fullResponse, model, tokensUsed]
          );

          // Update conversation metadata
          await query(
            `UPDATE conversations SET message_count = message_count + 2, total_tokens = total_tokens + ?, last_message_at = NOW() WHERE id = ?`,
            [tokensUsed, convId]
          );

          // Auto-generate title if first message
          if (history.length <= 1) {
            const title = generateTitle(content);
            await query('UPDATE conversations SET title = ? WHERE id = ?', [title, convId]);
          }

          // Log usage
          await query(
            `INSERT INTO usage_logs (id, user_id, type, provider, model, tokens_input, tokens_output) VALUES (?, ?, 'message', ?, ?, ?, ?)`,
            [generateId(), userId, getProvider(model), model, Math.ceil(content.length / 4), tokensUsed]
          );

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: 'AI generation failed. Please try again.' })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat send error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}

/**
 * Check if user has remaining usage for today
 */
async function checkUsageLimits(userId) {
  const subscription = await query(
    `SELECT sp.messages_per_day 
     FROM user_subscriptions us 
     JOIN subscription_plans sp ON us.plan_id = sp.id 
     WHERE us.user_id = ? AND us.status = 'active' 
     LIMIT 1`,
    [userId]
  );

  const limit = subscription[0]?.messages_per_day || 50;
  if (limit === -1) return { allowed: true }; // Unlimited

  const todayUsage = await query(
    `SELECT COUNT(*) as count FROM usage_logs WHERE user_id = ? AND type = 'message' AND DATE(created_at) = CURDATE()`,
    [userId]
  );

  const used = todayUsage[0]?.count || 0;
  if (used >= limit) {
    return { allowed: false, message: `Daily message limit reached (${limit}). Upgrade your plan for more.` };
  }

  return { allowed: true, remaining: limit - used };
}

/**
 * Check if user has access to requested model
 */
async function checkModelAccess(userId, model) {
  const subscription = await query(
    `SELECT sp.allowed_models 
     FROM user_subscriptions us 
     JOIN subscription_plans sp ON us.plan_id = sp.id 
     WHERE us.user_id = ? AND us.status = 'active' 
     LIMIT 1`,
    [userId]
  );

  const allowedModels = JSON.parse(subscription[0]?.allowed_models || '["gemini-1.5-flash"]');
  if (allowedModels.includes('all') || allowedModels.includes(model)) {
    return { allowed: true };
  }

  return { allowed: false };
}

/**
 * Get provider name from model
 */
function getProvider(model) {
  if (model.startsWith('gemini')) return 'gemini';
  if (model.startsWith('gpt')) return 'openai';
  if (model.startsWith('claude')) return 'claude';
  if (model.startsWith('grok')) return 'grok';
  return 'gemini';
}

/**
 * Generate a conversation title from the first message
 */
function generateTitle(content) {
  // Simple title generation - truncate first message
  const cleaned = content.replace(/\n/g, ' ').trim();
  return cleaned.length > 50 ? cleaned.substring(0, 50) + '...' : cleaned;
}
