import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Copy, Check, FileCheck, ArrowRight, User, 
  TrendingUp, ShieldCheck, AlertTriangle, Globe, BookOpen, 
  DollarSign, Home, CheckCircle, Calculator, Clipboard, 
  FileText, Award, HelpCircle, Phone, ChevronDown, ChevronUp,
  Clock, CheckCircle2, AlertCircle, GraduationCap, ArrowDown
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

// ── Markdown Renderer with Institutional Serif Headlines ────────────────────────
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
          <li key={idx} className="flex gap-2.5 items-start text-[13px] md:text-[14px] leading-relaxed text-[#2B2B2B] dark:text-[#D8E2EE] font-normal">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#0B2545] dark:bg-[#C9A227] shrink-0" />
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
        <h1 key={i} className="font-serif text-lg md:text-xl font-bold text-[#0B2545] dark:text-[#E2EBFA] mt-4 mb-2 tracking-tight pb-1 border-b border-[#E7E2D8] dark:border-[#1A2A40] flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#7A1E2B]" />
          {renderInline(line.slice(2))}
        </h1>
      );
    }
    // Heading H2
    else if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={i} className="font-serif text-base md:text-lg font-bold text-[#0B2545] dark:text-[#E2EBFA] mt-3.5 mb-2 tracking-tight flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-[#7A1E2B]" />
          {renderInline(line.slice(3))}
        </h2>
      );
    }
    // Heading H3
    else if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={i} className="font-serif text-sm md:text-base font-bold text-[#0B2545] dark:text-[#C0D0E5] mt-3 mb-1">
          {renderInline(line.slice(4))}
        </h3>
      );
    }
    // Callout / Blockquote
    else if (line.startsWith('> ')) {
      flushList();
      const content = line.slice(2);
      elements.push(
        <blockquote key={i} className="my-3 rounded-lg border-l-3 border-[#7A1E2B] bg-[#F7F5F0] dark:bg-[#0E1B2D] p-3 text-[12.5px] md:text-[13px] font-medium text-[#2B2B2B] dark:text-[#D8E2EE] border border-[#E7E2D8] dark:border-[#1A2A40] flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-[#7A1E2B] dark:text-[#C9A227] mt-0.5" />
          <div className="flex-1 leading-relaxed">{renderInline(content)}</div>
        </blockquote>
      );
    }
    // Horizontal rule
    else if (line.trim() === '---' || line.trim() === '***') {
      flushList();
      elements.push(<hr key={i} className="my-4 border-[#E7E2D8] dark:border-[#1A2A40]" />);
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
              <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded bg-[#0B2545] text-white text-[10px] font-bold mt-0.5">{idx + 1}</span>
              <span className="text-[#2B2B2B] dark:text-[#D8E2EE] flex-1">{renderInline(item)}</span>
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
    // Empty line
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
          <p key={i} className="text-[13px] md:text-[14px] text-[#2B2B2B] dark:text-[#D8E2EE] leading-relaxed mb-2 break-words font-normal">
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
    .filter(l => !l.trim().match(/^\|[-\s|]+\|$/))
    .map(l => l.trim().slice(1, -1).split('|').map(c => c.trim()));

  if (rows.length === 0) return null;
  const headers = rows[0];
  const body = rows.slice(1);

  return (
    <div key={`table-${keyOffset}`} className="my-3.5 overflow-x-auto rounded-lg border border-[#E7E2D8] dark:border-[#1A2A40] bg-white dark:bg-[#0B1524] shadow-xs">
      <table className="w-full text-[11.5px] md:text-xs text-left border-collapse">
        <thead>
          <tr className="bg-[#F7F5F0] dark:bg-[#070D18] border-b border-[#E7E2D8] dark:border-[#1A2A40] text-[#0B2545] dark:text-[#E2EBFA] font-bold">
            {headers.map((h, i) => (
              <th key={i} className="px-3.5 py-2.5 whitespace-nowrap">{renderInline(h)}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E7E2D8] dark:divide-[#1A2A40]">
          {body.map((row, ri) => (
            <tr key={ri} className="hover:bg-[#F4F5F7] dark:hover:bg-[#112035] transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-3.5 py-2.5 text-[#2B2B2B] dark:text-[#D8E2EE] font-medium">{renderInline(cell)}</td>
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
  
  const codeParts = text.split(/(`.*?`)/g);
  return codeParts.map((codePart, ci) => {
    if (codePart.startsWith('`') && codePart.endsWith('`')) {
      return (
        <code key={ci} className="rounded bg-[#F4F5F7] dark:bg-[#112035] px-1.5 py-0.5 text-[11.5px] font-mono text-[#7A1E2B] dark:text-[#C9A227] border border-[#E7E2D8] dark:border-[#1A2A40]">
          {codePart.slice(1, -1)}
        </code>
      );
    }
    
    const parts = codePart.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`${ci}-${i}`} className="font-bold text-[#0B2545] dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  });
}

// ── Confidence Badge ───────────────────────────────────────────────────────────
function ConfidenceBadge({ confidence, label, reason }) {
  if (!confidence && !label) return null;
  const score = typeof confidence === 'number' ? confidence : 0;
  
  let colorClass = 'text-[#0B2545] bg-[#F4F5F7] dark:bg-[#112035] dark:text-[#C0D0E5] border border-[#E7E2D8] dark:border-[#1A2A40]';
  let Icon = AlertTriangle;
  if (score >= 85) { colorClass = 'text-[#0B2545] bg-[#F4F5F7] dark:bg-[#0E1B2D] dark:text-[#C0D0E5] border border-[#E7E2D8] dark:border-[#1A2A40]'; Icon = ShieldCheck; }
  else if (score >= 65) { colorClass = 'text-[#7A1E2B] bg-[#F7F5F0] dark:bg-[#112035] dark:text-[#C9A227] border border-[#E7E2D8] dark:border-[#1A2A40]'; Icon = TrendingUp; }
  else if (score >= 45) { colorClass = 'text-[#7A1E2B] bg-[#F7F5F0] dark:bg-[#112035] dark:text-[#C9A227] border border-[#E7E2D8] dark:border-[#1A2A40]'; Icon = AlertTriangle; }

  return (
    <div className={`inline-flex items-center gap-1.5 rounded px-2.5 py-0.5 text-[9.5px] font-bold ${colorClass}`} title={reason || ''}>
      <Icon className="h-3 w-3 shrink-0" />
      <span>Verified Record: {label || score + '%'}</span>
    </div>
  );
}

// ── Institutional Processing / Reference Box ────────────────────────────────────
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

  const getCurrentStep = (t) => {
    if (t < 1.5) return 0;
    if (t < 3.2) return 1;
    if (t < 4.8) return 2;
    return 3;
  };

  const activeStep = isFinished ? 4 : getCurrentStep(timer);

  const getDynamicSteps = (text) => {
    const q = (text || '').toLowerCase();
    
    if (q.includes('fee') || q.includes('dues') || q.includes('cost') || q.includes('tuition') || q.includes('challan') || q.includes('rs.')) {
      return [
        { label: "Verifying official CUI Wah Fee Structure" },
        { label: "Retrieving Fall 2026 admission & semester fee schedules" },
        { label: "Itemizing admission fee, tuition, and security deposits" },
        { label: "Formatting official fee schedule table" }
      ];
    }
    
    if (q.includes('merit') || q.includes('cutoff') || q.includes('aggregate') || q.includes('closing') || q.includes('chance')) {
      return [
        { label: "Checking CUI Wah program admission criteria" },
        { label: "Searching Fall 2026 closing merit aggregates & cutoffs" },
        { label: "Calculating aggregate formula (10% Matric + 40% HSSC + 50% NAT)" },
        { label: "Formatting official cutoff analysis" }
      ];
    }

    if (q.includes('hostel') || q.includes('transport') || q.includes('bus') || q.includes('room') || q.includes('accommodation')) {
      return [
        { label: "Checking CUI Wah campus facilities and policies" },
        { label: "Retrieving hostel allotment criteria & transport routes" },
        { label: "Verifying room availability & warden contacts" },
        { label: "Formatting hostel & transport guide" }
      ];
    }

    return [
      { label: "Analyzing query intent within CUI Wah Campus scope" },
      { label: "Searching knowledge base for official guidelines & policies" },
      { label: "Cross-referencing CUI admission regulations" },
      { label: "Formatting structured response with verified sources" }
    ];
  };

  const steps = getDynamicSteps(queryText);

  return (
    <div className={`w-full mb-2.5 rounded-lg border transition-all duration-200 ${
      !isFinished 
        ? 'border-[#0B2545] bg-[#F7F5F0] dark:border-[#1A2A40] dark:bg-[#070D18] p-3' 
        : 'border-[#E7E2D8] bg-[#F4F5F7] dark:border-[#1A2A40] dark:bg-[#0E1B2D] p-2.5'
    }`}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none group"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-[#0B2545] text-[#C9A227]">
            <BookOpen className="h-3 w-3 text-[#C9A227]" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-[#0B2545] dark:text-[#E2EBFA] tracking-tight">
              {!isFinished ? (
                <span className="text-[#0B2545] dark:text-[#E2EBFA] font-bold">
                  Consulting Admissions Knowledge Base... ({displayTime}s)
                </span>
              ) : (
                <span className="text-[#2B2B2B] dark:text-[#C0D0E5] font-medium group-hover:text-[#0B2545] transition-colors">
                  Referenced official records ({displayTime}s)
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#666666] dark:text-[#809BCE] font-semibold bg-white dark:bg-[#0B1524] px-1.5 py-0.5 rounded border border-[#E7E2D8] dark:border-[#1A2A40]">
            {displayTime}s
          </span>
          <button className="text-[#666666] group-hover:text-[#0B2545] dark:group-hover:text-white transition-colors p-0.5">
            {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="mt-2.5 pt-2 border-t border-[#E7E2D8] dark:border-[#1A2A40] space-y-1.5 text-[11.5px] text-[#2B2B2B] dark:text-[#C0D0E5] font-medium">
              {steps.map((st, sIdx) => {
                const isDone = sIdx < activeStep;
                const isCurrent = sIdx === activeStep && !isFinished;

                return (
                  <div key={sIdx} className="flex items-center gap-2">
                    {isDone ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#0B2545] dark:text-[#C9A227] shrink-0" />
                    ) : isCurrent ? (
                      <Clock className="h-3.5 w-3.5 text-[#7A1E2B] shrink-0" />
                    ) : (
                      <span className="h-3 w-3 rounded-full border border-[#E7E2D8] dark:border-[#1A2A40] shrink-0" />
                    )}
                    <span className={
                      isDone ? "text-[#2B2B2B] dark:text-[#E2EBFA] font-medium" :
                      isCurrent ? "text-[#7A1E2B] dark:text-[#C9A227] font-semibold" :
                      "text-[#888888] dark:text-[#607085]"
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

// ── Typewriter Streaming Effect Component ────────────────────────────────────────
function TypewriterText({ text = '', isLatest = false, onScrollToBottom = () => {} }) {
  const [displayedLength, setDisplayedLength] = useState(isLatest ? 0 : text.length);

  useEffect(() => {
    if (!isLatest) {
      setDisplayedLength(text.length);
      return;
    }

    setDisplayedLength(0);
    const totalLength = text.length;
    const step = 3;
    const interval = setInterval(() => {
      setDisplayedLength((prev) => {
        const next = prev + step;
        if (onScrollToBottom) onScrollToBottom();
        if (next >= totalLength) {
          clearInterval(interval);
          return totalLength;
        }
        return next;
      });
    }, 12);

    return () => clearInterval(interval);
  }, [text, isLatest]);

  const currentText = isLatest ? text.slice(0, displayedLength) : text;
  const isTyping = isLatest && displayedLength < text.length;

  return (
    <div className="prose dark:prose-invert break-words max-w-full overflow-x-hidden relative">
      {renderMarkdown(currentText)}
      {isTyping && (
        <span className="inline-block w-1.5 h-4 ml-1 bg-[#0B2545] dark:bg-[#C9A227] animate-pulse align-middle" />
      )}
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
  const messagesContainerRef = useRef(null);
  const isAutoScrollEnabledRef = useRef(true);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const prevMsgCountRef = useRef(safeMessages.length);

  const lastUserMsgIdx = safeMessages.reduce((acc, m, i) => (m && m.sender === 'user') ? i : acc, -1);

  // Detect user manual scroll up/down
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    
    // If distance from bottom is > 60px, user has scrolled up away from bottom
    if (distanceFromBottom > 60) {
      isAutoScrollEnabledRef.current = false;
      setShowScrollBottomBtn(true);
    } else {
      // User is near bottom (< 30px)
      isAutoScrollEnabledRef.current = true;
      setShowScrollBottomBtn(false);
    }
  };

  // Scroll to bottom helper
  const scrollToBottom = (behavior = 'smooth') => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: behavior
    });
  };

  useEffect(() => {
    if (safeMessages.length > prevMsgCountRef.current) {
      isAutoScrollEnabledRef.current = true;
      setShowScrollBottomBtn(false);
      scrollToBottom('smooth');
    }
    prevMsgCountRef.current = safeMessages.length;
  }, [safeMessages.length]);

  const handleTypewriterScroll = () => {
    if (isAutoScrollEnabledRef.current && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue || !inputValue.trim() || isLoading) return;
    onSend(inputValue);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#F7F5F0] dark:bg-[#070D18] w-full max-w-full relative">
      
      {/* Institutional Category Filter Tabs Bar */}
      <div className="sticky top-0 z-10 w-full shrink-0 border-b border-[#E7E2D8] bg-white/98 px-2.5 py-2 md:px-3.5 md:py-2.5 backdrop-blur-md dark:border-[#1A2A40] dark:bg-[#0B1524]/98 flex items-center gap-1.5 md:gap-2 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x">
        {CATEGORY_PILLS.map((pill) => {
          const Icon = pill.icon;
          const isActive = activeCategory === pill.name;
          return (
            <button
              key={pill.name}
              onClick={() => onSelectCategory(pill.name)}
              className={`flex items-center gap-1.5 shrink-0 rounded-md px-3 py-1.5 md:px-3.5 text-[11.5px] md:text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#0B2545] text-white shadow-xs dark:bg-[#0B2545]'
                  : 'bg-[#F4F5F7] text-[#2B2B2B] hover:bg-[#E7E2D8] dark:bg-[#112035] dark:text-[#C0D0E5] dark:hover:bg-[#1A2A40]'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-[#C9A227]' : 'text-[#0B2545] dark:text-[#809BCE]'}`} />
              <span>{pill.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Feed */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scroll-touch px-2.5 py-4 md:px-8 max-w-full"
      >
        {activeCategory !== 'All' ? (
          <div className="mx-auto max-w-4xl py-1 pb-12">
            <CategoryExplorer category={activeCategory} onAskQuestion={(qText, cat) => onSend(qText, cat)} />
          </div>
        ) : safeMessages.length === 0 ? (
          /* Institutional Welcome Header */
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center pt-[3vh] md:pt-[5vh] text-center px-3 sm:px-4 pb-10">
            
            {/* Crest Badge */}
            <div className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-xl bg-[#0B2545] text-[#C9A227] shadow-md border-2 border-[#C9A227]">
              <GraduationCap className="h-8 w-8 md:h-9 md:w-9 text-[#C9A227]" />
            </div>

            <h1 className="mt-4 md:mt-5 font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0B2545] dark:text-[#E2EBFA]">
              COMSATS University Islamabad
            </h1>
            <p className="font-serif text-sm sm:text-base font-semibold text-[#7A1E2B] dark:text-[#C9A227] mt-1 tracking-wide">
              Wah Campus Admissions Portal & Information Hub
            </p>

            <p className="mt-2 text-[#555555] dark:text-[#A0B0C5] text-xs md:text-sm max-w-md leading-relaxed font-normal">
              Official information resource for degree programs, fee structures, eligibility criteria, closing merit lists, and hostel services.
            </p>

            {/* Question Cards Grid */}
            <div className="mt-6 md:mt-8 w-full">
              <div className="flex items-center justify-between mb-3 px-1 border-b border-[#E7E2D8] dark:border-[#1A2A40] pb-2">
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#0B2545] dark:text-[#C9A227]">
                  Official Admission Resources & FAQs
                </p>
                <span className="text-[10px] font-semibold text-[#7A1E2B] dark:text-[#C9A227]">
                  Select any resource below to inquire
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSend(sug.text, sug.category)}
                    className="group flex items-center justify-between rounded-lg border border-[#E7E2D8] bg-white p-3.5 text-left text-xs font-semibold text-[#2B2B2B] transition-all duration-150 hover:border-[#0B2545] hover:shadow-sm dark:border-[#1A2A40] dark:bg-[#0B1524] dark:text-[#E2EBFA] dark:hover:border-[#6C8EBF] cursor-pointer"
                  >
                    <span className="pr-2 line-clamp-2 leading-snug text-[12px]">{sug.text}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#0B2545] group-hover:text-[#7A1E2B] dark:text-[#809BCE] dark:group-hover:text-[#C9A227] transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
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
                  {/* Bot Institutional Avatar */}
                  {!isUser && (
                    <div className="flex h-8 w-8 md:h-9 md:w-9 shrink-0 select-none items-center justify-center rounded-lg bg-[#0B2545] font-serif font-bold text-[#C9A227] text-xs shadow-xs mt-0.5 border border-[#C9A227]/30">
                      <GraduationCap className="h-4.5 w-4.5 text-[#C9A227]" />
                    </div>
                  )}

                  <div className={`relative flex flex-col max-w-[96%] md:max-w-[85%] ${isUser ? 'items-end' : 'items-start'} overflow-hidden`}>
                    
                    {/* Knowledge Reference Box */}
                    {!isUser && (
                      <GptThinkingBox 
                        isFinished={true} 
                        secondsElapsed={msg.thinkingTime || 5.8} 
                        queryText={typeof answerText === 'string' ? answerText : (responseObj?.answer || '')} 
                      />
                    )}

                    <div className={`rounded-lg px-4 py-3 shadow-xs break-words w-full max-w-full ${
                      isUser
                        ? 'bg-[#0B2545] text-white rounded-tr-none font-medium'
                        : 'bg-white text-[#2B2B2B] rounded-tl-none dark:bg-[#0B1524] dark:text-[#E2EBFA] border border-[#E7E2D8] dark:border-[#1A2A40]'
                    }`}>
                      {isUser ? (
                        <p className="text-[13px] md:text-[14px] leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                      ) : (
                        <TypewriterText 
                          text={typeof answerText === 'string' ? answerText : JSON.stringify(answerText)} 
                          isLatest={idx === safeMessages.length - 1} 
                          onScrollToBottom={handleTypewriterScroll}
                        />
                      )}
                    </div>

                    {/* Action Bar: Citations & Copy */}
                    {!isUser && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 md:gap-2 w-full px-1">
                        {/* Confidence / Record Badge */}
                        {responseObj?.confidence_label && (
                          <ConfidenceBadge
                            confidence={responseObj.confidence}
                            label={responseObj.confidence_label}
                            reason={responseObj.confidence_reason}
                          />
                        )}

                        {/* Sources */}
                        {responseObj?.citations?.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="flex items-center gap-1 text-[9px] font-bold text-[#0B2545] dark:text-[#C9A227] uppercase tracking-wider">
                              <FileCheck className="h-3 w-3 text-[#7A1E2B]" />Sources:
                            </span>
                            {responseObj.citations.map((c, si) => (
                              <span key={si} className="rounded bg-[#F4F5F7] dark:bg-[#112035] px-2 py-0.5 text-[9px] font-bold text-[#2B2B2B] dark:text-[#C0D0E5] border border-[#E7E2D8] dark:border-[#1A2A40]">
                                {c.label}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Copy button */}
                        <button
                          onClick={() => onCopyAnswer(msg.id, typeof answerText === 'string' ? answerText : '')}
                          className="rounded-md p-1 md:p-1.5 text-[#666666] hover:bg-[#E7E2D8] hover:text-[#0B2545] dark:hover:bg-[#112035] dark:hover:text-white transition-colors shrink-0 ml-auto flex items-center gap-1 text-xs font-medium cursor-pointer"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-[#0B2545]" />
                              <span className="text-[9.5px] text-[#0B2545] font-bold">Copied</span>
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
                    <div className="flex h-8 w-8 md:h-9 md:w-9 shrink-0 select-none items-center justify-center rounded-lg bg-[#F4F5F7] text-[#0B2545] dark:bg-[#112035] dark:text-[#E2EBFA] border border-[#E7E2D8] dark:border-[#1A2A40] shadow-xs mt-0.5">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2 md:gap-3 justify-start w-full">
                <div className="flex h-8 w-8 md:h-9 md:w-9 shrink-0 select-none items-center justify-center rounded-lg bg-[#0B2545] text-[#C9A227] shadow-xs mt-0.5 border border-[#C9A227]/30">
                  <GraduationCap className="h-4.5 w-4.5 text-[#C9A227]" />
                </div>
                <div className="max-w-[96%] md:max-w-[85%] w-full">
                  <GptThinkingBox isFinished={false} queryText={inputValue} />
                </div>
              </div>
            )}

            <div className="h-2" />
          </div>
        )}
      </div>

      {/* Institutional Query Input Bar */}
      <div className="border-t border-[#E7E2D8] bg-white p-2.5 pb-3 md:p-3 md:pb-3 dark:border-[#1A2A40] dark:bg-[#0B1524] shrink-0 w-full">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="relative flex items-center overflow-hidden rounded-lg border border-[#E7E2D8] bg-white shadow-xs focus-within:border-[#0B2545] focus-within:ring-1 focus-within:ring-[#0B2545] dark:border-[#1A2A40] dark:bg-[#070D18] dark:focus-within:border-[#6C8EBF] transition-all duration-150">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Inquire about CUI Wah degree programs, fees, eligibility, merit lists..."
              disabled={isLoading}
              className="flex-1 bg-transparent px-3.5 py-3 md:px-4 md:py-3.5 text-[13px] md:text-sm text-[#2B2B2B] outline-none placeholder:text-[#888888] dark:text-[#E2EBFA] dark:placeholder:text-[#607085] font-medium"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="mr-1.5 md:mr-2 rounded-md bg-[#0B2545] p-2 md:p-2.5 text-white transition hover:bg-[#7A1E2B] disabled:bg-[#E7E2D8] disabled:text-[#888888] dark:bg-[#0B2545] dark:hover:bg-[#7A1E2B] dark:disabled:bg-[#1A2A40] dark:disabled:text-[#607085] shrink-0 cursor-pointer shadow-xs"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1.5 text-center text-[9px] font-semibold text-[#0B2545] dark:text-[#A0B0C5] uppercase tracking-wider truncate px-2">
            Official Admissions Portal · COMSATS University Islamabad, Wah Campus
          </p>
        </form>
      </div>

      {/* Floating Scroll-to-Bottom Button */}
      <AnimatePresence>
        {showScrollBottomBtn && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            onClick={() => {
              isAutoScrollEnabledRef.current = true;
              setShowScrollBottomBtn(false);
              scrollToBottom('smooth');
            }}
            className="absolute bottom-20 right-4 md:right-8 z-20 flex items-center gap-1.5 rounded-full bg-[#0B2545] text-white dark:bg-[#C9A227] dark:text-[#0B2545] px-3.5 py-2 text-xs font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer border border-white/20 dark:border-black/20"
            title="Scroll to bottom"
          >
            <ArrowDown className="h-3.5 w-3.5" />
            <span>Scroll to bottom</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
