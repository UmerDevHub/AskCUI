/**
 * Hybrid Search Engine
 * Combines: Keyword Search + Synonym Expansion + Partial/Fuzzy Matching
 * Returns scored records from the entire knowledge base.
 */

// ── Synonym Map ────────────────────────────────────────────────────────────────
// Expands user query words to semantically related terms to avoid keyword-only failures
const SYNONYM_MAP = {
  fee: ['tuition', 'charges', 'dues', 'cost', 'payment', 'challan', 'amount', 'money', 'price', 'rate', 'expense'],
  fees: ['tuition', 'charges', 'dues', 'cost', 'payment', 'challan', 'amount', 'money', 'price', 'rate'],
  tuition: ['fee', 'charges', 'dues', 'semester fee', 'cost'],
  admission: ['apply', 'application', 'enroll', 'enrollment', 'join', 'submit', 'registration', 'entry'],
  apply: ['admission', 'application', 'enroll', 'join', 'register', 'submit'],
  computer: ['cs', 'computing', 'software', 'it', 'information technology', 'bscs', 'msc'],
  engineering: ['eng', 'technical', 'bse', 'bce', 'bsee', 'bsme', 'bscve', 'bsce', 'tech'],
  electrical: ['ee', 'electronics', 'power', 'circuit', 'signal'],
  mechanical: ['me', 'thermodynamics', 'machine', 'manufacturing', 'robotics'],
  civil: ['cve', 'construction', 'structural', 'infrastructure'],
  eligible: ['eligibility', 'qualify', 'requirement', 'criteria', 'condition', 'minimum', 'needed'],
  eligibility: ['eligible', 'qualify', 'requirement', 'criteria', 'minimum marks'],
  merit: ['cutoff', 'closing', 'aggregate', 'percentage', 'score', 'ranking', 'list', 'position'],
  scholarship: ['financial aid', 'grant', 'waiver', 'fund', 'peef', 'hec', 'endowment', 'stipend'],
  hostel: ['accommodation', 'dorm', 'dormitory', 'room', 'boarding', 'residence', 'mess'],
  transport: ['bus', 'shuttle', 'van', 'commute', 'travel', 'route', 'pick up', 'drop off'],
  program: ['course', 'degree', 'major', 'discipline', 'bs', 'ms', 'phd', 'bba', 'mba'],
  prerequisite: ['background', 'required subject', 'pre-engineering', 'pre-medical', 'ics', 'pre-req'],
  nat: ['entry test', 'nts', 'aptitude', 'test score', 'national aptitude'],
  gat: ['graduate test', 'nts gat', 'ms test', 'phd test', 'graduate aptitude'],
  contact: ['phone', 'email', 'address', 'reach', 'call', 'helpdesk', 'office'],
  deadline: ['last date', 'due date', 'closing date', 'submission date', 'cut off date'],
  refund: ['money back', 'cancellation', 'withdrawal', 'return fee'],
  attendance: ['presence', 'absences', 'absent', 'debarment'],
  campus: ['location', 'city', 'wah', 'islamabad', 'rawalpindi', 'branch'],
  bba: ['business administration', 'management', 'commerce'],
  bsai: ['artificial intelligence', 'ai program', 'machine learning'],
  psychology: ['psy', 'behavioral', 'clinical', 'cognitive', 'mental health'],
  mathematics: ['math', 'maths', 'calculus', 'algebra', 'statistics'],
};

// ── Relationship Graph ────────────────────────────────────────────────────────
// Maps program names/keywords to related data domains
// When a program is detected in query, boost records from related domains
const PROGRAM_RELATIONS = {
  'computer science': ['fees.json', 'eligibility.json', 'merit_lists.json', 'scholarships.json', 'prerequisites.json', 'contact_info.json'],
  'artificial intelligence': ['fees.json', 'eligibility.json', 'merit_lists.json', 'scholarships.json', 'prerequisites.json'],
  'software engineering': ['fees.json', 'eligibility.json', 'merit_lists.json', 'prerequisites.json'],
  'electrical engineering': ['fees.json', 'eligibility.json', 'merit_lists.json', 'prerequisites.json'],
  'civil engineering': ['fees.json', 'eligibility.json', 'merit_lists.json', 'prerequisites.json'],
  'mechanical engineering': ['fees.json', 'eligibility.json', 'merit_lists.json', 'prerequisites.json'],
  'computer engineering': ['fees.json', 'eligibility.json', 'merit_lists.json', 'prerequisites.json'],
  'bba': ['fees.json', 'eligibility.json', 'merit_lists.json', 'scholarships.json', 'prerequisites.json'],
  'accounting': ['fees.json', 'eligibility.json', 'merit_lists.json', 'prerequisites.json'],
  'psychology': ['fees.json', 'eligibility.json', 'merit_lists.json', 'prerequisites.json'],
  'scholarship': ['scholarships.json', 'eligibility.json', 'fees.json', 'contact_info.json'],
  'hostel': ['fees.json', 'faqs.json', 'contact_info.json', 'policies.json'],
  'transport': ['fees.json', 'faqs.json', 'contact_info.json'],
  'apply': ['how_to_apply.json', 'eligibility.json', 'fees.json', 'faqs.json'],
  'merit': ['merit_lists.json', 'eligibility.json', 'programs.json'],
};

