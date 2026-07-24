import React from 'react';
import { Menu, Plus, Sparkles } from 'lucide-react';

export default function Navbar({ 
  onToggleMobileSidebar,
  onNewConversation
}) {
  return (
    <header className="sticky top-0 z-30 flex md:hidden items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#10151f]/90 backdrop-blur-md px-3.5 py-2.5 shrink-0 shadow-sm">
      
      {/* Left side: Menu & Brand */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleMobileSidebar}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80 transition-colors active:scale-95 cursor-pointer"
          title="Toggle Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 font-black text-white text-xs shadow-md shadow-blue-500/20">
            C
          </div>
          <div>
            <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm leading-none block flex items-center gap-1">
              CUI Wah AI
              <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500 animate-pulse" />
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-none">
              Admission Guide
            </span>
          </div>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-1.5">
        {onNewConversation && (
          <button
            onClick={onNewConversation}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 text-white px-3 py-1.5 text-xs font-bold transition-all active:scale-95 shadow-md shadow-blue-500/20 cursor-pointer"
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

