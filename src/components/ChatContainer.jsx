import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Copy, Check, ArrowRight, User, 
  TrendingUp, Globe, BookOpen, 
  DollarSign, Home, CheckCircle, Calculator, Clipboard, 
  FileText, Award, HelpCircle, Phone, ChevronDown, ChevronUp,
  Clock, CheckCircle2, AlertCircle, GraduationCap, ArrowDown,
  Sparkles, ThumbsUp, ThumbsDown, RotateCcw, Volume2, VolumeX,
  Share2, Brain, Zap, CornerDownLeft, RefreshCw
} from 'lucide-react';
import CategoryExplorer from './CategoryExplorer';

// ── SUGGESTIONS & CATEGORIES DATA ───────────────────────────────────────────────
const SUGGESTIONS = [
  { text: "What is the fee structure for BS Computer Science in Fall 2026?", category: "Fees", icon: DollarSign },
  { text: "What was the closing merit aggregate for BS CS in Fall 2024?", category: "Merit Lists", icon: TrendingUp },
  { text: "Calculate my merit: Matric 950/1100, FSc 1000/1100, NAT 72", category: "Merit Calculator", icon: Calculator },
  { text: "Can Pre-Medical students apply for Software Engineering?", category: "Prerequisites", icon: FileText },
  { text: "What scholarships and financial assistance are available?", category: "Scholarships", icon: Award },
  { text: "How do I apply for CUI Wah admission step-by-step?", category: "How to Apply", icon: Clipboard },
  { text: "What is the hostel fee, room allotment & bus route availability?", category: "Hostel & Transport", icon: Home },
  { text: "What are the contact numbers and office location for admissions?", category: "Contact Info", icon: Phone },
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

const QUICK_ACTIONS = [
  { label: 'BS Fee Structure', query: 'What is the complete fee structure for BS Computer Science and Software Engineering?', category: 'Fees' },
  { label: 'Closing Merit Cutoffs', query: 'Show me the latest closing merit aggregates for all undergraduate programs.', category: 'Merit Lists' },
  { label: 'Hostel Charges', query: 'What are the hostel charges, room security, and mess fee at CUI Wah?', category: 'Hostel & Transport' },
  { label: 'Eligibility Check', query: 'What is the eligibility percentage and test requirement for BS Computer Science?', category: 'Eligibility' },
];

// ── MARKDOWN RENDERER ──────────────────────────────────────────────────────────
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
          <li key={idx} className="flex gap-2.5 items-start text-[13.5px] md:text-[14.5px] leading-relaxed text-[#2B2B2B] dark:text-[#D8E2EE] font-normal">
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

    // Code block detection
    if (line.trim().startsWith('```')) {
      flushList();
      const codeLines = [];
      const language = line.trim().slice(3);
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <CodeBlock key={`code-${i}`} code={codeLines.join('\n')} language={language} />
      );
      i++;
      continue;
    }

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
        <blockquote key={i} className="my-3 rounded-xl border-l-4 border-[#7A1E2B] bg-[#F7F5F0] dark:bg-[#0E1B2D] p-3.5 text-[13px] md:text-[13.5px] font-medium text-[#2B2B2B] dark:text-[#D8E2EE] border border-[#E7E2D8] dark:border-[#1A2A40] flex items-start gap-2.5 shadow-xs">
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
            <li key={idx} className="flex gap-2.5 items-start text-[13.5px] md:text-[14.5px] leading-relaxed">
              <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-md bg-[#0B2545] text-white text-[10px] font-bold mt-0.5 shadow-xs">{idx + 1}</span>
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
          <p key={i} className="text-[13.5px] md:text-[14.5px] text-[#2B2B2B] dark:text-[#D8E2EE] leading-relaxed mb-2 break-words font-normal">
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

// ── CODE BLOCK COMPONENT WITH COPY ──────────────────────────────────────────────
function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3.5 rounded-xl overflow-hidden border border-[#E7E2D8] dark:border-[#1A2A40] bg-[#070D18] text-slate-100 shadow-md font-sans">
      <div className="flex items-center justify-between px-4 py-2 bg-[#0B1524] border-b border-[#1A2A40] text-[11px] font-mono text-slate-400">
        <span>{language || 'text'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ── TABLE RENDERER ─────────────────────────────────────────────────────────────
function renderTable(lines, keyOffset) {
  const rows = lines
    .filter(l => !l.trim().match(/^\|[-\s|]+\|$/))
    .map(l => l.trim().slice(1, -1).split('|').map(c => c.trim()));

  if (rows.length === 0) return null;
  const headers = rows[0];
  const body = rows.slice(1);

  return (
    <div key={`table-${keyOffset}`} className="my-3.5 overflow-x-auto rounded-xl border border-[#E7E2D8] dark:border-[#1A2A40] bg-white dark:bg-[#0B1524] shadow-xs">
      <table className="w-full text-[12px] md:text-[13px] text-left border-collapse">
        <thead>
          <tr className="bg-[#F7F5F0] dark:bg-[#070D18] border-b border-[#E7E2D8] dark:border-[#1A2A40] text-[#0B2545] dark:text-[#E2EBFA] font-bold font-serif">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 whitespace-nowrap">{renderInline(h)}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E7E2D8] dark:divide-[#1A2A40]">
          {body.map((row, ri) => (
            <tr key={ri} className="hover:bg-[#F4F5F7] dark:hover:bg-[#112035] transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3 text-[#2B2B2B] dark:text-[#D8E2EE] font-medium">{renderInline(cell)}</td>
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
        <code key={ci} className="rounded-md bg-[#F4F5F7] dark:bg-[#112035] px-1.5 py-0.5 text-[11.5px] font-mono text-[#7A1E2B] dark:text-[#C9A227] border border-[#E7E2D8] dark:border-[#1A2A40]">
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

// ── CHATGPT & GEMINI STYLE SLEEK THINKING COMPONENT ─────────────────────────────
function GptThinkingBox({ isFinished = false, secondsElapsed = 4.2, queryText = '' }) {
  const [isOpen, setIsOpen] = useState(false);
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
    if (t < 1.2) return 0;
    if (t < 2.5) return 1;
    if (t < 3.8) return 2;
    return 3;
  };

  const activeStep = isFinished ? 4 : getCurrentStep(timer);

  const getDynamicSteps = (text) => {
    const q = (text || '').toLowerCase();
    
    if (q.includes('fee') || q.includes('dues') || q.includes('cost') || q.includes('tuition') || q.includes('challan') || q.includes('rs.')) {
      return [
        { label: "Parsing fee inquiry & program category" },
        { label: "Retrieving official CUI Wah Fall 2026 fee schedules" },
        { label: "Validating registration & tuition amounts" },
        { label: "Formatting response table" }
      ];
    }
    
    if (q.includes('merit') || q.includes('cutoff') || q.includes('aggregate') || q.includes('closing') || q.includes('chance')) {
      return [
        { label: "Checking program admission criteria" },
        { label: "Searching Fall closing merit cutoffs" },
        { label: "Applying merit formula (10% Matric + 40% HSSC + 50% NAT)" },
        { label: "Synthesizing cutoff analysis" }
      ];
    }

    return [
      { label: "Analyzing query intent within CUI Wah scope" },
      { label: "Searching knowledge base for official policies" },
      { label: "Cross-referencing admission regulations" },
      { label: "Formatting structured response" }
    ];
  };

  const steps = getDynamicSteps(queryText);

  return (
    <div className="w-full mb-1.5 select-none font-sans">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-[#666666] dark:text-[#94A3B8] hover:text-[#0B2545] dark:hover:text-[#E2EBFA] transition-colors py-0.5 px-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer group"
      >
        {!isFinished ? (
          <span className="flex items-center gap-1.5 text-[#0B2545] dark:text-[#C9A227] font-semibold">
            <Sparkles className="h-3.5 w-3.5 animate-spin text-[#7A1E2B] dark:text-[#C9A227]" />
            <span>Thinking... ({displayTime}s)</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <Brain className="h-3.5 w-3.5 text-[#666666] dark:text-[#809BCE] group-hover:text-[#0B2545] dark:group-hover:text-[#C9A227] transition-colors" />
            <span>Thought for {displayTime} seconds</span>
          </span>
        )}

        <div className="flex items-center gap-1">
          {isOpen ? (
            <ChevronUp className="h-3 w-3 text-[#666666] dark:text-[#94A3B8]" />
          ) : (
            <ChevronDown className="h-3 w-3 text-[#666666] dark:text-[#94A3B8]" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-1 mb-2 p-3 rounded-xl border border-[#E7E2D8] bg-[#F7F5F0] dark:border-[#1A2A40] dark:bg-[#0E1B2D] text-[11.5px] text-[#2B2B2B] dark:text-[#C0D0E5]">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E7E2D8] dark:border-[#1A2A40]">
                <span className="font-bold text-[10.5px] uppercase tracking-wider text-[#0B2545] dark:text-[#C9A227] flex items-center gap-1.5 font-serif">
                  <Zap className="h-3 w-3 text-[#7A1E2B] dark:text-[#C9A227]" />
                  Reasoning Trace
                </span>
                <span className="text-[10px] font-mono text-[#666666] dark:text-[#809BCE]">
                  {displayTime}s total
                </span>
              </div>

              <div className="space-y-2 font-medium">
                {steps.map((st, sIdx) => {
                  const isDone = sIdx < activeStep;
                  const isCurrent = sIdx === activeStep && !isFinished;

                  return (
                    <div key={sIdx} className="flex items-center gap-2">
                      {isDone ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#0B2545] dark:text-[#C9A227] shrink-0" />
                      ) : isCurrent ? (
                        <Clock className="h-3.5 w-3.5 text-[#7A1E2B] animate-pulse shrink-0" />
                      ) : (
                        <span className="h-3 w-3 rounded-full border border-[#D8D2C4] dark:border-[#1A2A40] shrink-0" />
                      )}
                      <span className={
                        isDone ? "text-[#2B2B2B] dark:text-[#E2EBFA]" :
                        isCurrent ? "text-[#7A1E2B] dark:text-[#C9A227] font-semibold" :
                        "text-[#888888] dark:text-[#607085]"
                      }>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── TYPEWRITER TEXT STREAMING ───────────────────────────────────────────────────
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

// ── CHATGPT / GEMINI STYLE ACTION BAR ──────────────────────────────────────────
function MessageActionBar({ 
  msgId, 
  answerText, 
  copiedId, 
  onCopyAnswer, 
  isUser = false 
}) {
  const [feedback, setFeedback] = useState(null);
  const [speaking, setSpeaking] = useState(false);

  const handleSpeechToggle = () => {
    if (!('speechSynthesis' in window)) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const plainText = answerText.replace(/[#*`|_~]/g, '');
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.rate = 1.0;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    }
  };

  if (isUser) return null;

  return (
    <div className="mt-2.5 flex items-center gap-1 md:gap-2 w-full text-[#777777] dark:text-[#94A3B8]">
      {/* Thumbs Up */}
      <button
        onClick={() => setFeedback(feedback === 'like' ? null : 'like')}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 ${
          feedback === 'like' ? 'text-[#0B2545] dark:text-[#C9A227]' : ''
        }`}
        title="Good response"
      >
        <ThumbsUp className="h-3.5 w-3.5" />
      </button>

      {/* Thumbs Down */}
      <button
        onClick={() => setFeedback(feedback === 'dislike' ? null : 'dislike')}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 ${
          feedback === 'dislike' ? 'text-[#7A1E2B] dark:text-red-400' : ''
        }`}
        title="Bad response"
      >
        <ThumbsDown className="h-3.5 w-3.5" />
      </button>

      {/* Copy Button */}
      <button
        onClick={() => onCopyAnswer(msgId, answerText)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        title="Copy"
      >
        {copiedId === msgId ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            <span className="text-[11px] hidden sm:inline">Copy</span>
          </>
        )}
      </button>

      {/* Speech Button */}
      {'speechSynthesis' in window && (
        <button
          onClick={handleSpeechToggle}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer ${
            speaking ? 'text-[#7A1E2B] dark:text-[#C9A227]' : ''
          }`}
          title={speaking ? "Stop reading" : "Read aloud"}
        >
          {speaking ? <VolumeX className="h-3.5 w-3.5 animate-pulse" /> : <Volume2 className="h-3.5 w-3.5" />}
          <span className="text-[11px] hidden sm:inline">{speaking ? 'Stop' : 'Read'}</span>
        </button>
      )}

      {/* Share Button */}
      <button
        onClick={() => {
          if (navigator.share) {
            navigator.share({ title: 'CUI Admissions FAQ Answer', text: answerText }).catch(() => {});
          } else {
            onCopyAnswer(msgId, answerText);
          }
        }}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer ml-auto"
        title="Share"
      >
        <Share2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ── MAIN CHAT CONTAINER COMPONENT ──────────────────────────────────────────────
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
  const textareaRef = useRef(null);
  const isAutoScrollEnabledRef = useRef(true);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const prevMsgCountRef = useRef(safeMessages.length);

  const lastUserMsgIdx = safeMessages.reduce((acc, m, i) => (m && m.sender === 'user') ? i : acc, -1);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px';
    }
  }, [inputValue]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    
    if (distanceFromBottom > 75) {
      isAutoScrollEnabledRef.current = false;
      setShowScrollBottomBtn(true);
    } else {
      isAutoScrollEnabledRef.current = true;
      setShowScrollBottomBtn(false);
    }
  };

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
    if (e) e.preventDefault();
    if (!inputValue || !inputValue.trim() || isLoading) return;
    onSend(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#F7F5F0] dark:bg-[#070D18] w-full max-w-full relative font-sans">
      
      {/* Category Tabs Bar */}
      <div className="sticky top-0 z-10 w-full shrink-0 border-b border-[#E7E2D8] bg-white/95 px-3 py-2.5 backdrop-blur-md dark:border-[#1A2A40] dark:bg-[#0B1524]/95 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x">
        {CATEGORY_PILLS.map((pill) => {
          const Icon = pill.icon;
          const isActive = activeCategory === pill.name;
          return (
            <button
              key={pill.name}
              onClick={() => onSelectCategory(pill.name)}
              className={`flex items-center gap-1.5 shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95 cursor-pointer whitespace-nowrap ${
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

      {/* Main Conversation Canvas */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scroll-touch px-3 py-6 md:px-8 max-w-full"
      >
        {activeCategory !== 'All' ? (
          <div className="mx-auto max-w-4xl py-1 pb-12">
            <CategoryExplorer category={activeCategory} onAskQuestion={(qText, cat) => onSend(qText, cat)} />
          </div>
        ) : safeMessages.length === 0 ? (
          /* Welcome Screen - Gemini & ChatGPT aesthetic */
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center pt-[3vh] md:pt-[6vh] text-center px-4 pb-12">
            
            {/* Crest Emblem */}
            <div className="relative mb-4">
              <div className="flex h-16 w-16 md:h-18 md:w-18 items-center justify-center rounded-2xl bg-[#0B2545] text-[#C9A227] shadow-lg border-2 border-[#C9A227]/80">
                <GraduationCap className="h-9 w-9 md:h-10 md:w-10 text-[#C9A227]" />
              </div>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0B2545] dark:text-[#E2EBFA]">
              COMSATS Admission AI
            </h1>
            <p className="font-serif text-xs sm:text-sm font-semibold text-[#7A1E2B] dark:text-[#C9A227] mt-1 tracking-wide uppercase">
              Wah Campus Official Knowledge Hub
            </p>

            <p className="mt-2 text-[#555555] dark:text-[#A0B0C5] text-xs md:text-sm max-w-lg leading-relaxed font-normal">
              Ask any question regarding degree programs, Fall 2026 semester fees, eligibility criteria, closing merit lists, and campus facilities.
            </p>

            {/* Quick Action Chips */}
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {QUICK_ACTIONS.map((qa, i) => (
                <button
                  key={i}
                  onClick={() => onSend(qa.query, qa.category)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-[#0B1524] px-3.5 py-1.5 text-xs font-medium text-[#0B2545] dark:text-[#E2EBFA] border border-[#E7E2D8] dark:border-[#1A2A40] hover:border-[#0B2545] hover:shadow-xs transition-all cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#7A1E2B] dark:text-[#C9A227]" />
                  <span>{qa.label}</span>
                </button>
              ))}
            </div>

            {/* FAQ Suggestion Cards */}
            <div className="mt-8 w-full">
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {SUGGESTIONS.map((sug, idx) => {
                  const Icon = sug.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => onSend(sug.text, sug.category)}
                      className="group flex items-center justify-between rounded-2xl border border-[#E7E2D8] bg-white p-4 text-left text-xs font-medium text-[#2B2B2B] transition-all duration-150 hover:border-[#0B2545] hover:shadow-sm dark:border-[#1A2A40] dark:bg-[#0B1524] dark:text-[#E2EBFA] dark:hover:border-[#6C8EBF] cursor-pointer"
                    >
                      <div className="flex items-center gap-3 pr-2">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F4F5F7] dark:bg-[#112035] text-[#0B2545] dark:text-[#C9A227]">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="line-clamp-2 leading-snug text-[12.5px]">{sug.text}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-[#0B2545] group-hover:text-[#7A1E2B] dark:text-[#809BCE] dark:group-hover:text-[#C9A227] transition-transform group-hover:translate-x-1" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Active Chat Stream */
          <div className="mx-auto max-w-3xl space-y-6 pb-12 pt-2">
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
                  className={`flex gap-3 md:gap-4 ${isUser ? 'justify-end' : 'justify-start'} w-full max-w-full scroll-mt-14`}
                >
                  {/* Bot Avatar */}
                  {!isUser && (
                    <div className="flex h-8 w-8 md:h-9 md:w-9 shrink-0 select-none items-center justify-center rounded-xl bg-[#0B2545] font-serif font-bold text-[#C9A227] text-xs shadow-xs mt-0.5 border border-[#C9A227]/30">
                      <GraduationCap className="h-4.5 w-4.5 text-[#C9A227]" />
                    </div>
                  )}

                  <div className={`relative flex flex-col max-w-[96%] md:max-w-[88%] ${isUser ? 'items-end' : 'items-start'} overflow-hidden`}>
                    
                    {/* Collapsed ChatGPT-Style Thinking Widget */}
                    {!isUser && (
                      <GptThinkingBox 
                        isFinished={true} 
                        secondsElapsed={msg.thinkingTime || 4.2} 
                        queryText={typeof answerText === 'string' ? answerText : (responseObj?.answer || '')} 
                      />
                    )}

                    {/* Message Bubble */}
                    <div className={`px-4.5 py-3.5 shadow-xs break-words w-full max-w-full ${
                      isUser
                        ? 'bg-[#0B2545] text-white rounded-3xl rounded-tr-md font-medium'
                        : 'bg-white text-[#2B2B2B] rounded-3xl rounded-tl-md dark:bg-[#0B1524] dark:text-[#E2EBFA] border border-[#E7E2D8] dark:border-[#1A2A40]'
                    }`}>
                      {isUser ? (
                        <p className="text-[13.5px] md:text-[14.5px] leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                      ) : (
                        <TypewriterText 
                          text={typeof answerText === 'string' ? answerText : JSON.stringify(answerText)} 
                          isLatest={idx === safeMessages.length - 1} 
                          onScrollToBottom={handleTypewriterScroll}
                        />
                      )}
                    </div>

                    {/* Action Bar */}
                    {!isUser && (
                      <MessageActionBar
                        msgId={msg.id || idx}
                        answerText={typeof answerText === 'string' ? answerText : ''}
                        copiedId={copiedId}
                        onCopyAnswer={onCopyAnswer}
                      />
                    )}
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="flex h-8 w-8 md:h-9 md:w-9 shrink-0 select-none items-center justify-center rounded-xl bg-[#F4F5F7] text-[#0B2545] dark:bg-[#112035] dark:text-[#E2EBFA] border border-[#E7E2D8] dark:border-[#1A2A40] shadow-xs mt-0.5 font-bold text-xs">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 md:gap-4 justify-start w-full">
                <div className="flex h-8 w-8 md:h-9 md:w-9 shrink-0 select-none items-center justify-center rounded-xl bg-[#0B2545] text-[#C9A227] shadow-xs mt-0.5 border border-[#C9A227]/30">
                  <GraduationCap className="h-4.5 w-4.5 text-[#C9A227]" />
                </div>
                <div className="max-w-[96%] md:max-w-[88%] w-full">
                  <GptThinkingBox isFinished={false} queryText={inputValue} />
                </div>
              </div>
            )}

            <div className="h-2" />
          </div>
        )}
      </div>

      {/* Floating Pill Input Bar - Gemini & ChatGPT style */}
      <div className="border-t border-[#E7E2D8] bg-white p-3 md:p-4 dark:border-[#1A2A40] dark:bg-[#0B1524] shrink-0 w-full">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="relative flex items-end overflow-hidden rounded-3xl border border-[#E7E2D8] bg-white shadow-sm focus-within:border-[#0B2545] focus-within:ring-2 focus-within:ring-[#0B2545]/10 dark:border-[#1A2A40] dark:bg-[#070D18] dark:focus-within:border-[#6C8EBF] transition-all duration-150 p-2">
            
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about CUI Wah degree programs, Fall 2026 fees, eligibility..."
              disabled={isLoading}
              className="flex-1 bg-transparent px-3 py-2 text-[13.5px] md:text-sm text-[#2B2B2B] outline-none placeholder:text-[#888888] dark:text-[#E2EBFA] dark:placeholder:text-[#607085] font-medium resize-none max-h-44 min-h-[44px]"
            />

            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="mb-0.5 mr-0.5 rounded-full bg-[#0B2545] p-2.5 text-white transition-all hover:bg-[#7A1E2B] disabled:bg-[#E7E2D8] disabled:text-[#888888] dark:bg-[#0B2545] dark:hover:bg-[#7A1E2B] dark:disabled:bg-[#1A2A40] dark:disabled:text-[#607085] shrink-0 cursor-pointer shadow-xs active:scale-95"
              title="Send message (Enter)"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between px-3 text-[10px] text-[#666666] dark:text-[#809BCE] font-medium">
            <span className="truncate">
              COMSATS University Islamabad, Wah Campus · Official Admission AI
            </span>
            <span className="hidden sm:inline font-mono">
              Press Enter ↵ to send
            </span>
          </div>
        </form>
      </div>

      {/* Floating Scroll Bottom Button */}
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
            className="absolute bottom-24 right-4 md:right-8 z-20 flex items-center gap-1.5 rounded-full bg-[#0B2545] text-white dark:bg-[#C9A227] dark:text-[#0B2545] px-3.5 py-2 text-xs font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer border border-white/20 dark:border-black/20"
            title="Scroll to bottom"
          >
            <ArrowDown className="h-3.5 w-3.5" />
            <span>Latest message</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
