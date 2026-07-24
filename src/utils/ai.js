/**
 * ai.js — Main AI Orchestration Entry Point
 *
 * Thin wrapper that connects:
 *   Knowledge Registry (auto-discovers all data)
 *   → Hybrid Search (keyword + synonym + fuzzy)
 *   → Context Builder (RAG pipeline)
 *   → System Prompt Builder
 *   → LLM Provider (with automatic fallback)
 *   → Response Formatter
 *
 * To extend the knowledge base: drop a new .json file into /src/data/
 * No other code changes required.
 */

import { buildContext } from '../ai/contextBuilder.js';
import { buildSystemPrompt } from '../ai/prompt.js';
import { callWithFallback } from '../ai/providers.js';
import { formatResponse, formatError } from '../ai/responseFormatter.js';

/**
 * Primary function — answers a user query using the full knowledge pipeline.
 *
 * @param {object} options
 * @param {string} options.provider  - 'groq' | 'cohere' | 'openrouter' | 'openai'
 * @param {string} options.apiKey    - API key for the primary provider
 * @param {string} options.model     - Model identifier
 * @param {string} options.query     - User's question
 * @param {string} options.category  - Active sidebar category ('All', 'Programs', etc.)
 * @param {Array}  options.chatHistory - Previous messages for conversation memory
 * @returns {Promise<object>}        - { answer, sources, citations, confidence, confidence_label, confidence_reason }
 */
export async function askAI({ provider, apiKey, model, query, category = 'All', chatHistory = [] }) {
  // ── Step 1: Build RAG context (search-all → rank → assemble) ──────────────
  const { context, sources, confidence } = buildContext(query, category);

  // ── Step 2: Build system prompt ───────────────────────────────────────────
  const systemPrompt = buildSystemPrompt(context, confidence);

  // ── Step 3: Assemble messages with conversation memory ────────────────────
  const messages = [{ role: 'system', content: systemPrompt }];

  // Include last 6 messages for follow-up conversation memory
  chatHistory.slice(-6).forEach(msg => {
    if (msg.sender === 'user') {
      messages.push({ role: 'user', content: msg.text });
    } else {
      const text = typeof msg.text === 'object' ? msg.text.answer : msg.text;
      if (text) messages.push({ role: 'assistant', content: text });
    }
  });

  messages.push({ role: 'user', content: query });

  // ── Step 4: Call LLM with automatic provider fallback ─────────────────────
  try {
    const rawResponse = await callWithFallback(provider, apiKey, model, messages);
    return formatResponse(rawResponse, sources, confidence);
  } catch (err) {
    console.error('[askAI] All providers failed:', err);
    return formatError(err.message, provider);
  }
}

// Re-export getRelevantContext for backward compatibility (used by GlobalSearch)
export { buildContext as getRelevantContext };
