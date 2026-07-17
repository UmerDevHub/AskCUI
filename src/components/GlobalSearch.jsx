import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BookOpen, DollarSign, CheckCircle, FileText, Award, HelpCircle, ArrowRight, CornerDownLeft } from 'lucide-react';

import programsData from '../data/programs.json';
import feesData from '../data/fees.json';
import eligibilityData from '../data/eligibility.json';
import prerequisitesData from '../data/prerequisites.json';
import scholarshipsData from '../data/scholarships.json';
import faqsData from '../data/faqs.json';

export default function GlobalSearch({ isOpen, onClose, onAskQuestion }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Handle global keybindings to close search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase();
    const matches = [];

    // 1. Search programs
    programsData.forEach(p => {
      if (p.name.toLowerCase().includes(searchQuery) || p.abbreviation.toLowerCase().includes(searchQuery) || p.description.toLowerCase().includes(searchQuery)) {
        matches.push({
          type: 'Programs',
          title: `${p.name} (${p.abbreviation})`,
          subtitle: `${p.level} • ${p.duration}`,
          content: p.description,
          icon: BookOpen,
          color: 'text-indigo-500',
          bg: 'bg-indigo-50 dark:bg-indigo-950/20',
          raw: p
        });
      }
    });

    // 2. Search fees
    feesData.structures.forEach(f => {
      const matchText = `${f.category} ${f.programs_included.join(' ')}`;
      if (matchText.toLowerCase().includes(searchQuery)) {
        matches.push({
          type: 'Fees',
          title: f.category,
          subtitle: `Admission: Rs. ${f.admission_fee.toLocaleString()} • Tuition: Rs. ${f.tuition_fee_per_semester.toLocaleString()}/sem`,
          content: `Total at Admission: Rs. ${f.total_at_admission.toLocaleString()}. Programs: ${f.programs_included.join(', ')}`,
          icon: DollarSign,
          color: 'text-emerald-500',
          bg: 'bg-emerald-50 dark:bg-emerald-950/20',
          raw: f
        });
      }
    });

    // 3. Search eligibility
    Object.entries(eligibilityData.undergraduate).forEach(([key, val]) => {
      if (typeof val === 'object' && val.programs) {
        if (key.toLowerCase().includes(searchQuery) || val.programs.some(p => p.toLowerCase().includes(searchQuery))) {
          matches.push({
            type: 'Eligibility',
            title: `Undergraduate: ${key.replace('_', ' ')}`,
            subtitle: `Min Required Marks: ${val.min_percentage}%`,
            content: `Applies to: ${val.programs.join(', ')}`,
            icon: CheckCircle,
            color: 'text-amber-500',
            bg: 'bg-amber-50 dark:bg-amber-950/20',
            raw: val
          });
        }
      }
    });

    // 4. Search prerequisites
    prerequisitesData.program_pathways.forEach(path => {
      if (path.program.toLowerCase().includes(searchQuery) || path.eligible_backgrounds.some(bg => bg.toLowerCase().includes(searchQuery))) {
        matches.push({
          type: 'Prerequisites',
          title: path.program,
          subtitle: 'Required Academic Backgrounds',
          content: path.eligible_backgrounds.join(' | '),
          icon: FileText,
          color: 'text-purple-500',
          bg: 'bg-purple-50 dark:bg-purple-950/20',
          raw: path
        });
      }
    });

    // 5. Search scholarships
    scholarshipsData.financial_aid_options.forEach(aid => {
      if (aid.name.toLowerCase().includes(searchQuery) || aid.description.toLowerCase().includes(searchQuery) || aid.eligibility.toLowerCase().includes(searchQuery)) {
        matches.push({
          type: 'Scholarships',
          title: aid.name,
          subtitle: aid.description,
          content: `Eligibility: ${aid.eligibility}`,
          icon: Award,
          color: 'text-rose-500',
          bg: 'bg-rose-50 dark:bg-rose-950/20',
          raw: aid
        });
      }
    });

    // 6. Search FAQs
    faqsData.forEach(faq => {
      if (faq.question.toLowerCase().includes(searchQuery) || faq.answer.toLowerCase().includes(searchQuery)) {
        matches.push({
          type: 'FAQs',
          title: faq.question,
          subtitle: faq.category,
          content: faq.answer,
          icon: HelpCircle,
          color: 'text-blue-500',
          bg: 'bg-blue-50 dark:bg-blue-950/20',
          raw: faq
        });
      }
    });

    setResults(matches.slice(0, 8)); // Display top 8 matches
  }, [query]);

  const handleSelectResult = (item) => {
    let questionText = '';
    if (item.type === 'FAQs') {
      questionText = item.title;
    } else if (item.type === 'Programs') {
      questionText = `What is the eligibility and structure of the ${item.title} program?`;
    } else if (item.type === 'Fees') {
      questionText = `What is the fee structure for ${item.title}?`;
    } else if (item.type === 'Scholarships') {
      questionText = `Can you give me details about the ${item.title} scholarship?`;
    } else {
      questionText = `Tell me more about ${item.title}`;
    }
    
    onAskQuestion(questionText, item.type);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Search Modal */}
        <motion.div
          initial={{ scale: 0.97, y: -10, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.97, y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        >
          {/* Input Area */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 dark:border-slate-800">
            <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search programs, fees, eligibility, FAQs..."
              className="flex-1 bg-transparent text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500 text-sm md:text-base"
            />
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {!query.trim() ? (
              <div className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                Type something to search the admission knowledge base...
              </div>
            ) : results.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                No matching results found
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectResult(item)}
                      className="group flex cursor-pointer items-start gap-3 rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800/80"
                    >
                      <div className={`rounded-xl p-2 shrink-0 ${item.bg}`}>
                        <Icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            {item.type}
                          </span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                            Ask AI
                            <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">
                          {item.title}
                        </h4>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {item.subtitle}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Guide */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-[11px] text-slate-400 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-500">
            <span>Select a result to ask the Admission AI assistant directly</span>
            <div className="flex items-center gap-1">
              <kbd className="rounded border bg-white px-1.5 py-0.5 font-mono text-[9px] dark:border-slate-800 dark:bg-slate-950">
                ESC
              </kbd>
              <span>to close</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
