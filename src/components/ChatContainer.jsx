import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Copy, Check, FileCheck, ArrowRight, User, Sparkles } from 'lucide-react';
import CategoryExplorer from './CategoryExplorer';

const SUGGESTIONS = [
  { text: "What is the fee for BS Computer Science?", category: "Fees" },
  { text: "Can Pre-Medical students apply for Software Engineering?", category: "Prerequisites" },
  { text: "What is the fee refund policy?", category: "Fees" },
  { text: "What is the eligibility for MS Computer Science?", category: "Eligibility" },
  { text: "Is NAT test compulsory for BS?", category: "FAQs" },
  { text: "Does CUI offer hostel and transport?", category: "FAQs" }
];

// Simple markdown formatter to render bold, lists, and linebreaks nicely without external dependencies
function renderMessageText(text) {
  if (typeof text !== 'string') return '';
  
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    // Check if line is a list item
    const isBullet = line.trim().startsWith('*') || line.trim().startsWith('-');
    const cleanLine = isBullet ? line.trim().replace(/^[\*\-]\s+/, '') : line;

    // Handle bold parsing: **text**
    const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
    const content = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={partIdx} className="font-extrabold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    if (isBullet) {
      return (
        <li key={lineIdx} className="ml-5 list-disc mb-1 leading-relaxed text-sm md:text-base">
          {content}
        </li>
      );
    }

    return (
      <p key={lineIdx} className="mb-2 leading-relaxed text-sm md:text-base">
        {content}
      </p>
    );
  });
}

export default function ChatContainer({ 
  activeCategory,
  messages, 
  onSend, 
  inputValue, 
  onInputChange, 
  isLoading, 
  copiedId, 
  onCopyAnswer 
}) {
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onSend(inputValue);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        {messages.length === 0 ? (
          activeCategory === 'All' ? (
            /* Empty State / Dashboard welcome */
            <div className="mx-auto flex max-w-2xl flex-col items-center justify-center pt-[10vh] text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
              >
                <Sparkles className="h-8 w-8" />
              </motion.div>

              <motion.h1
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mt-6 text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100"
              >
                COMSATS Admission AI Assistant
              </motion.h1>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-3 text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-md"
              >
                Ask any question about admissions, programs, eligibility, fee structures, prerequisites, and scholarships at COMSATS University Islamabad.
              </motion.p>

              {/* Suggestions */}
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-10 w-full"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 text-left">
                  Suggested Questions
                </p>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {SUGGESTIONS.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSend(sug.text, sug.category)}
                      className="flex items-center justify-between rounded-2xl border border-slate-150 bg-slate-50/50 p-4 text-left text-sm font-semibold text-slate-700 transition-all hover:border-blue-400 hover:bg-blue-50/30 hover:text-blue-600 active:scale-98 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-350 dark:hover:border-blue-500 dark:hover:bg-blue-950/10 dark:hover:text-blue-400"
                    >
                      <span>{sug.text}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-450 dark:text-slate-600" />
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            /* Category Explorer View */
            <div className="mx-auto max-w-4xl py-2">
              <CategoryExplorer 
                category={activeCategory} 
                onAskQuestion={(qText, cat) => onSend(qText, cat)} 
              />
            </div>
          )
        ) : (
          /* Conversation history chat feed */
          <div className="mx-auto max-w-3xl space-y-6 pb-6">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Sender Avatar */}
                  {!isUser && (
                    <div className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-md dark:bg-blue-500">
                      C
                    </div>
                  )}

                  {/* Message Bubble Container */}
                  <div className={`relative flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-tr-none dark:bg-blue-500'
                          : 'bg-slate-100 text-slate-800 rounded-tl-none dark:bg-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {/* Message Content */}
                      {isUser ? (
                        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      ) : (
                        <div className="prose dark:prose-invert">
                          {renderMessageText(typeof msg.text === 'object' ? msg.text.answer : msg.text)}
                        </div>
                      )}
                    </div>

                    {/* Sources & Action bar for LLM answers */}
                    {!isUser && (
                      <div className="mt-2.5 flex items-center justify-between w-full px-1">
                        {/* Sources list */}
                        {msg.text && typeof msg.text === 'object' && msg.text.sources && msg.text.sources.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              <FileCheck className="h-3.5 w-3.5 text-blue-500/70" />
                              Sources:
                            </span>
                            {msg.text.sources.map((src, sIdx) => (
                              <span
                                key={sIdx}
                                className="rounded bg-slate-100/80 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                              >
                                {src}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div />
                        )}

                        {/* Copy button */}
                        <button
                          onClick={() => onCopyAnswer(msg.id, typeof msg.text === 'object' ? msg.text.answer : msg.text)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-850 dark:hover:text-slate-350 transition-colors"
                          title="Copy Answer"
                        >
                          {copiedId === msg.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-xl bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 shadow-sm">
                      <User className="h-4.5 w-4.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-md dark:bg-blue-500 animate-pulse">
                  C
                </div>
                <div className="rounded-2xl rounded-tl-none bg-slate-100 px-5 py-4 dark:bg-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-50500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input container */}
      <div className="border-t border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/20">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="relative flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm focus-within:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:focus-within:border-blue-400">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Ask a question about admissions..."
              disabled={isLoading}
              className="flex-1 bg-transparent px-4 py-3.5 text-sm md:text-base text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="mr-2 rounded-xl bg-blue-600 p-2.5 text-white transition hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-slate-800 dark:disabled:text-slate-650"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            Factual admission assistant. Answers are compiled strictly from university JSON databases.
          </p>
        </form>
      </div>
    </div>
  );
}
