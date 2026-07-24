import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, Copy, Check, FileCheck, ArrowRight, User, Sparkles, 
  TrendingUp, ShieldCheck, AlertTriangle, Globe, BookOpen, 
  DollarSign, Home, CheckCircle, Calculator, Clipboard, 
  FileText, Award, HelpCircle, Phone, Bell, Shield 
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

// ── Markdown Renderer ─────────────────────────────────────────────────────────
function renderMarkdown(text) {
  if (typeof text !== 'string' || !text.trim()) return null;

  const lines = text.split('\n');
  const elements = [];
  let i = 0;
  let listBuffer = [];

  const flushList = () => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul key={`ul-${elements.length}`} className="my-2 space-y-1.5 pl-1">
        {listBuffer.map((item, idx) => (
          <li key={idx} className="flex gap-2 items-start text-[13px] md:text-[14.5px] leading-relaxed">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">{renderInline(item)}</span>
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
      elements.push(<h1 key={i} className="text-base font-black text-slate-800 dark:text-slate-100 mt-4 mb-2 tracking-tight">{renderInline(line.slice(2))}</h1>);
    }
    // Heading H2
    else if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={i} className="text-sm font-extrabold text-slate-850 dark:text-slate-100 mt-3.5 mb-1.5 tracking-tight">{renderInline(line.slice(3))}</h2>);
    }
    // Heading H3
    else if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={i} className="text-[13px] font-bold text-slate-700 dark:text-slate-200 mt-3 mb-1">{renderInline(line.slice(4))}</h3>);
    }
    // Blockquote
    else if (line.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={i} className="border-l-3 border-amber-400 pl-3.5 py-1.5 my-3 text-[12.5px] text-amber-800 dark:text-amber-400 bg-amber-500/5 dark:bg-amber-950/10 rounded-r-xl font-medium">
          {renderInline(line.slice(2))}
        </blockquote>
      );
    }
    // Horizontal rule
    else if (line.trim() === '---' || line.trim() === '***') {
      flushList();
      elements.push(<hr key={i} className="my-4 border-slate-200/80 dark:border-slate-850" />);
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
        <ol key={`ol-${elements.length}`} className="my-2 space-y-2 pl-1">
          {olLines.map((item, idx) => (
            <li key={idx} className="flex gap-2.5 items-start text-[13px] md:text-[14.5px] leading-relaxed">
              <span className="shrink-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-blue-600 text-white text-[9px] font-black mt-0.5 shadow-sm">{idx + 1}</span>
              <span className="text-slate-750 dark:text-slate-300">{renderInline(item)}</span>
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
        elements.push(<p key={i} className="text-[13px] md:text-[14px] text-slate-750 dark:text-slate-300 leading-relaxed mb-1.5 break-words">{rendered}</p>);
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
    <div key={`table-${keyOffset}`} className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <table className="w-full text-[11px] md:text-xs text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            {headers.map((h, i) => (
              <th key={i} className="px-3.5 py-2.5 font-bold text-slate-800 dark:text-slate-250 whitespace-nowrap">{renderInline(h)}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
          {body.map((row, ri) => (
            <tr key={ri} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/40 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-3.5 py-2.5 text-slate-650 dark:text-slate-350">{renderInline(cell)}</td>
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
  const parts = text.split(/(\*\*.*?\*\*)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-extrabold text-slate-950 dark:text-white">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

// ── Confidence Badge ───────────────────────────────────────────────────────────
function ConfidenceBadge({ confidence, label, reason }) {
  if (!confidence && !label) return null;
  const score = typeof confidence === 'number' ? confidence : 0;
  
  let colorClass = 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400';
  let Icon = AlertTriangle;
  if (score >= 85) { colorClass = 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400'; Icon = ShieldCheck; }
  else if (score >= 65) { colorClass = 'text-blue-700 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400'; Icon = TrendingUp; }
  else if (score >= 45) { colorClass = 'text-amber-700 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400'; Icon = AlertTriangle; }

  return (
    <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${colorClass}`} title={reason || ''}>
      <Icon className="h-3 w-3 shrink-0" />
      <span>Confidence: {label || score + '%'}</span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ChatContainer({ 
  activeCategory,
  onSelectCategory,
  messages, 
  onSend, 
  inputValue, 
  onInputChange, 
  isLoading, 
  copiedId, 
  onCopyAnswer 
}) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onSend(inputValue);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-[#0b0e14] w-full max-w-full relative">
      
      {/* Horizontally scrollable category selector pills for ultra-easy mobile navigation */}
      <div className="sticky top-0 z-10 w-full shrink-0 border-b border-slate-200/80 bg-white/95 px-4 py-2.5 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#10151f]/95 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        {CATEGORY_PILLS.map((pill) => {
          const Icon = pill.icon;
          const isActive = activeCategory === pill.name;
          return (
            <button
              key={pill.name}
              onClick={() => onSelectCategory(pill.name)}
              className={`flex items-center gap-1.5 shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#182030] dark:text-slate-400 dark:hover:bg-slate-800/80'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{pill.name}</span>
            </button>
          );
        })}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto scroll-touch px-3 py-4 md:px-8 max-w-full">
        {activeCategory !== 'All' ? (
          <div className="mx-auto max-w-4xl py-2 pb-12">
            <CategoryExplorer category={activeCategory} onAskQuestion={(qText, cat) => onSend(qText, cat)} />
          </div>
        ) : messages.length === 0 ? (
          /* Welcome / Empty State */
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center pt-[4vh] md:pt-[8vh] text-center px-4 pb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-750 text-white shadow-lg shadow-blue-500/20"
            >
              <Sparkles className="h-7 w-7 animate-pulse" />
            </motion.div>

            <motion.h1
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
              className="mt-5 text-xl md:text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100"
            >
              CUI Wah Admission AI
            </motion.h1>

            <motion.p
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="mt-2.5 text-slate-500 dark:text-slate-400 text-[11.5px] md:text-xs max-w-md leading-relaxed"
            >
              Ask any question or tap one of the category pills above to instantly check merit aggregates, fee breakdowns, and campus guides.
            </motion.p>

            <motion.div
              initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              className="mt-6 md:mt-8 w-full"
            >
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-550 mb-3 text-left pl-1">
                Frequently Asked
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSend(sug.text, sug.category)}
                    className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-3.5 py-3 text-left text-xs font-bold text-slate-700 transition-all hover:border-blue-400 hover:bg-blue-50/5 hover:text-blue-600 active:scale-99 dark:border-slate-800 dark:bg-[#121622] dark:text-slate-350 dark:hover:border-blue-550 dark:hover:bg-blue-950/10 dark:hover:text-blue-400 shadow-sm"
                  >
                    <span className="pr-2 line-clamp-1">{sug.text}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          /* Conversation Feed */
          <div className="mx-auto max-w-3xl space-y-4 pb-12 pt-1">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const responseObj = typeof msg.text === 'object' ? msg.text : null;
              const answerText = responseObj ? responseObj.answer : msg.text;

              return (
                <div key={msg.id} className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} w-full max-w-full`}>
                  {/* Bot Avatar */}
                  {!isUser && (
                    <div className="flex h-8.5 w-8.5 shrink-0 select-none items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 font-extrabold text-white text-[11px] shadow-sm mt-0.5">
                      C
                    </div>
                  )}

                  <div className={`relative flex flex-col max-w-[94%] md:max-w-[85%] ${isUser ? 'items-end' : 'items-start'} overflow-hidden`}>
                    <div className={`rounded-2xl px-3.5 py-2.5 shadow-sm break-words w-full max-w-full ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none dark:bg-blue-600 font-semibold'
                        : 'bg-white text-slate-850 rounded-tl-none dark:bg-[#151a28] dark:text-slate-200 border border-slate-200/50 dark:border-slate-850'
                    }`}>
                      {isUser ? (
                        <p className="text-[13px] md:text-[14px] leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                      ) : (
                        <div className="prose dark:prose-invert break-words max-w-full overflow-x-hidden">
                          {renderMarkdown(typeof answerText === 'string' ? answerText : JSON.stringify(answerText))}
                        </div>
                      )}
                    </div>

                    {/* Sources, confidence, copy — bot messages only */}
                    {!isUser && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 w-full px-1">
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
                            <span className="flex items-center gap-0.5 text-[8.5px] font-extrabold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                              <FileCheck className="h-3 w-3 text-blue-500/70" />Sources:
                            </span>
                            {responseObj.citations.map((c, si) => (
                              <span key={si} className="rounded bg-slate-100 px-1.5 py-0.5 text-[8.5px] font-bold text-slate-650 dark:bg-slate-850 dark:text-slate-450" title={c.tier}>
                                {c.icon} {c.label}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Fallback sources */}
                        {!responseObj?.citations && responseObj?.sources?.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="flex items-center gap-0.5 text-[8.5px] font-extrabold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                              <FileCheck className="h-3 w-3 text-blue-500/70" />Sources:
                            </span>
                            {responseObj.sources.map((src, si) => (
                              <span key={si} className="rounded bg-slate-100 px-1.5 py-0.5 text-[8.5px] font-bold text-slate-650 dark:bg-slate-850 dark:text-slate-450">
                                {src}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Copy button */}
                        <button
                          onClick={() => onCopyAnswer(msg.id, typeof answerText === 'string' ? answerText : '')}
                          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-850 dark:hover:text-slate-350 transition-colors shrink-0 ml-auto"
                          title="Copy Answer"
                        >
                          {copiedId === msg.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="flex h-8.5 w-8.5 shrink-0 select-none items-center justify-center rounded-xl bg-slate-200 text-slate-600 dark:bg-slate-850 shadow-sm mt-0.5">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 font-extrabold text-white text-[11px] shadow-sm animate-pulse">C</div>
                <div className="rounded-2xl rounded-tl-none bg-white border border-slate-200/50 px-4 py-3 dark:bg-[#151a28] dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="border-t border-slate-200/80 bg-white/95 backdrop-blur-md p-3 pb-safe dark:border-slate-800/80 dark:bg-[#10151f]/95 shrink-0 w-full">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="relative flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/5 dark:border-slate-800 dark:bg-[#151a28] dark:focus-within:border-blue-500 dark:focus-within:ring-blue-500/5 transition-all duration-200">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Ask anything about CUI Wah admissions..."
              disabled={isLoading}
              className="flex-1 bg-transparent px-4 py-3.5 text-[13px] md:text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="mr-2 rounded-xl bg-blue-600 p-2 text-white transition hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1.5 text-center text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest">
            Answers compiled from official CUI knowledge base · All sources cited
          </p>
        </form>
      </div>
    </div>
  );
}
