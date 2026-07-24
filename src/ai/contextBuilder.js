/**
 * Context Builder — RAG Pipeline
 * Runs the full search pipeline and assembles context for the LLM.
 */

import { getKnowledgeBase } from '../knowledge/registry.js';
import { hybridSearch } from '../knowledge/search.js';
import { calculateConfidence } from '../knowledge/citations.js';

/**
 * Serializes a record's data compactly for LLM context.
 * Avoids sending entire large objects.
 */
function serializeRecord(record) {
  const data = record.data;
  // For FAQ records, format as Q&A
  if (data?.question && data?.answer) {
    return `Q: ${data.question}\nA: ${data.answer}${data.source ? `\n(Source: ${data.source})` : ''}`;
  }
  // For program records
  if (data?.name && data?.level) {
    return `Program: ${data.name} (${data.abbreviation || ''}) | Level: ${data.level} | Duration: ${data.duration || 'N/A'} | ${data.description || ''}`;
  }
  // Generic: compact JSON without _meta
  const cleaned = { ...data };
  delete cleaned._meta;
  try {
    return JSON.stringify(cleaned, null, 1);
  } catch {
    return String(data);
  }
}

/**
 * Groups records by source file and builds a structured context string.
 */
function buildContextString(topRecords) {
  const grouped = {};
  topRecords.forEach(record => {
    if (!grouped[record.source]) {
      grouped[record.source] = { label: record.sourceLabel, records: [] };
    }
    grouped[record.source].records.push(record);
  });

  const parts = [];
  for (const [source, group] of Object.entries(grouped)) {
    // Deduplicate records by their serialized text
    const seen = new Set();
    const uniqueRecords = group.records.filter(r => {
      const key = r.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    parts.push(
      `\n### ${group.label.toUpperCase()} [${source}]\n` +
      uniqueRecords.slice(0, 8).map(r => serializeRecord(r)).join('\n---\n')
    );
  }
  return parts.join('\n\n');
}

/**
 * Main context building function.
 * Runs hybrid search across entire knowledge base and returns:
 * - context: formatted string for LLM
 * - sources: list of source file names used
 * - confidence: calculated confidence object
 * - topRecords: raw scored records (for UI use)
 */
export function buildContext(query, selectedCategory = 'All') {
  const knowledgeBase = getKnowledgeBase();

  // If a specific category is selected, boost those records
  let searchQuery = query;
  if (selectedCategory && selectedCategory !== 'All') {
    searchQuery = `${selectedCategory} ${query}`;
  }

  // Run the hybrid search across ALL records
  const topRecords = hybridSearch(searchQuery, knowledgeBase, 45);

  // Calculate confidence before building context
  const confidence = calculateConfidence(topRecords, query);

  // Build the context string
  const context = buildContextString(topRecords);

  // Collect unique sources
  const sources = [...new Set(topRecords.filter(r => r.score > 0.5).map(r => r.source))];

  return { context, sources, confidence, topRecords };
}
