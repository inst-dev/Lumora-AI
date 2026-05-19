/**
 * ====================================================
 * LUMORA AI - AI Provider Router
 * ====================================================
 * Routes requests to the correct AI provider based on
 * the selected model. Handles streaming responses.
 */

import { callGemini } from './gemini';
import { callOpenAI } from './openai';
import { callClaude } from './claude';
import { callGrok } from './grok';

/**
 * Route AI request to appropriate provider
 * @param {Object} options - Request options
 * @param {string} options.model - Model identifier
 * @param {Array} options.messages - Conversation messages
 * @param {Function} options.onChunk - Streaming callback
 */
export async function callAIProvider({ model, messages, onChunk }) {
  // Determine provider from model name
  const provider = getProviderFromModel(model);

  switch (provider) {
    case 'gemini':
      return callGemini({ model, messages, onChunk });
    case 'openai':
      return callOpenAI({ model, messages, onChunk });
    case 'claude':
      return callClaude({ model, messages, onChunk });
    case 'grok':
      return callGrok({ model, messages, onChunk });
    default:
      throw new Error(`Unknown AI provider for model: ${model}`);
  }
}

/**
 * Get provider identifier from model name
 */
function getProviderFromModel(model) {
  if (model.startsWith('gemini')) return 'gemini';
  if (model.startsWith('gpt')) return 'openai';
  if (model.startsWith('claude')) return 'claude';
  if (model.startsWith('grok')) return 'grok';
  return 'gemini'; // Default fallback
}
