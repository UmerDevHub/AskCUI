import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BookOpen, DollarSign, CheckCircle, FileText, Award, HelpCircle, ArrowRight, TrendingUp, Phone, Bell, Shield, Database } from 'lucide-react';
import { getKnowledgeBase } from '../knowledge/registry.js';
import { hybridSearch } from '../knowledge/search.js';
import { getSourceMeta } from '../knowledge/citations.js';

// Icon map for source files
const SOURCE_ICONS = {
  'programs.json':      { icon: BookOpen },
  'fees.json':          { icon: DollarSign },
  'eligibility.json':   { icon: CheckCircle },
  'prerequisites.json': { icon: FileText },
  'scholarships.json':  { icon: Award },
  'faqs.json':          { icon: HelpCircle },
  'merit_lists.json':   { icon: TrendingUp },
  'contact_info.json':  { icon: Phone },
  'announcements.json': { icon: Bell },
  'policies.json':      { icon: Shield },
  'how_to_apply.json':  { icon: CheckCircle },
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
      <div className="fixed inset-0 z-50 flex items-start justify-center p-3 pt-3 sm:p-4 sm:pt-[12vh]">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0B2545]/40 backdrop-blur-xs"
        />
        <motion.div
          initial={{ scale: 0.98, y: -8, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.98, y: -8, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden rounded-xl border border-[#E7E2D8] bg-white shadow-xl dark:border-[#1A2A40] dark:bg-[#0B1524]"
        >
          {/* Input Header */}
          <div className="flex items-center gap-3 border-b border-[#E7E2D8] px-4 py-3.5 dark:border-[#1A2A40] bg-[#F7F5F0] dark:bg-[#070D18]">
            <Search className="h-4.5 w-4.5 text-[#0B2545] dark:text-[#809BCE] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search admissions knowledge base — programs, fees, eligibility, merit..."
              className="flex-1 bg-transparent text-[#2B2B2B] outline-none placeholder:text-[#888888] dark:text-[#E2EBFA] dark:placeholder:text-[#607085] text-sm font-medium"
            />
            <button onClick={onClose} className="rounded-md p-1 text-[#666666] hover:bg-[#E7E2D8] dark:hover:bg-[#1A2A40]">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Search Results Feed */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {!query.trim() ? (
              <div className="py-10 text-center space-y-2">
                <Database className="h-7 w-7 mx-auto text-[#0B2545]/40 dark:text-[#809BCE]/40" />
                <p className="text-xs text-[#666666] dark:text-[#809BCE]/70">
                  Searching across {kb.length.toLocaleString()} indexed records from official CUI Wah knowledge base
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#666666] dark:text-[#809BCE]">
                No matching records found — try a different keyword or enter query directly
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((record, idx) => {
                  const meta = SOURCE_ICONS[record.source] || { icon: Database };
                  const Icon = meta.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectResult(record)}
                      className="group flex cursor-pointer items-start gap-3 rounded-lg p-3 hover:bg-[#F4F5F7] dark:hover:bg-[#112035] transition-all border border-transparent hover:border-[#E7E2D8] dark:hover:border-[#1A2A40]"
                    >
                      <div className="rounded-md p-2 shrink-0 bg-[#F4F5F7] dark:bg-[#112035] text-[#0B2545] dark:text-[#C9A227] border border-[#E7E2D8] dark:border-[#1A2A40]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227] truncate">
                            {getSourceMeta(record.source).label}
                          </span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-semibold text-[#0B2545] dark:text-[#E2EBFA] shrink-0">
                            Select <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                        <h4 className="font-serif text-sm font-bold text-[#0B2545] dark:text-[#E2EBFA] line-clamp-1 mt-0.5">
                          {getRecordTitle(record)}
                        </h4>
                        <p className="text-xs font-medium text-[#666666] dark:text-[#A0B0C5] mt-0.5 truncate">
                          {getRecordSubtitle(record)}
                        </p>
                        <p className="text-xs text-[#555555] dark:text-[#809BCE] mt-1 line-clamp-2 leading-relaxed">
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
          <div className="flex items-center justify-between border-t border-[#E7E2D8] bg-[#F7F5F0] px-4 py-2.5 text-[11px] text-[#666666] dark:border-[#1A2A40] dark:bg-[#070D18] dark:text-[#809BCE]">
            <span>Click any result to select resource</span>
            <div className="flex items-center gap-1">
              <kbd className="rounded border border-[#E7E2D8] bg-white px-1.5 py-0.5 font-mono text-[9px] dark:border-[#1A2A40] dark:bg-[#0B1524]">ESC</kbd>
              <span>to close</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
