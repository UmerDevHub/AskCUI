import React from 'react';
import { Menu, Zap } from 'lucide-react';

export default function Navbar({ 
  isDarkMode, 
  onToggleTheme, 
  onToggleMobileSidebar 
}) {
  return (
    <header className="flex items-center justify-between border-b border-warm-200 dark:border-slate-800/60 bg-white dark:bg-[#10151f] px-4 py-3 md:px-6">
      
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
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 font-bold text-white text-xs">
            C
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
            CUI Admissions
          </span>
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
