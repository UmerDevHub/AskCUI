import React from 'react';
import { Menu, Plus, GraduationCap, Search, Sun, Moon } from 'lucide-react';

export default function Navbar({ 
  onToggleMobileSidebar,
  onNewConversation,
  onOpenSearch,
  isDarkMode,
  onToggleTheme
}) {
  return (
    <header className="sticky top-0 z-30 flex md:hidden items-center justify-between border-b border-[#E7E2D8] dark:border-[#1A2A40] bg-white/98 dark:bg-[#0B1524]/98 backdrop-blur-md px-3 py-2 shrink-0 select-none shadow-xs">
      
      {/* Left side: Menu & Institutional Brand */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="rounded-lg p-2 text-[#0B2545] hover:bg-[#F4F5F7] dark:text-[#C0D0E5] dark:hover:bg-[#112035] transition-colors active:scale-95 cursor-pointer shrink-0"
          title="Toggle Menu"
          aria-label="Toggle Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile Brand */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0B2545] font-serif font-bold text-[#C9A227] text-xs border border-[#C9A227]/40 shadow-xs">
            <GraduationCap className="h-4 w-4 text-[#C9A227]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-xs leading-none truncate">
                COMSATS Wah
              </span>
              <span className="inline-flex items-center rounded bg-[#7A1E2B] px-1.5 py-0.5 text-[8.5px] font-bold text-white shrink-0">
                FA26
              </span>
            </div>
            <span className="text-[9.5px] text-[#666666] dark:text-[#A0B0C5] font-medium leading-none block truncate mt-1">
              Admissions Portal
            </span>
          </div>
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-1 shrink-0 ml-1">
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="rounded-lg p-2 text-[#0B2545] hover:bg-[#F4F5F7] dark:text-[#C0D0E5] dark:hover:bg-[#112035] transition-colors active:scale-95 cursor-pointer"
            title="Search FAQs"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        )}

        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="rounded-lg p-2 text-[#0B2545] hover:bg-[#F4F5F7] dark:text-[#C0D0E5] dark:hover:bg-[#112035] transition-colors active:scale-95 cursor-pointer"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-[#C9A227]" /> : <Moon className="h-4 w-4 text-[#0B2545]" />}
          </button>
        )}

        {onNewConversation && (
          <button
            onClick={onNewConversation}
            className="flex items-center gap-1 rounded-md bg-[#0B2545] hover:bg-[#7A1E2B] active:scale-95 text-white px-2.5 py-1.5 text-[11px] font-semibold transition-all shadow-xs cursor-pointer ml-0.5"
            title="New Inquiry"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Inquiry</span>
            <span className="sm:hidden">New</span>
          </button>
        )}
      </div>
    </header>
  );
}
