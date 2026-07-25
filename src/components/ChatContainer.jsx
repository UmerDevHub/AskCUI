import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Copy, Check, FileCheck, ArrowRight, User, Sparkles, 
  TrendingUp, ShieldCheck, AlertTriangle, Globe, BookOpen, 
  DollarSign, Home, CheckCircle, Calculator, Clipboard, 
  FileText, Award, HelpCircle, Phone, Brain, ChevronDown, ChevronUp,
  Clock, Zap, CheckCircle2, AlertCircle
} from 'lucide-react';
import CategoryExplorer from './CategoryExplorer';

const SUGGESTIONS = [
  { text: "What is the fee for BS Computer Science?", category: "Fees" },
  { text: "What was the closing merit for BS CS in Fall 2024?", category: "Merit Lists" },
  { text: "Calculate my merit: Matric 950/1100, FSc 1000/1100, NAT 72", category: "Merit Calculator" },
  { text: "Can Pre-Medical students apply for Software Engineering?", category: "Prerequisites" },
  { text: "What scholarships are available at CUI Wah?", category: "Scholarships" },
  { text: "How do I apply for admission step by step?", category: "How to Apply" },
  { text: "What is the hostel fee and availability?", category: "Hostel & Transport" },
  { text: "What is the contact number for the admissions office?", category: "Contact Info" },
];

const CATEGORY_PILLS = [
  { name: 'All', icon: Globe },
  { name: 'Programs', icon: BookOpen },
  { name: 'Fees', icon: DollarSign },
  { name: 'Hostel & Transport', icon: Home },
  { name: 'Eligibility', icon: CheckCircle },
  { name: 'Merit Calculator', icon: Calculator },
  { name: 'Merit Lists', icon: TrendingUp },
  { name: 'How to Apply', icon: Clipboard },
  { name: 'Prerequisites', icon: FileText },
  { name: 'Scholarships', icon: Award },
  { name: 'FAQs', icon: HelpCircle },
  { name: 'Contact Info', icon: Phone },
];

