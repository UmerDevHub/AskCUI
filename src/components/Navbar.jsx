import React from 'react';
import { Menu, Plus, Sparkles } from 'lucide-react';

export default function Navbar({ 
  onToggleMobileSidebar,
  onNewConversation
}) {
  return (
    <header className="sticky top-0 z-30 flex md:hidden items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#10151f]/95 backdrop-blur-md px-3.5 py-2.5 shrink-0 shadow-xs select-none">
      
      {/* Left side: Menu & Brand */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80 transition-colors active:scale-95 cursor-pointer shrink-0"
          title="Toggle Menu"
          aria-label="Toggle Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 font-black text-white text-xs shadow-md shadow-blue-500/20">
            C
          </div>
          <div className="min-w-0">
            <span className="font-black text-slate-900 dark:text-slate-100 text-xs sm:text-sm leading-none block flex items-center gap-1.5 truncate">
              CUI Wah AI
              <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500 animate-pulse shrink-0" />
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9.5px] text-slate-400 dark:text-slate-500 font-semibold leading-none truncate">
                Admission Assistant
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 text-[8.5px] font-extrabold text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
                FA26
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-1.5 shrink-0 ml-2">
        {onNewConversation && (
          <button
            onClick={onNewConversation}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-3 py-1.5 text-[11.5px] font-extrabold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            title="New Chat"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Chat</span>
          </button>
        )}
      </div>
    </header>
  );
}

