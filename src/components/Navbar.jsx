import React from 'react';
import { Menu, Plus, GraduationCap } from 'lucide-react';

export default function Navbar({ 
  onToggleMobileSidebar,
  onNewConversation
}) {
  return (
    <header className="sticky top-0 z-30 flex md:hidden items-center justify-between border-b border-[#E7E2D8] dark:border-[#1A2A40] bg-white/98 dark:bg-[#0B1524]/98 backdrop-blur-md px-3.5 py-2.5 shrink-0 select-none">
      
      {/* Left side: Menu & Institutional Brand */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="rounded-lg p-2 text-[#0B2545] hover:bg-[#F4F5F7] dark:text-[#C0D0E5] dark:hover:bg-[#112035] transition-colors active:scale-95 cursor-pointer shrink-0"
          title="Toggle Menu"
          aria-label="Toggle Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0B2545] font-serif font-bold text-[#C9A227] text-xs border border-[#C9A227]/40 shadow-xs">
            <GraduationCap className="h-4 w-4 text-[#C9A227]" />
          </div>
          <div className="min-w-0">
            <span className="font-serif font-bold text-[#0B2545] dark:text-[#E2EBFA] text-xs sm:text-sm leading-none block truncate">
              COMSATS Wah Admissions
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9.5px] text-[#666666] dark:text-[#A0B0C5] font-medium leading-none truncate">
                Admissions Portal
              </span>
              <span className="inline-flex items-center rounded bg-[#7A1E2B] px-1.5 py-0.2 text-[8.5px] font-bold text-white">
                Fall 2026
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-1.5 shrink-0 ml-2">
        {onNewConversation && (
          <button
            onClick={onNewConversation}
            className="flex items-center gap-1.5 rounded-md bg-[#0B2545] hover:bg-[#7A1E2B] active:scale-95 text-white px-3 py-1.5 text-[11.5px] font-semibold transition-all shadow-xs cursor-pointer"
            title="New Inquiry"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Inquiry</span>
          </button>
        )}
      </div>
    </header>
  );
}