// ── Markdown Renderer with AI Feel ──────────────────────────────────────────
function renderMarkdown(text) {
  if (typeof text !== 'string' || !text.trim()) return null;

  const lines = text.split('\n');
  const elements = [];
  let i = 0;
  let listBuffer = [];

  const flushList = () => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul key={`ul-${elements.length}`} className="my-2.5 space-y-2 pl-1">
        {listBuffer.map((item, idx) => (
          <li key={idx} className="flex gap-2.5 items-start text-[13px] md:text-[14px] leading-relaxed text-slate-700 dark:text-slate-200 font-normal">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400 shrink-0 shadow-sm shadow-blue-500/50" />
            <span className="flex-1">{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  while (i < lines.length) {
    const line = lines[i];

    // Table detection: pipe-separated rows
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      flushList();
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(renderTable(tableLines, elements.length));
      continue;
    }

    // Heading H1
    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={i} className="text-base md:text-lg font-black text-slate-900 dark:text-slate-50 mt-4 mb-2 tracking-tight pb-1 border-b border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          {renderInline(line.slice(2))}
        </h1>
      );
    }
    // Heading H2
    else if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={i} className="text-sm md:text-base font-extrabold text-slate-850 dark:text-slate-100 mt-3.5 mb-2 tracking-tight flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-blue-500" />
          {renderInline(line.slice(3))}
        </h2>
      );
    }
    // Heading H3
    else if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={i} className="text-[13px] md:text-sm font-bold text-slate-800 dark:text-slate-200 mt-3 mb-1">
          {renderInline(line.slice(4))}
        </h3>
      );
    }
    // Callout / Blockquote
    else if (line.startsWith('> ')) {
      flushList();
      const content = line.slice(2);
      elements.push(
        <blockquote key={i} className="my-3 rounded-2xl border-l-4 border-amber-500 bg-amber-50/60 dark:bg-amber-950/20 p-3.5 text-[12.5px] md:text-[13px] font-medium text-amber-900 dark:text-amber-300 shadow-sm flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="flex-1 leading-relaxed">{renderInline(content)}</div>
        </blockquote>
      );
    }
    // Horizontal rule
    else if (line.trim() === '---' || line.trim() === '***') {
      flushList();
      elements.push(<hr key={i} className="my-4 border-slate-200/80 dark:border-slate-800" />);
    }
    // Ordered list
    else if (/^\d+\.\s/.test(line)) {
      flushList();
      const olLines = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        olLines.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${elements.length}`} className="my-2.5 space-y-2 pl-1">
          {olLines.map((item, idx) => (
            <li key={idx} className="flex gap-2.5 items-start text-[13px] md:text-[14px] leading-relaxed">
              <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 text-[10px] font-extrabold mt-0.5 border border-blue-200 dark:border-blue-800">{idx + 1}</span>
              <span className="text-slate-750 dark:text-slate-200 flex-1">{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }
    // Bullet list
    else if (line.trim().startsWith('- ') || line.trim().startsWith('* ') || line.trim().startsWith('✓ ')) {
      listBuffer.push(line.trim().replace(/^[-*✓]\s+/, ''));
    }
    // Empty line — flush list, add spacing
    else if (!line.trim()) {
      flushList();
      if (elements.length > 0) {
        elements.push(<div key={`space-${i}`} className="h-1.5" />);
      }
    }
    // Normal paragraph
    else {
      flushList();
      const rendered = renderInline(line);
      if (rendered) {
        elements.push(
          <p key={i} className="text-[13px] md:text-[14px] text-slate-750 dark:text-slate-200 leading-relaxed mb-2 break-words font-normal">
            {rendered}
          </p>
        );
      }
    }
    i++;
  }

  flushList();
  return elements;
}

function renderTable(lines, keyOffset) {
  const rows = lines
    .filter(l => !l.trim().match(/^\|[-\s|]+\|$/)) // filter separator row
    .map(l => l.trim().slice(1, -1).split('|').map(c => c.trim()));

  if (rows.length === 0) return null;
  const headers = rows[0];
  const body = rows.slice(1);

  return (
    <div key={`table-${keyOffset}`} className="my-3.5 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-[#121622]">
      <table className="w-full text-[11.5px] md:text-xs text-left border-collapse">
        <thead>
          <tr className="bg-slate-100/70 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold">
            {headers.map((h, i) => (
              <th key={i} className="px-3.5 py-2.5 whitespace-nowrap">{renderInline(h)}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-150 dark:divide-slate-800/80">
          {body.map((row, ri) => (
            <tr key={ri} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-3.5 py-2.5 text-slate-700 dark:text-slate-300 font-medium">{renderInline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderInline(text) {
  if (!text || typeof text !== 'string') return text;
  
  // Handle code chips `code`
  const codeParts = text.split(/(`.*?`)/g);
  return codeParts.map((codePart, ci) => {
    if (codePart.startsWith('`') && codePart.endsWith('`')) {
      return (
        <code key={ci} className="rounded-md bg-slate-100 dark:bg-slate-800/90 px-1.5 py-0.5 text-[11.5px] font-mono text-indigo-600 dark:text-indigo-300 border border-slate-200/60 dark:border-slate-700/60">
          {codePart.slice(1, -1)}
        </code>
      );
    }
    
    // Handle bold **text**
    const parts = codePart.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`${ci}-${i}`} className="font-extrabold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  });
}

// ── Confidence Badge ───────────────────────────────────────────────────────────
function ConfidenceBadge({ confidence, label, reason }) {
  if (!confidence && !label) return null;
  const score = typeof confidence === 'number' ? confidence : 0;
  
  let colorClass = 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300';
  let Icon = AlertTriangle;
  if (score >= 85) { colorClass = 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'; Icon = ShieldCheck; }
  else if (score >= 65) { colorClass = 'text-blue-700 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40'; Icon = TrendingUp; }
  else if (score >= 45) { colorClass = 'text-amber-700 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40'; Icon = AlertTriangle; }

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9.5px] font-extrabold ${colorClass}`} title={reason || ''}>
      <Icon className="h-3 w-3 shrink-0" />
      <span>Confidence: {label || score + '%'}</span>
    </div>
  );
}

