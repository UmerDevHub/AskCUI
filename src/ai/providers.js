/**
 * LLM Providers — Groq, Mistral, Cohere, OpenRouter, OpenAI
 * Extracted from ai.js for clean separation of concerns.
 */

const PROVIDER_URLS = {
  groq: 'https://api.groq.com/openai/v1/chat/completions',
  mistral: 'https://api.mistral.ai/v1/chat/completions',
  cohere: 'https://api.cohere.ai/compatibility/v1/chat/completions',
  openrouter: 'https://openrouter.ai/api/v1/chat/completions',
  openai: 'https://api.openai.com/v1/chat/completions',
};

/**
 * Calls a single LLM provider and returns the parsed JSON response.
 */
export async function callProvider(provider, apiKey, model, messages) {
  const url = PROVIDER_URLS[provider];
  if (!url) throw new Error(`Unknown provider: ${provider}`);
  if (!apiKey) throw new Error(`API key missing for ${provider}`);

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    headers['X-Title'] = 'CUI Wah Admission AI';
  }

  const payload = {
    model,
    messages,
    response_format: { type: 'json_object' },
    temperature: 0.2, // Lower temp for factual accuracy
    max_tokens: 3000, // Ensure long, comprehensive, research-backed responses
  };

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errMsg;
    try { 
      const errJson = await res.json();
      errMsg = errJson.error?.message || errJson.message; 
    } catch { /* noop */ }
    throw new Error(errMsg || `${provider.toUpperCase()} returned status ${res.status}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error(`No response content from ${provider}`);

  return JSON.parse(text);
}

/**
 * Calls the primary provider with automatic fallback to secondary providers.
 */
export async function callWithFallback(primaryProvider, primaryKey, primaryModel, messages) {
  // Try primary
  try {
    return await callProvider(primaryProvider, primaryKey, primaryModel, messages);
  } catch (primaryErr) {
    console.warn(`[Provider] Primary (${primaryProvider}) failed:`, primaryErr.message);
  }

  // Build fallback list from env vars
  const envGroq = import.meta.env.VITE_GROQ_API_KEY || '';
  const envMistral = import.meta.env.VITE_MISTRAL_API_KEY || '';
  const envCohere = import.meta.env.VITE_COHERE_API_KEY || '';
  const envOpenRouter = import.meta.env.VITE_OPENROUTER_API_KEY || '';

  const fallbacks = [
    { provider: 'groq', key: envGroq, model: 'llama-3.3-70b-versatile' },
    { provider: 'mistral', key: envMistral, model: 'mistral-small-latest' },
    { provider: 'cohere', key: envCohere, model: 'command-a-plus-05-2026' },
    { provider: 'openrouter', key: envOpenRouter, model: 'meta-llama/llama-3.3-70b-instruct:free' },
  ].filter(f => f.key && f.provider !== primaryProvider);

  for (const fb of fallbacks) {
    try {
      console.log(`[Provider] Falling back to ${fb.provider}...`);
      const result = await callProvider(fb.provider, fb.key, fb.model, messages);
      if (result?.answer) {
        result.answer += `\n\n---\n*Response served via fallback provider (${fb.provider.charAt(0).toUpperCase() + fb.provider.slice(1)}) due to temporary rate limits.*`;
      }
      return result;
    } catch (fbErr) {
      console.warn(`[Provider] Fallback ${fb.provider} failed:`, fbErr.message);
    }
  }

  throw new Error('All providers failed or are unconfigured.');
}
