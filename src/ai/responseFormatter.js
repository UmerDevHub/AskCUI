/**
 * Response Formatter
 * Normalizes and enriches LLM responses before sending to the UI.
 */

import { formatCitations } from '../knowledge/citations.js';

const FALLBACK_RESPONSE = {
  answer: "I searched all official university datasets but couldn't find specific information about this query. Please contact the admissions office at **admissions@ciitwah.edu.pk** or call **+92-51-9047430** for confirmation.",
  sources: [],
  confidence: 15,
  confidence_label: 'Low',
  confidence_reason: 'No matching data found in the knowledge base.',
  citations: [],
};

/**
 * Parses and validates the raw JSON response from the LLM.
 * Returns a safe, normalized response object.
 */
export function formatResponse(raw, contextSources, contextConfidence) {
  // Handle null / error cases
  if (!raw || typeof raw !== 'object') return FALLBACK_RESPONSE;
  if (!raw.answer || typeof raw.answer !== 'string') return FALLBACK_RESPONSE;

  // Prefer LLM-provided confidence if it looks valid, otherwise use computed
  const confidence = (typeof raw.confidence === 'number' && raw.confidence >= 0 && raw.confidence <= 100)
    ? raw.confidence
    : contextConfidence.score;

  const confidenceLabel = raw.confidence_label || contextConfidence.label;
  const confidenceReason = raw.confidence_reason || contextConfidence.reason;

  // Merge sources: from LLM response + from context search
  const allSources = [...new Set([
    ...(Array.isArray(raw.sources) ? raw.sources : []),
    ...contextSources,
  ])];

  const citations = formatCitations(allSources);

  return {
    answer: raw.answer,
    sources: allSources,
    citations,
    confidence,
    confidence_label: confidenceLabel,
    confidence_reason: confidenceReason,
  };
}

/**
 * Creates an error response object for UI display.
 */
export function formatError(errorMessage, provider) {
  return {
    answer: `**Error:** Unable to get a response from the AI service.\n\n${errorMessage}\n\nPlease try again in a moment, or contact **admissions@ciitwah.edu.pk** directly.`,
    sources: [],
    citations: [],
    confidence: 0,
    confidence_label: 'Error',
    confidence_reason: `API error from ${provider || 'provider'}: ${errorMessage}`,
  };
}
