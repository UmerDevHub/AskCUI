import React from 'react';
import { Menu, MessageSquare, Compass } from 'lucide-react';

export default function Navbar({ 
  isDarkMode, 
  onToggleTheme, 
  onToggleMobileSidebar,
  currentTab,
  onChangeTab,
  activeCategory
}) {
  return (
    <header className="sticky top-0 z-30 flex flex-col border-b border-premium bg-white/95 dark:bg-[#0A111E]/95 backdrop-blur-md px-4 shrink-0 shadow-sm transition-colors duration-200">
      
      {/* Top Main Section */}
      <div className="flex h-14 items-center justify-between w-full">
        {/* Left Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="rounded-lg p-2 text-slate-650 hover:bg-[#1E3A5F]/5 dark:text-slate-300 dark:hover:bg-white/5 md:hidden target-min-size flex items-center justify-center"
            title="Open navigation menu"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-[#0F1E36] font-bold text-white text-xs shadow-sm border border-slate-700">
              C
            </div>
            <div>
              <span className="font-serif font-extrabold text-[#0F1E36] dark:text-white text-[13.5px] leading-none block">
                COMSATS Wah
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none mt-0.5 block">
                Admissions Concierge
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Title Header */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Official Information System
          </span>
        </div>

        {/* Right controls (Theme indicator / user controls can go here) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="rounded-lg p-2 text-slate-650 hover:bg-[#1E3A5F]/5 dark:text-slate-350 dark:hover:bg-white/5 target-min-size flex items-center justify-center"
            title="Toggle theme mode"
            aria-label="Toggle theme mode"
          >
            {isDarkMode ? (
              <span className="text-xs font-bold text-[#C9A84C]">LIGHT</span>
            ) : (
              <span className="text-xs font-bold text-[#0F1E36]">DARK</span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Swapper Section (Browse vs Chat) - only show when a category other than 'All' is active */}
      {activeCategory !== 'All' && (
        <div className="flex items-center justify-center border-t border-slate-100 dark:border-slate-850/80 py-1.5 w-full">
          <div className="flex rounded-full bg-slate-100 dark:bg-[#151d2a] p-1 shadow-inner border border-slate-200/40 dark:border-slate-800/40">
            <button
              onClick={() => onChangeTab('browse')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-150 ${
                currentTab === 'browse'
                  ? 'bg-white text-[#0F1E36] shadow-sm dark:bg-[#202c3e] dark:text-white'
                  : 'text-slate-500 hover:text-[#0F1E36] dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Browse</span>
            </button>
            <button
              onClick={() => onChangeTab('chat')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-150 ${
                currentTab === 'chat'
                  ? 'bg-white text-[#0F1E36] shadow-sm dark:bg-[#202c3e] dark:text-white'
                  : 'text-slate-500 hover:text-[#0F1E36] dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Chat View</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