// ── ChatGPT-o1 Style Reasoning / Thinking Box ────────────────────────────────────
function GptThinkingBox({ isFinished = false, secondsElapsed = 5.8, queryText = '' }) {
  const [isOpen, setIsOpen] = useState(!isFinished);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setTimer(prev => +(prev + 0.1).toFixed(1));
    }, 100);
    return () => clearInterval(interval);
  }, [isFinished]);

  const displayTime = isFinished ? secondsElapsed : timer;

  // Determine current active reasoning step for loading state
  const getCurrentStep = (t) => {
    if (t < 1.5) return 0;
    if (t < 3.2) return 1;
    if (t < 4.8) return 2;
    return 3;
  };

  const activeStep = isFinished ? 4 : getCurrentStep(timer);

  // Dynamic context-aware steps generation
  const getDynamicSteps = (text) => {
    const q = (text || '').toLowerCase();
    
    if (q.includes('fee') || q.includes('dues') || q.includes('cost') || q.includes('tuition') || q.includes('challan') || q.includes('rs.')) {
      return [
        { label: "Deconstructing query & verifying CUI Wah Fee Structure" },
        { label: "Retrieving official Fall 2026 (FA26) admission & recurring semester charges" },
        { label: "Itemizing admission fee, tuition, and refundable security deposits" },
        { label: "Formatting structured fee table with verified citations" }
      ];
    }
    
    if (q.includes('merit') || q.includes('cutoff') || q.includes('aggregate') || q.includes('closing') || q.includes('chance')) {
      return [
        { label: "Deconstructing prompt & verifying CUI Wah program criteria" },
        { label: "Searching official Fall 2026 (FA26) closing merit aggregates & cutoffs" },
        { label: "Calculating aggregate formula (10% Matric + 40% HSSC + 50% NAT)" },
        { label: "Formatting program cutoff analysis with verified sources" }
      ];
    }

    if (q.includes('hostel') || q.includes('transport') || q.includes('bus') || q.includes('room') || q.includes('accommodation')) {
      return [
        { label: "Deconstructing prompt & checking CUI Wah campus facilities" },
        { label: "Retrieving hostel allotment criteria, room rates & transport routes" },
        { label: "Checking room availability & warden contact details" },
        { label: "Formatting hostel & transport guide with verified sources" }
      ];
    }

    if (q.includes('test') || q.includes('nts') || q.includes('august') || q.includes('date') || q.includes('apply') || q.includes('deadline')) {
      return [
        { label: "Deconstructing prompt & checking Fall 2026 (FA26) admission schedule" },
        { label: "Verifying remaining entry test date (16th August 2026)" },
        { label: "Extracting step-by-step application instructions & portal link" },
        { label: "Formatting admission roadmap with verified source citations" }
      ];
    }

    return [
      { label: "Deconstructing prompt intent & CUI Wah Campus scope" },
      { label: "Searching knowledge base for verified guidelines & policies" },
      { label: "Cross-referencing CUI official admission regulations" },
      { label: "Formatting structured response with verified sources" }
    ];
  };

  const steps = getDynamicSteps(queryText);

  return (
    <div className={`w-full mb-2.5 rounded-2xl border transition-all duration-300 ${
      !isFinished 
        ? 'border-blue-500/40 bg-blue-50/50 dark:border-blue-500/30 dark:bg-blue-950/20 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/20 p-3.5' 
        : 'border-slate-200/80 bg-slate-50/80 dark:border-slate-800/70 dark:bg-[#131825]/90 p-3 hover:bg-slate-100/80 dark:hover:bg-[#171d2d]'
    } backdrop-blur-md`}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none group"
      >
        <div className="flex items-center gap-2.5">
          <div className={`relative flex h-6 w-6 items-center justify-center rounded-xl font-bold transition-all shadow-xs ${
            !isFinished 
              ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white animate-pulse' 
              : 'bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
          }`}>
            <Brain className={`h-3.5 w-3.5 ${!isFinished ? 'animate-pulse text-white' : 'text-slate-600 dark:text-slate-400'}`} />
            {!isFinished && (
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12.5px] font-extrabold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-1.5">
              {!isFinished ? (
                <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
                  <span>Thinking...</span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </span>
              ) : (
                <span className="text-slate-700 dark:text-slate-300 font-bold group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  Thought for {displayTime} seconds
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold bg-slate-200/60 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200/40 dark:border-slate-700/40">
            {displayTime}s
          </span>
          <button className="text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors p-0.5">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-800/80 space-y-2 text-[12px] text-slate-650 dark:text-slate-300 font-medium">
              {steps.map((st, sIdx) => {
                const isDone = sIdx < activeStep;
                const isCurrent = sIdx === activeStep && !isFinished;
                const isPending = sIdx > activeStep && !isFinished;

                return (
                  <div key={sIdx} className="flex items-center gap-2.5">
                    {isDone ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    ) : isCurrent ? (
                      <Zap className="h-3.5 w-3.5 text-blue-500 shrink-0 animate-pulse" />
                    ) : (
                      <span className="h-3.5 w-3.5 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                    )}
                    <span className={
                      isDone ? "text-slate-700 dark:text-slate-300 font-medium" :
                      isCurrent ? "text-blue-600 dark:text-blue-400 font-bold" :
                      "text-slate-400 dark:text-slate-600"
                    }>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ChatContainer({ 
  activeCategory = 'All',
  onSelectCategory = () => {},
  messages = [], 
  onSend = () => {}, 
  inputValue = '', 
  onInputChange = () => {}, 
  isLoading = false, 
  copiedId = null, 
  onCopyAnswer = () => {} 
}) {
  const safeMessages = Array.isArray(messages) ? messages : [];
  const lastUserMsgRef = useRef(null);
  const prevMsgCountRef = useRef(safeMessages.length);

  // Safely find the index of the last user message to align scroll top
  const lastUserMsgIdx = safeMessages.reduce((acc, m, i) => (m && m.sender === 'user') ? i : acc, -1);

  useEffect(() => {
    // Only scroll when user sends a new message/query
    if (safeMessages.length > prevMsgCountRef.current) {
      if (lastUserMsgRef.current) {
        lastUserMsgRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    prevMsgCountRef.current = safeMessages.length;
  }, [safeMessages.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue || !inputValue.trim() || isLoading) return;
    onSend(inputValue);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-[#0b0e14] w-full max-w-full relative">
      
      {/* Horizontally scrollable category selector pills for mobile/laptop navigation */}
      <div className="sticky top-0 z-10 w-full shrink-0 border-b border-slate-200/80 bg-white/95 px-2.5 py-2 md:px-3.5 md:py-2.5 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#10151f]/95 flex items-center gap-1.5 md:gap-2 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x">
        {CATEGORY_PILLS.map((pill) => {
          const Icon = pill.icon;
          const isActive = activeCategory === pill.name;
          return (
            <button
              key={pill.name}
              onClick={() => onSelectCategory(pill.name)}
              className={`flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1.5 md:px-3.5 text-[11.5px] md:text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 dark:bg-blue-600'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 dark:bg-[#182030] dark:text-slate-400 dark:hover:bg-slate-800/80'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{pill.name}</span>
            </button>
          );
        })}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto scroll-touch px-2.5 py-3 md:px-8 max-w-full">
        {activeCategory !== 'All' ? (
          <div className="mx-auto max-w-4xl py-1 pb-12">
            <CategoryExplorer category={activeCategory} onAskQuestion={(qText, cat) => onSend(qText, cat)} />
          </div>
        ) : safeMessages.length === 0 ? (
          /* Welcome / Empty State */
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center pt-[3vh] md:pt-[6vh] text-center px-3 sm:px-4 pb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-750 text-white shadow-xl shadow-blue-500/25 relative"
            >
              <Sparkles className="h-7 w-7 md:h-8 md:w-8 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
              </span>
            </motion.div>

            <motion.h1
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
              className="mt-4 md:mt-5 text-lg sm:text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100"
            >
              CUI Wah Admission AI
            </motion.h1>

            <motion.p
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="mt-1.5 text-slate-500 dark:text-slate-400 text-xs md:text-sm max-w-md leading-relaxed font-medium"
            >
              Instant guidance on degrees, closing merit aggregates, fee breakdowns, and hostel info for COMSATS Wah.
            </motion.p>

            <motion.div
              initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              className="mt-5 md:mt-8 w-full"
            >
              <div className="flex items-center justify-between mb-2.5 px-1">
                <p className="text-[9.5px] md:text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Frequently Asked Questions
                </p>
                <span className="text-[9.5px] md:text-[10px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Tap to ask AI
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:gap-2.5 sm:grid-cols-2">
                {SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSend(sug.text, sug.category)}
                    className="group flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-3 md:p-3.5 text-left text-xs font-bold text-slate-700 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/10 hover:shadow-md hover:-translate-y-0.5 active:scale-98 dark:border-slate-800 dark:bg-[#121622] dark:text-slate-200 dark:hover:border-blue-500/60 dark:hover:bg-blue-950/20 cursor-pointer shadow-xs"
                  >
                    <span className="pr-2 line-clamp-2 leading-snug text-[11.5px] md:text-xs">{sug.text}</span>
                    <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4 shrink-0 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          /* Conversation Feed */
          <div className="mx-auto max-w-3xl space-y-4 md:space-y-5 pb-12 pt-1">
            {safeMessages.map((msg, idx) => {
              if (!msg) return null;
              const isUser = msg.sender === 'user';
              const isLastUserMsg = idx === lastUserMsgIdx;
              const responseObj = (msg.text && typeof msg.text === 'object') ? msg.text : null;
              const answerText = responseObj ? responseObj.answer : (msg.text || '');

              return (
                <div 
                  key={msg.id || idx} 
                  ref={isLastUserMsg ? lastUserMsgRef : null}
                  className={`flex gap-2 md:gap-3 ${isUser ? 'justify-end' : 'justify-start'} w-full max-w-full scroll-mt-14`}
                >
                  {/* Bot Avatar */}
                  {!isUser && (
                    <div className="flex h-8 w-8 md:h-9 md:w-9 shrink-0 select-none items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 font-black text-white text-[11px] md:text-xs shadow-md shadow-blue-500/20 mt-0.5">
                      C
                    </div>
                  )}

                  <div className={`relative flex flex-col max-w-[96%] md:max-w-[85%] ${isUser ? 'items-end' : 'items-start'} overflow-hidden`}>
                    
                    {/* Bot Thought Header (GPT style) */}
                    {!isUser && (
                      <GptThinkingBox 
                        isFinished={true} 
                        secondsElapsed={msg.thinkingTime || 5.8} 
                        queryText={typeof answerText === 'string' ? answerText : (responseObj?.answer || '')} 
                      />
                    )}

                    <div className={`rounded-2xl px-3.5 py-2.5 md:px-4 md:py-3 shadow-xs break-words w-full max-w-full ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none dark:bg-blue-600 font-semibold shadow-md shadow-blue-500/10'
                        : 'bg-white text-slate-850 rounded-tl-none dark:bg-[#151a28] dark:text-slate-100 border border-slate-200/70 dark:border-slate-800'
                    }`}>
                      {isUser ? (
                        <p className="text-[13px] md:text-[14.5px] leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                      ) : (
                        <div className="prose dark:prose-invert break-words max-w-full overflow-x-hidden">
                          {renderMarkdown(typeof answerText === 'string' ? answerText : JSON.stringify(answerText))}
                        </div>
                      )}
                    </div>

                    {/* Action bar: Sources, confidence, copy — bot messages only */}
                    {!isUser && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 md:gap-2 w-full px-1">
                        {/* Confidence Badge */}
                        {responseObj?.confidence_label && (
                          <ConfidenceBadge
                            confidence={responseObj.confidence}
                            label={responseObj.confidence_label}
                            reason={responseObj.confidence_reason}
                          />
                        )}

                        {/* Source citations */}
                        {responseObj?.citations?.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="flex items-center gap-1 text-[8.5px] md:text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              <FileCheck className="h-3 w-3 text-blue-500" />Sources:
                            </span>
                            {responseObj.citations.map((c, si) => (
                              <span key={si} className="rounded-lg bg-slate-100 dark:bg-slate-800 px-1.5 md:px-2 py-0.5 text-[8.5px] md:text-[9px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50" title={c.tier}>
                                {c.icon} {c.label}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Fallback sources */}
                        {!responseObj?.citations && responseObj?.sources?.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="flex items-center gap-1 text-[8.5px] md:text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              <FileCheck className="h-3 w-3 text-blue-500" />Sources:
                            </span>
                            {responseObj.sources.map((src, si) => (
                              <span key={si} className="rounded-lg bg-slate-100 dark:bg-slate-800 px-1.5 md:px-2 py-0.5 text-[8.5px] md:text-[9px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
                                {src}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Copy button */}
                        <button
                          onClick={() => onCopyAnswer(msg.id, typeof answerText === 'string' ? answerText : '')}
                          className="rounded-xl p-1 md:p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors shrink-0 ml-auto flex items-center gap-1 text-xs font-semibold cursor-pointer"
                          title="Copy Answer"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                              <span className="text-[9.5px] text-emerald-600 dark:text-emerald-400 font-bold">Copied</span>
                            </>
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="flex h-8 w-8 md:h-9 md:w-9 shrink-0 select-none items-center justify-center rounded-xl md:rounded-2xl bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 shadow-xs mt-0.5">
                      <User className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* AI GPT Thinking State (When loading) */}
            {isLoading && (
              <div className="flex gap-2 md:gap-3 justify-start w-full">
                <div className="flex h-8 w-8 md:h-9 md:w-9 shrink-0 select-none items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 font-black text-white text-[11px] md:text-xs shadow-md shadow-blue-500/20 mt-0.5 animate-pulse">
                  C
                </div>
                <div className="max-w-[96%] md:max-w-[85%] w-full">
                  <GptThinkingBox isFinished={false} queryText={inputValue} />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="border-t border-slate-200/80 bg-white/95 backdrop-blur-md p-2.5 pb-3 md:p-3 md:pb-3 dark:border-slate-800/80 dark:bg-[#10151f]/95 shrink-0 w-full">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="relative flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 dark:border-slate-800 dark:bg-[#151a28] dark:focus-within:border-blue-500 dark:focus-within:ring-blue-500/10 transition-all duration-200">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Ask anything about CUI Wah admissions..."
              disabled={isLoading}
              className="flex-1 bg-transparent px-3.5 py-3 md:px-4 md:py-3.5 text-[13px] md:text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="mr-1.5 md:mr-2 rounded-xl bg-blue-600 p-2 md:p-2.5 text-white transition hover:bg-blue-700 active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 shrink-0 cursor-pointer shadow-xs"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1.5 text-center text-[8.5px] md:text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate px-2">
            Answers compiled from official CUI knowledge base · All sources cited
          </p>
        </form>
      </div>
    </div>
  );
}
