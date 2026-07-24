/**
 * Knowledge Registry — Auto-discovers all JSON files in /src/data/
 * Uses Vite's import.meta.glob for zero-config auto-indexing.
 * Adding a new .json file to /src/data/ is the ONLY step needed to extend the knowledge base.
 */

// Auto-discover every JSON file in the data directory (eager = synchronous import)
const rawModules = import.meta.glob('../data/*.json', { eager: true });

/**
 * Recursively flattens a JSON value into a plain string for full-text search.
 */
function flatten(value, depth = 0) {
  if (depth > 6) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(v => flatten(v, depth + 1)).join(' ');
  if (typeof value === 'object' && value !== null) {
    return Object.values(value).map(v => flatten(v, depth + 1)).join(' ');
  }
  return '';
}

/**
 * Source priority tier — higher number = lower priority (higher number searched last but still used).
 * Lower number = more authoritative.
 */
const SOURCE_PRIORITY = {
  'merit_lists.json': 1,
  'fees.json': 1,
  'programs.json': 2,
  'eligibility.json': 2,
  'scholarships.json': 2,
  'contact_info.json': 3,
  'policies.json': 3,
  'how_to_apply.json': 3,
  'announcements.json': 4,
  'prerequisites.json': 4,
  'faqs.json': 5,
};

/**
 * Normalizes a single JSON module (array or object) into a list of searchable records.
 * Each record has: id, source, sourceLabel, priority, type, searchText, data
 */
function normalizeModule(filePath, moduleExport) {
  const fileName = filePath.split('/').pop();
  const sourceName = fileName;
  const sourceLabel = fileName.replace(/_/g, ' ').replace('.json', '').replace(/\b\w/g, c => c.toUpperCase());
  const priority = SOURCE_PRIORITY[fileName] ?? 6;
  const raw = moduleExport.default ?? moduleExport;

  const records = [];
  let idCounter = 0;

  const makeRecord = (data, type) => ({
    id: `${fileName}_${idCounter++}`,
    source: sourceName,
    sourceLabel,
    priority,
    type,
    searchText: flatten(data).toLowerCase(),
    data,
  });

  // Handle top-level _meta — skip it from searchable records
  const skipKeys = new Set(['_meta']);

  if (Array.isArray(raw)) {
    // Array of records (e.g., programs.json, faqs.json)
    raw.forEach(item => records.push(makeRecord(item, sourceLabel)));
  } else if (typeof raw === 'object' && raw !== null) {
    // Object with nested sections (e.g., fees.json, eligibility.json)
    Object.entries(raw).forEach(([key, value]) => {
      if (skipKeys.has(key)) return;
      if (Array.isArray(value)) {
        // Each array item becomes its own record
        value.forEach(item => records.push(makeRecord({ [key]: item, ...item }, `${sourceLabel} / ${key}`)));
      } else if (typeof value === 'object' && value !== null) {
        // Nested object becomes one record
        records.push(makeRecord({ section: key, ...value }, `${sourceLabel} / ${key}`));
      } else {
        // Scalar top-level value
        records.push(makeRecord({ [key]: value }, sourceLabel));
      }
    });
    // Also add a "full document" record for broad queries
    records.push(makeRecord(raw, `${sourceLabel} (Full Document)`));
  }

  return records;
}

// Build the complete normalized knowledge base
let _knowledgeBase = null;

export function getKnowledgeBase() {
  if (_knowledgeBase) return _knowledgeBase;
  _knowledgeBase = [];
  for (const [filePath, mod] of Object.entries(rawModules)) {
    try {
      const records = normalizeModule(filePath, mod);
      _knowledgeBase.push(...records);
    } catch (err) {
      console.warn(`[Registry] Failed to index ${filePath}:`, err);
    }
  }
  return _knowledgeBase;
}

/** Returns unique source file names in the knowledge base */
export function getSourceNames() {
  return [...new Set(getKnowledgeBase().map(r => r.source))];
}

/** Returns the total number of indexed records */
export function getRecordCount() {
  return getKnowledgeBase().length;
}
