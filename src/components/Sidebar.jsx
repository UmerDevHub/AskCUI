import React from 'react';
import { 
  Globe, 
  BookOpen, 
  DollarSign, 
  CheckCircle, 
  FileText, 
  Award, 
  HelpCircle, 
  Plus, 
  MessageSquare, 
  Trash2, 
  Search,
  Home,
  Calculator,
  Clipboard,
  TrendingUp,
  Phone,
  Moon,
  Sun
} from 'lucide-react';

const CATEGORIES = [
  { name: 'All',                icon: Globe },
  { name: 'Programs',           icon: BookOpen },
  { name: 'Fees',               icon: DollarSign },
  { name: 'Hostel & Transport', icon: Home },
  { name: 'Eligibility',        icon: CheckCircle },
  { name: 'Merit Calculator',   icon: Calculator },
  { name: 'Merit Lists',        icon: TrendingUp },
  { name: 'How to Apply',       icon: Clipboard },
  { name: 'Prerequisites',      icon: FileText },
  { name: 'Scholarships',       icon: Award },
  { name: 'FAQs',               icon: HelpCircle },
  { name: 'Contact Info',       icon: Phone },
];

export default function Sidebar({ 
  activeCategory, 
  onSelectCategory, 
  conversations, 
  activeConversationId, 
  onSelectConversation, 
  onNewConversation, 
  onDeleteConversation,
  onOpenSearch,
  isDarkMode,
  onToggleTheme
}) {
  return (
    <aside className="flex h-full w-72 flex-col border-r border-premium bg-white dark:bg-[#0A111E] transition-colors duration-200">
      
      {/* Brand Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-850/80">
        <div className="flex items-center gap-3">
          <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-[#0F1E36] font-bold text-white shadow-sm border border-slate-700">
            C
          </div>
          <div>
            <h2 className="font-serif font-black text-[#0F1E36] dark:text-white text-[13.5px] leading-tight">
              COMSATS University
            </h2>
            <p className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">
              Wah Campus · Guide
            </p>
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="px-4 py-3 space-y-2 shrink-0">
        <button
          onClick={onNewConversation}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F1E36] hover:bg-[#1C2C42] py-2.5 text-xs font-bold text-white transition-all shadow-sm target-min-size cursor-pointer dark:bg-sky-950/20 dark:text-sky-400 dark:hover:bg-sky-950/40 dark:border dark:border-sky-900/40"
          aria-label="Start a new chat conversation"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>

        <button
          onClick={onOpenSearch}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121824]/50 px-3.5 py-2.5 text-left text-xs text-slate-500 dark:text-slate-400 transition-all hover:bg-slate-100 dark:hover:bg-[#182030] target-min-size cursor-pointer"
          aria-label="Search the university knowledge base"
        >
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            Search knowledge...
          </span>
          <kbd className="hidden rounded bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 sm:inline-block">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Unified Scrollable Area for Categories + Conversations */}
      <div className="flex-1 overflow-y-auto flex flex-col min-h-0 px-3 py-2 space-y-4">

        {/* Categories Section */}
        <div>
          <p className="px-2 pb-2 text-[9.5px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">
            Admissions Directory
          </p>
          <nav className="space-y-0.5" aria-label="Admissions directory navigation">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => onSelectCategory(cat.name)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2 text-xs font-bold transition-all target-min-size cursor-pointer ${
                    isActive
                      ? 'bg-slate-100/80 text-[#0F1E36] border-l-3 border-[#C9A84C] dark:bg-[#141F32] dark:text-[#C9A84C]'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-[#121824]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#C9A84C]' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Conversations History Section */}
        <div>
          <p className="px-2 pb-2 text-[9.5px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">
            Recent Counseling Sessions
          </p>
          <div className="space-y-0.5">
            {conversations.length === 0 ? (
              <div className="py-4 text-center text-[11px] text-slate-400 dark:text-slate-650">
                No active counseling sessions
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = activeConversationId === conv.id;
                return (
                  <div
                    key={conv.id}
                    className={`group relative flex items-center rounded-lg px-3.5 py-2 text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-100 text-[#0F1E36] dark:bg-[#141F32] dark:text-white border-l-3 border-[#C9A84C]'
                        : 'text-slate-500 hover:bg-slate-50 dark:text-slate-450 dark:hover:bg-[#121824]'
                    }`}
                  >
                    <button
                      onClick={() => onSelectConversation(conv.id)}
                      className="flex flex-1 items-center gap-2.5 text-left outline-none min-w-0 target-min-size"
                      aria-label={`Open conversation: ${conv.title || 'New Chat'}`}
                    >
                      <MessageSquare className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-600" />
                      <span className="truncate font-semibold text-[11.5px]">
                        {conv.title || 'New Chat'}
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                      className="ml-1 shrink-0 opacity-0 group-hover:opacity-100 transition-all p-1 hover:text-red-650 dark:hover:text-red-400 target-min-size"
                      title="Delete conversation"
                      aria-label={`Delete conversation: ${conv.title || 'New Chat'}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 dark:border-slate-850/80 px-5 py-4 shrink-0 bg-slate-50/50 dark:bg-[#070D17]">
        <div className="flex items-center justify-between">
          <div className="text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider">
            CUI Wah V2.0
          </div>
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1726] px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
            aria-label="Switch visual theme"
          >
            {isDarkMode ? (
              <>
                <Sun className="h-3 w-3 text-amber-500" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="h-3 w-3 text-[#0F1E36]" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
