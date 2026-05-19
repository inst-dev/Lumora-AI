/**
 * ====================================================
 * LUMORA AI - xAI Grok Provider
 * ====================================================
 * Integration with xAI Grok API.
 * Uses OpenAI-compatible API format.
 */

const GROK_API_KEY = process.env.GROK_API_KEY;
const BASE_URL = 'https://api.x.ai/v1';

/**
 * Call xAI Grok API with streaming
 * @param {Object} options - Request options
 */
export async function callGrok({ model, messages, onChunk }) {
  if (!GROK_API_KEY) {
    throw new Error('Grok API key not configured');
  }

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROK_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      stream: true,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Grok API error: ${response.status} - ${error}`);
  }

  // Process SSE stream (OpenAI-compatible format)
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));

    for (const line of lines) {
      const data = line.slice(6);
      if (data === '[DONE]') continue;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          onChunk(content);
        }
      } catch {
        // Skip malformed chunks
      }
    }
  }
}
