/**
 * Citations & Confidence Scoring
 * Generates source attribution and confidence levels for AI responses.
 */

// Source display metadata
const SOURCE_META = {
  'programs.json':       { label: 'Programs Database',        icon: '📚', tier: 'Official Database' },
  'fees.json':           { label: 'Fee Structure Database',   icon: '💰', tier: 'Official Database' },
  'eligibility.json':    { label: 'Eligibility Criteria',    icon: '✅', tier: 'Official Database' },
  'prerequisites.json':  { label: 'Prerequisites Guide',     icon: '📋', tier: 'Official Database' },
  'scholarships.json':   { label: 'Scholarships Database',   icon: '🏆', tier: 'Official Database' },
  'merit_lists.json':    { label: 'Merit Lists Database',    icon: '📊', tier: 'Official Database' },
  'how_to_apply.json':   { label: 'Admission Guide',         icon: '📝', tier: 'Official Document' },
  'contact_info.json':   { label: 'Contact Directory',       icon: '📞', tier: 'Official Directory' },
  'announcements.json':  { label: 'Announcements & Notices', icon: '📢', tier: 'Official CMS' },
  'policies.json':       { label: 'University Policies',     icon: '🛡️', tier: 'Official Policy' },
  'faqs.json':           { label: 'Official FAQs',           icon: '❓', tier: 'Official FAQ' },
};

/**
 * Resolves display metadata for a source file name.
 */
export function getSourceMeta(sourceFileName) {
  return SOURCE_META[sourceFileName] ?? {
    label: sourceFileName.replace('.json', '').replace(/_/g, ' '),
    icon: '📄',
    tier: 'Knowledge Base',
  };
}

/**
 * Calculates a confidence score (0–100) and label based on search results.
 * @param {Array} topRecords - Scored records from hybridSearch
 * @param {string} query - Original user query
 * @returns {{ score: number, label: string, reason: string }}
 */
export function calculateConfidence(topRecords, query) {
  if (!topRecords || topRecords.length === 0) {
    return { score: 20, label: 'Low', reason: 'No official data found for this query.' };
  }

  const maxScore = topRecords[0]?.score ?? 0;
  const sourcesHit = new Set(topRecords.filter(r => r.score > 1).map(r => r.source)).size;
  const hasHighPriorityData = topRecords.some(r => r.priority <= 2 && r.score > 2);

  let confidence = 0;

  // Base confidence from score magnitude
  if (maxScore >= 20) confidence = 95;
  else if (maxScore >= 12) confidence = 88;
  else if (maxScore >= 6) confidence = 78;
  else if (maxScore >= 3) confidence = 65;
  else if (maxScore >= 1) confidence = 50;
  else confidence = 30;

  // Boost for multiple corroborating sources
  if (sourcesHit >= 4) confidence = Math.min(confidence + 5, 99);
  else if (sourcesHit >= 2) confidence = Math.min(confidence + 3, 99);

  // Boost for authoritative (high-priority) sources
  if (hasHighPriorityData) confidence = Math.min(confidence + 5, 99);

  // Determine label
  let label = 'Low';
  let reason = 'Limited data found. Verify with the admissions office.';
  if (confidence >= 90) {
    label = 'Very High';
    reason = `Official university data found across ${sourcesHit} source(s). Answer is data-driven.`;
  } else if (confidence >= 75) {
    label = 'High';
    reason = `Relevant data found in ${sourcesHit} official source(s).`;
  } else if (confidence >= 55) {
    label = 'Medium';
    reason = 'Partial information found. Some details may need verification.';
  } else {
    label = 'Low';
    reason = 'This topic has limited data in the knowledge base. Please contact the admissions office for confirmation.';
  }

  return { score: confidence, label, reason };
}

/**
 * Formats a list of source file names into display-ready citation objects.
 */
export function formatCitations(sourceFileNames) {
  const unique = [...new Set(sourceFileNames)];
  return unique.map(src => ({
    file: src,
    ...getSourceMeta(src),
  }));
}