// ── Tokenizer ─────────────────────────────────────────────────────────────────
function tokenize(text) {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

// ── Expand tokens with synonyms ───────────────────────────────────────────────
function expandWithSynonyms(tokens) {
  const expanded = new Set(tokens);
  tokens.forEach(token => {
    const syns = SYNONYM_MAP[token] || [];
    syns.forEach(s => expanded.add(s));
    // Also try stemming: remove trailing 's', 'ing', 'ed'
    if (token.endsWith('s')) expanded.add(token.slice(0, -1));
    if (token.endsWith('ing')) expanded.add(token.slice(0, -3));
    if (token.endsWith('ed')) expanded.add(token.slice(0, -2));
  });
  return [...expanded];
}

// ── Fuzzy match (simple substring + character overlap) ───────────────────────
function fuzzyScore(searchToken, targetText) {
  if (targetText.includes(searchToken)) return 1.0;
  // Check if all chars of searchToken appear in order in targetText
  let si = 0;
  for (let i = 0; i < targetText.length && si < searchToken.length; i++) {
    if (targetText[i] === searchToken[si]) si++;
  }
  if (si === searchToken.length && searchToken.length > 3) return 0.3;
  return 0;
}

// ── Detect related sources from query ────────────────────────────────────────
function detectRelatedSources(query) {
  const related = new Set();
  const lq = query.toLowerCase();
  for (const [keyword, sources] of Object.entries(PROGRAM_RELATIONS)) {
    if (lq.includes(keyword)) {
      sources.forEach(s => related.add(s));
    }
  }
  return related;
}

// ── Main Scoring Function ─────────────────────────────────────────────────────
/**
 * Scores a single knowledge record against the user's query.
 * Returns a numeric score (higher = more relevant).
 */
export function scoreRecord(record, queryTokens, expandedTokens, relatedSources) {
  let score = 0;
  const text = record.searchText;

  // Exact word matches (highest weight)
  queryTokens.forEach(token => {
    if (token.length <= 1) return;
    const regex = new RegExp(`\\b${token}\\b`, 'g');
    const matches = (text.match(regex) || []).length;
    score += matches * 3;
  });

  // Synonym/expanded term matches
  expandedTokens.forEach(token => {
    if (queryTokens.includes(token)) return; // already counted
    if (token.length <= 1) return;
    if (text.includes(token)) score += 1.5;
  });

  // Fuzzy matching for short queries
  if (queryTokens.length <= 3) {
    queryTokens.forEach(token => {
      if (token.length > 3) score += fuzzyScore(token, text) * 2;
    });
  }

  // Source priority bonus — authoritative sources score higher
  score += (7 - record.priority) * 0.5;

  // Relationship boost — if this source is related to detected topics
  if (relatedSources.has(record.source)) score += 4;

  // Penalize very short search text (low-content records)
  if (text.length < 50) score *= 0.5;

  return score;
}

// ── Hybrid Search ─────────────────────────────────────────────────────────────
/**
 * Main search function — searches ALL records in the knowledge base.
 * @param {string} query - The user's natural language query
 * @param {Array} knowledgeBase - All normalized records from registry
 * @param {number} topN - Number of top results to return (default 40)
 * @returns {Array} Top-scored records sorted by relevance
 */
export function hybridSearch(query, knowledgeBase, topN = 40) {
  const queryTokens = tokenize(query);
  const expandedTokens = expandWithSynonyms(queryTokens);
  const relatedSources = detectRelatedSources(query);

  // Score every record
  const scored = knowledgeBase
    .map(record => ({
      ...record,
      score: scoreRecord(record, queryTokens, expandedTokens, relatedSources),
    }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);

  // Always include at least some records from every source for completeness
  const sourcesSeen = new Set();
  const guardrailRecords = [];
  for (const record of knowledgeBase) {
    if (!sourcesSeen.has(record.source) && !scored.slice(0, topN).some(r => r.source === record.source)) {
      // Include the top-priority (full document) record from each unrepresented source
      const fullDoc = knowledgeBase.filter(r => r.source === record.source)
        .sort((a, b) => (a.priority - b.priority))
        .find(r => r.type.includes('Full Document'));
      if (fullDoc && !guardrailRecords.includes(fullDoc)) {
        guardrailRecords.push({ ...fullDoc, score: 0.1 });
        sourcesSeen.add(record.source);
      }
    }
    if (sourcesSeen.size > 5) break;
  }

  return [...scored.slice(0, topN), ...guardrailRecords];
}

export { expandWithSynonyms, tokenize, detectRelatedSources };
