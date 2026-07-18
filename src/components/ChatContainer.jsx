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
        <li key={lineIdx} className="ml-5 list-disc mb-2 leading-relaxed text-sm md:text-base break-words">
          {content}
        </li>
      );
    }

    return (
      <p key={lineIdx} className="mb-2 leading-relaxed text-sm md:text-base break-words">
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
    <div className="flex flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-[#0b0e14] w-full max-w-full">
      {/* Messages area - scrollable, momentum on iOS */}
      <div className="flex-1 overflow-y-auto scroll-touch px-4 py-6 md:px-8 max-w-full">
        {activeCategory !== 'All' ? (
          /* Category Explorer View */
          <div className="mx-auto max-w-4xl py-4 pb-12">
            <CategoryExplorer 
              category={activeCategory} 
              onAskQuestion={(qText, cat) => onSend(qText, cat)} 
            />
          </div>
        ) : messages.length === 0 ? (
          /* Empty State / Dashboard welcome */
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center pt-[6vh] md:pt-[10vh] text-center px-4 pb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 border border-blue-500/10"
            >
              <Sparkles className="h-7 w-7" />
            </motion.div>

            <motion.h1
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100"
            >
              COMSATS Admission AI Assistant
            </motion.h1>

            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-slate-500 dark:text-slate-400 text-xs md:text-sm max-w-md leading-relaxed"
            >
              Ask any question about admissions, programs, eligibility, fee structures, prerequisites, and scholarships at COMSATS University Islamabad.
            </motion.p>

            {/* Suggestions */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 md:mt-10 w-full"
            >
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 text-left">
                Suggested Questions
              </p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSend(sug.text, sug.category)}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left text-xs font-bold text-slate-700 transition-all hover:border-blue-400 hover:bg-blue-50/10 hover:text-blue-600 active:scale-98 dark:border-slate-800 dark:bg-[#121622] dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/20 dark:hover:text-blue-400 shadow-sm"
                  >
                    <span className="pr-2">{sug.text}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-655" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          /* Conversation history chat feed */
          <div className="mx-auto max-w-3xl space-y-6 pb-12 pt-2">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'} w-full max-w-full`}
                >
                  {/* Sender Avatar */}
                  {!isUser && (
                    <div className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 font-extrabold text-white text-xs shadow-md">
                      C
                    </div>
                  )}

                  {/* Message Bubble Container */}
                  <div className={`relative flex flex-col max-w-[90%] md:max-w-[80%] ${isUser ? 'items-end' : 'items-start'} overflow-hidden`}>
                    <div
                      className={`rounded-2xl px-4.5 py-3 shadow-sm break-words w-full max-w-full ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-tr-none dark:bg-blue-500 font-semibold'
                          : 'bg-white text-slate-850 rounded-tl-none dark:bg-[#151a28] dark:text-slate-200 border border-slate-200/50 dark:border-slate-800/80'
                      }`}
                    >
                      {/* Message Content */}
                      {isUser ? (
                        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                      ) : (
                        <div className="prose dark:prose-invert break-words max-w-full overflow-x-auto">
                          {renderMessageText(typeof msg.text === 'object' ? msg.text.answer : msg.text)}
                        </div>
                      )}
                    </div>

                    {/* Sources & Action bar for LLM answers */}
                    {!isUser && (
                      <div className="mt-2.5 flex flex-wrap items-center justify-between w-full px-1 gap-2">
                        {/* Sources list */}
                        {msg.text && typeof msg.text === 'object' && msg.text.sources && msg.text.sources.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="flex items-center gap-1 text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              <FileCheck className="h-3.5 w-3.5 text-blue-500/70" />
                              Sources:
                            </span>
                            {msg.text.sources.map((src, sIdx) => (
                              <span
                                key={sIdx}
                                className="rounded bg-slate-200/60 px-2 py-0.5 text-[9px] font-extrabold text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/20"
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
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors shrink-0 ml-auto"
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
                    <div className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-xl bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-4050 shadow-sm">
                      <User className="h-4.5 w-4.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isLoading && (
              <div className="flex gap-3.5 justify-start">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 font-extrabold text-white text-xs shadow-md animate-pulse">
                  C
                </div>
                <div className="rounded-2xl rounded-tl-none bg-white border border-slate-250/20 px-5 py-4 dark:bg-[#151a28] dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input container - sticky bottom, safe area for notched phones */}
      <div className="border-t border-slate-200 bg-white/95 backdrop-blur-md p-3 md:p-4 pb-safe dark:border-slate-800/80 dark:bg-[#0b0e14]/95 shrink-0 w-full">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="relative flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 dark:border-slate-800 dark:bg-[#151a28] dark:focus-within:border-blue-400 dark:focus-within:ring-blue-400/10 transition-all duration-300">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Ask a question about admissions..."
              disabled={isLoading}
              className="flex-1 bg-transparent px-4 py-4 text-sm md:text-base text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="mr-2 rounded-xl bg-blue-600 p-2.5 text-white transition hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-slate-850 dark:disabled:text-slate-600 shrink-0"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Answers are compiled strictly from university JSON databases.
          </p>
        </form>
      </div>
    </div>
  );
}
