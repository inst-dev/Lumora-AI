/**
 * ====================================================
 * LUMORA AI - Anthropic Claude Provider
 * ====================================================
 * Integration with Anthropic Claude API.
 * Supports streaming responses via SSE.
 */

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const BASE_URL = 'https://api.anthropic.com/v1';

/**
 * Call Anthropic Claude API with streaming
 * @param {Object} options - Request options
 */
export async function callClaude({ model, messages, onChunk }) {
  if (!CLAUDE_API_KEY) {
    throw new Error('Claude API key not configured');
  }

  // Convert messages - Claude uses separate system prompt
  const systemMsg = messages.find((m) => m.role === 'system');
  const chatMessages = messages
    .filter((m) => m.role !== 'system')
    .map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

  const response = await fetch(`${BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      messages: chatMessages,
      system: systemMsg?.content || 'You are a helpful AI assistant.',
      max_tokens: 4096,
      stream: true,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${error}`);
  }

  // Process SSE stream
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === 'content_block_delta' && data.delta?.text) {
            onChunk(data.delta.text);
          }
        } catch {
          // Skip malformed chunks
        }
      }
    }
  }
}
