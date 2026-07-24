import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BookOpen, DollarSign, CheckCircle, FileText, Award, HelpCircle, ArrowRight, TrendingUp, Phone, Bell, Shield, Database } from 'lucide-react';
import { getKnowledgeBase } from '../knowledge/registry.js';
import { hybridSearch } from '../knowledge/search.js';
import { getSourceMeta } from '../knowledge/citations.js';

// Icon map for source files
const SOURCE_ICONS = {
  'programs.json':      { icon: BookOpen,    color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
  'fees.json':          { icon: DollarSign,  color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
  'eligibility.json':   { icon: CheckCircle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' },
  'prerequisites.json': { icon: FileText,    color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/20' },
  'scholarships.json':  { icon: Award,       color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/20' },
  'faqs.json':          { icon: HelpCircle,  color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20' },
  'merit_lists.json':   { icon: TrendingUp,  color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-950/20' },
  'contact_info.json':  { icon: Phone,       color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/20' },
  'announcements.json': { icon: Bell,        color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20' },
  'policies.json':      { icon: Shield,      color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-900/40' },
  'how_to_apply.json':  { icon: CheckCircle, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/20' },
};

function getRecordTitle(record) {
  const d = record.data;
  if (d?.question) return d.question;
  if (d?.name && d?.level) return `${d.name} (${d.abbreviation || ''})`;
  if (d?.title) return d.title;
  if (d?.program) return d.program;
  if (d?.category) return d.category;
  if (d?.section) return String(d.section).replace(/_/g, ' ');
  return record.sourceLabel;
}

function getRecordSubtitle(record) {
  const d = record.data;
  if (d?.level && d?.duration) return `${d.level} • ${d.duration}`;
  if (d?.category && d?.source) return `${d.category} — ${d.source}`;
  if (d?.type && d?.date) return `${d.type} • ${d.date}`;
  if (d?.closing_merit) return `Latest Closing Merit: ${d.closing_merit}%`;
  if (d?.min_percentage) return `Minimum: ${d.min_percentage}%`;
  return record.sourceLabel;
}

function getRecordContent(record) {
  const d = record.data;
  if (d?.answer) return d.answer.slice(0, 120);
  if (d?.description) return d.description.slice(0, 120);
  if (d?.summary) return d.summary.slice(0, 120);
  if (d?.details) return d.details.slice(0, 120);
  return record.searchText.slice(0, 100);
}

function recordToQuestion(record) {
  const d = record.data;
  if (d?.question) return d.question;
  if (d?.name && d?.level) return `Tell me about ${d.name} — fees, eligibility, merit, and prerequisites.`;
  if (d?.program) return `What is the closing merit and trend for ${d.program}?`;
  if (d?.title) return `Tell me about: ${d.title}`;
  return `Tell me more about ${getRecordTitle(record)}`;
}

export default function GlobalSearch({ isOpen, onClose, onAskQuestion }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const [kb] = useState(() => getKnowledgeBase());

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Hybrid search across ALL data sources
  useEffect(() => {
    if (!query.trim() || query.length < 2) { setResults([]); return; }
    const topRecords = hybridSearch(query, kb, 20)
      .filter(r => r.score > 0.5 && !r.type.includes('Full Document'));
    setResults(topRecords.slice(0, 10));
  }, [query, kb]);

  const handleSelectResult = (record) => {
    onAskQuestion(recordToQuestion(record), record.sourceLabel);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.97, y: -10, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.97, y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        >
          {/* Input */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 dark:border-slate-800">
            <Search className="h-5 w-5 text-slate-400 dark:text-slate-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search all knowledge sources — programs, fees, merit, FAQs, policies..."
              className="flex-1 bg-transparent text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500 text-sm"
            />
            <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {!query.trim() ? (
              <div className="py-10 text-center space-y-2">
                <Database className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  Searching across {kb.length.toLocaleString()} indexed records from all knowledge sources
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                No results found — try a different keyword or ask the AI directly
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((record, idx) => {
                  const meta = SOURCE_ICONS[record.source] || { icon: Database, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800' };
                  const Icon = meta.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectResult(record)}
                      className="group flex cursor-pointer items-start gap-3 rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800/80"
                    >
                      <div className={`rounded-xl p-2 shrink-0 ${meta.bg}`}>
                        <Icon className={`h-5 w-5 ${meta.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">
                            {getSourceMeta(record.source).label}
                          </span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 shrink-0">
                            Ask AI <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1 mt-0.5">
                          {getRecordTitle(record)}
                        </h4>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {getRecordSubtitle(record)}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {getRecordContent(record)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-[11px] text-slate-400 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-500">
            <span>Click any result to ask the AI assistant</span>
            <div className="flex items-center gap-1">
              <kbd className="rounded border bg-white px-1.5 py-0.5 font-mono text-[9px] dark:border-slate-800 dark:bg-slate-950">ESC</kbd>
              <span>to close</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
