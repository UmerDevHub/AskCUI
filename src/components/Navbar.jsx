import React from 'react';
import { Menu, Zap } from 'lucide-react';

export default function Navbar({ 
  isDarkMode, 
  onToggleTheme, 
  onToggleMobileSidebar 
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-warm-200 dark:border-slate-800/60 bg-white/95 dark:bg-[#10151f]/95 backdrop-blur-md px-4 py-3 md:px-6 shrink-0 shadow-sm dark:shadow-slate-900/40">
      
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-warm-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
          title="Toggle Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile brand */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 font-bold text-white text-xs shadow-sm">
            C
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-none block">CUI Wah</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-none">Admission Guide</span>
          </div>
        </div>

        {/* Desktop breadcrumb */}
        <div className="hidden items-center gap-2 md:flex">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-[12.5px] font-medium text-slate-500 dark:text-slate-400">
              COMSATS University Islamabad
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-[12.5px] font-semibold text-slate-700 dark:text-slate-300">
              Wah Campus
            </span>
          </div>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2">
      </div>
    </header>
  );
}
