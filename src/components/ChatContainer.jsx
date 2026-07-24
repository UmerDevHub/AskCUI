import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Copy, Check, FileCheck, ArrowRight, User, Sparkles, 
  Globe, BookOpen, DollarSign, Home, CheckCircle, Calculator, 
  Clipboard, FileText, Award, HelpCircle, Phone, ChevronDown, 
  ChevronUp, Grid, TrendingUp
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

const CATEGORIES = [
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

// Helper icons mapping
const iconMap = {
  Globe, BookOpen, DollarSign, Home, CheckCircle, Calculator, Clipboard, FileText, Award, HelpCircle, Phone, TrendingUp
};

function CategoryIcon({ name, className }) {
  const IconComponent = iconMap[name] || Globe;
  return <IconComponent className={className} />;
}

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
          <li key={idx} className="flex gap-2 items-start text-xs sm:text-sm leading-relaxed">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#C9A84C] shrink-0" />
            <span className="text-[#1A1A1A] dark:text-[#E2E8F0]">{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  while (i < lines.length) {
    const line = lines[i];

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

    if (line.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={i} className="text-sm font-serif font-black text-[#0F1E36] dark:text-white mt-4 mb-2 tracking-tight">{renderInline(line.slice(2))}</h1>);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={i} className="text-xs font-serif font-extrabold text-[#0F1E36] dark:text-white mt-3 mb-1.5 tracking-tight">{renderInline(line.slice(3))}</h2>);
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={i} className="text-[11.5px] font-serif font-bold text-slate-700 dark:text-slate-300 mt-2.5 mb-1">{renderInline(line.slice(4))}</h3>);
    } else if (line.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={i} className="border-l-3 border-[#C9A84C] pl-3 py-1.5 my-3 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-r-xl">
          {renderInline(line.slice(2))}
        </blockquote>
      );
    } else if (line.trim() === '---' || line.trim() === '***') {
      flushList();
      elements.push(<hr key={i} className="my-4 border-slate-100 dark:border-slate-800" />);
    } else if (/^\d+\.\s/.test(line)) {
      flushList();
      const olLines = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        olLines.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${elements.length}`} className="my-2 space-y-2 pl-1">
          {olLines.map((item, idx) => (
            <li key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm leading-relaxed">
              <span className="shrink-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#0F1E36] text-white text-[9px] font-black mt-0.5 shadow-sm">{idx + 1}</span>
              <span className="text-[#1A1A1A] dark:text-[#E2E8F0]">{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ') || line.trim().startsWith('✓ ')) {
      listBuffer.push(line.trim().replace(/^[-*✓]\s+/, ''));
    } else if (!line.trim()) {
      flushList();
      if (elements.length > 0) {
        elements.push(<div key={`space-${i}`} className="h-1.5" />);
      }
    } else {
      flushList();
      const rendered = renderInline(line);
      if (rendered) {
        elements.push(<p key={i} className="text-xs sm:text-sm text-[#1A1A1A] dark:text-[#E2E8F0] leading-relaxed my-1.5">{rendered}</p>);
      }
    }
    i++;
  }
  flushList();
  return elements;
}

function renderInline(text) {
  if (!text) return '';
  const parts = [];
  let currentText = text;
  let boldRegex = /\*\*(.*?)\*\*/g;
  let match;
  let lastIndex = 0;

  while ((match = boldRegex.exec(currentText)) !== null) {
    if (match.index > lastIndex) {
      parts.push(currentText.substring(lastIndex, match.index));
    }
    parts.push(<strong key={match.index} className="font-extrabold text-[#0F1E36] dark:text-white">{match[1]}</strong>);
    lastIndex = boldRegex.lastIndex;
  }
  if (lastIndex < currentText.length) {
    parts.push(currentText.substring(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}

function renderTable(tableLines, key) {
  if (tableLines.length < 2) return null;
  const parseRow = (line) => line.split('|').map(cell => cell.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
  const headers = parseRow(tableLines[0]);
  const rows = tableLines.slice(2).map(parseRow);

  return (
    <div key={key} className="my-4 overflow-x-auto rounded-xl border border-premium bg-white dark:bg-[#121824] shadow-sm max-w-full">
      <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-xs text-left" aria-label="Informational data table">
        <thead className="bg-slate-50 dark:bg-slate-900/60">
          <tr>
            {headers.map((h, idx) => (
              <th key={idx} className="px-4 py-3 font-serif font-black text-[#0F1E36] dark:text-[#E2E8F0] tracking-tight">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- STREAMING OUTPUT WRAPPER ---
function StreamingText({ text, isLast, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    if (!isLast) {
      setDisplayedText(text);
      return;
    }
    let idx = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, idx + 2));
      idx += 2;
      if (idx >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 4);
    return () => clearInterval(interval);
  }, [text, isLast]);

  return <div className="prose dark:prose-invert break-words max-w-full overflow-x-hidden">{renderMarkdown(displayedText)}</div>;
}

// --- ACCORDION CITATION BADGE EXPANDER ---
function CitationExpander({ citations }) {
  const [expandedIdx, setExpandedIdx] = useState(null);

  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-3.5 space-y-1.5 w-full">
      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest block mb-1">
        Citations & Source Snippets
      </span>
      <div className="flex flex-wrap gap-2">
        {citations.map((cite, idx) => {
          const isExpanded = expandedIdx === idx;
          return (
            <div key={idx} className="flex flex-col border border-premium bg-slate-50/40 dark:bg-slate-900/30 rounded-lg">
              <button
                onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-[#1E3A5F] dark:text-[#C9A84C] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-lg cursor-pointer outline-none border-0"
                aria-expanded={isExpanded}
              >
                <FileCheck className="h-3.5 w-3.5 text-[#C9A84C]" />
                <span>{cite.label}</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-150 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-3 pb-2.5 pt-1 text-[11px] text-slate-550 dark:text-slate-400 max-w-md whitespace-pre-wrap leading-relaxed border-t border-slate-100 dark:border-slate-800/80"
                  >
                    {cite.snippet || "Verified official admissions reference database records."}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ChatContainer({ 
  activeCategory, 
  onSelectCategory, 
  currentTab,
  onChangeTab,
  messages, 
  onSend, 
  inputValue, 
  onInputChange, 
  isLoading, 
  copiedId, 
  onCopyAnswer 
}) {
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const chatEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto scroll to chat end
  useEffect(() => {
    if (currentTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, currentTab]);

  // visualViewport Virtual Keyboard Height adjustment helper
  useEffect(() => {
    if (!window.visualViewport) return;
    const handleResize = () => {
      const offset = window.innerHeight - window.visualViewport.height;
      document.documentElement.style.setProperty('--keyboard-offset', `${Math.max(0, offset)}px`);
    };
    window.visualViewport.addEventListener('resize', handleResize);
    window.visualViewport.addEventListener('scroll', handleResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onSend(inputValue);
  };

  const handleSelectDropdownCategory = (catName) => {
    onSelectCategory(catName);
    setIsCategoryPickerOpen(false);
  };

  return (
    <div ref={containerRef} className="relative flex flex-1 flex-col overflow-hidden bg-[#F8F9FB] dark:bg-[#0A111E]">
      
      {/* Pinned Category Dropdown Selector (Mobile layout only) */}
      <div className="sticky top-0 z-20 border-b border-premium bg-white dark:bg-[#0A111E] py-2 px-4 md:hidden flex justify-between items-center w-full shadow-sm shrink-0">
        <button
          onClick={() => setIsCategoryPickerOpen(prev => !prev)}
          className="flex items-center justify-between w-full border border-premium bg-slate-50 dark:bg-slate-900 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
          aria-haspopup="dialog"
          aria-expanded={isCategoryPickerOpen}
        >
          <span className="flex items-center gap-2">
            <Grid className="h-4 w-4 text-[#C9A84C]" />
            <span>Category: {activeCategory}</span>
          </span>
          <ChevronDown className="h-4 w-4 text-slate-450" />
        </button>
      </div>

      {/* Category Dropdown Bottom Sheet Drawer */}
      <AnimatePresence>
        {isCategoryPickerOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex items-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryPickerOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.18 }}
              className="relative w-full bg-white dark:bg-[#0D1522] rounded-t-2xl border-t border-premium z-50 p-4 max-h-[75vh] overflow-y-auto pb-safe"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <span className="font-serif font-black text-[#0F1E36] dark:text-white text-sm">Select Admissions Category</span>
                <button
                  onClick={() => setIsCategoryPickerOpen(false)}
                  className="text-xs font-bold text-slate-450 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white cursor-pointer border-0"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(cat => {
                  const isActive = activeCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => handleSelectDropdownCategory(cat.name)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all text-left outline-none cursor-pointer ${
                        isActive
                          ? 'border-[#C9A84C] bg-[#C9A84C]/5 text-[#C9A84C]'
                          : 'border-slate-100 dark:border-slate-850 text-slate-650 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900'
                      }`}
                    >
                      <CategoryIcon name={cat.icon.name} className="h-4 w-4 shrink-0" />
                      <span className="truncate">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Container Contents */}
      <div className="flex-1 overflow-y-auto scroll-touch p-4">
        {currentTab === 'browse' ? (
          /* Browse Mode Category Explorer Panel */
          <div className="max-w-4xl mx-auto pb-16">
            <CategoryExplorer 
              category={activeCategory} 
              onAskQuestion={(txt, cat) => {
                onSelectCategory(cat || activeCategory);
                onSend(txt, cat || activeCategory);
              }} 
            />
          </div>
        ) : messages.length === 0 ? (
          /* Empty State Welcome concierges */
          <div className="mx-auto max-w-3xl flex flex-col justify-center items-center py-10 md:py-16 text-center space-y-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F1E36] font-bold text-white text-2xl shadow-sm border border-slate-700">
              C
            </div>
            
            <div>
              <h1 className="font-serif font-black text-2xl text-[#0F1E36] dark:text-white tracking-tight">
                CUI Wah Admission AI
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mt-2 leading-relaxed">
                Official Admissions Concierge. Ask any question regarding programs, requirements, merit lists, and hostel schedules.
              </p>
            </div>

            <div className="w-full max-w-xl space-y-2 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 block text-left">
                Suggested Inquiries
              </span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSend(sug.text, sug.category)}
                    className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-3.5 py-3.5 text-left text-xs font-bold text-slate-700 transition-all hover:border-[#C9A84C] hover:bg-slate-50 dark:border-slate-800 dark:bg-[#121622] dark:text-slate-350 dark:hover:border-[#C9A84C] dark:hover:bg-[#172030] shadow-sm outline-none cursor-pointer"
                  >
                    <span className="pr-2 line-clamp-1">{sug.text}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Conversation Feed Layout */
          <div className="mx-auto max-w-3xl space-y-8 pb-16 pt-2">
            {messages.map((msg, mIdx) => {
              const isUser = msg.sender === 'user';
              const responseObj = typeof msg.text === 'object' ? msg.text : null;
              
              // Handle error/no-answer state or confidence labels
              const confidence = responseObj?.confidence ?? 1.0;
              const hasLowConfidence = confidence < 0.25;
              
              let answerText = responseObj ? responseObj.answer : msg.text;
              if (!isUser && hasLowConfidence) {
                answerText = "I couldn't find this information in the official CUI Wah Campus datasets. For verified details, please feel free to reach out to the Admissions Office directly at info@ciitwah.edu.pk or +92-51-4534200.";
              }

              const isLast = mIdx === messages.length - 1;

              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} w-full max-w-full`}
                >
                  <div className={`relative flex flex-col max-w-[94%] md:max-w-[85%] ${isUser ? 'items-end' : 'items-start'} overflow-hidden`}>
                    
                    {isUser ? (
                      /* User Chat bubble: clean navy bubble */
                      <div className="rounded-xl px-4 py-2.5 bg-[#0F1E36] text-white font-bold text-xs sm:text-sm shadow-sm max-w-full">
                        <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                      </div>
                    ) : (
                      /* Assistant: Plain Claude-like plain layout without bubble background */
                      <div className="w-full text-xs sm:text-sm leading-relaxed text-[#1A1A1A] dark:text-[#E2E8F0] pl-1 pr-4">
                        <StreamingText 
                          text={typeof answerText === 'string' ? answerText : JSON.stringify(answerText)} 
                          isLast={isLast} 
                        />
                        
                        {/* Inline Citations Accordeons */}
                        {responseObj?.citations?.length > 0 && !hasLowConfidence && (
                          <CitationExpander citations={responseObj.citations} />
                        )}

                        {/* Copy details */}
                        <div className="mt-3 flex justify-start items-center border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
                          <button
                            onClick={() => onCopyAnswer(msg.id, typeof answerText === 'string' ? answerText : '')}
                            className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 transition-colors cursor-pointer border-0 bg-transparent outline-none"
                            title="Copy answer text"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="h-3 w-3 text-green-500" />
                                <span className="text-green-500 font-bold uppercase tracking-wider text-[8.5px]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span className="font-bold uppercase tracking-wider text-[8.5px]">Copy Answer</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* AI Typing Indicator dot */}
            {isLoading && (
              <div className="flex gap-2 justify-start items-center pl-1">
                <span className="flex h-1.5 w-1.5 rounded-full bg-[#C9A84C] animate-ping" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1.5">
                  Thinking...
                </span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input Bar pinned dynamically relative to keyboardViewport */}
      <div 
        className="sticky bottom-0 left-0 right-0 border-t border-slate-200/85 bg-white/95 backdrop-blur-md p-3 pb-safe dark:border-slate-800/80 dark:bg-[#0A111E]/95 shrink-0 w-full"
        style={{ bottom: 'var(--keyboard-offset, 0px)' }}
      >
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="relative flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-[#C9A84C] focus-within:ring-2 focus-within:ring-[#C9A84C]/5 dark:border-slate-800 dark:bg-[#121824] transition-all duration-200">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Ask anything about CUI Wah admissions..."
              disabled={isLoading}
              className="flex-1 bg-transparent px-4 py-3.5 text-xs sm:text-sm text-[#1A1A1A] outline-none placeholder:text-slate-400 dark:text-[#E2E8F0] dark:placeholder:text-slate-500 border-0"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="mr-2 rounded-lg bg-[#0F1E36] p-2 text-white transition hover:bg-[#1C2C42] disabled:bg-slate-100 disabled:text-slate-400 dark:bg-[#1A2D48] dark:hover:bg-[#253E61] dark:disabled:bg-slate-800 dark:disabled:text-slate-650 shrink-0 border-0 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest">
            Answers sourced exclusively from official CUI admission data
          </p>
        </form>
      </div>
    </div>
  );
}
