import React from 'react';
import { 
  BookOpen, 
  DollarSign, 
  CheckCircle, 
  FileText, 
  Award, 
  HelpCircle, 
  Search, 
  Plus, 
  Trash2, 
  MessageSquare,
  Globe,
  Home,
  Calculator,
  Clipboard,
  TrendingUp,
  Phone,
  Bell,
  Shield
} from 'lucide-react';

const CATEGORIES = [
  { name: 'All',                icon: Globe,       color: 'text-sky-500',     bg: 'bg-sky-50 dark:bg-sky-950/20' },
  { name: 'Programs',           icon: BookOpen,    color: 'text-indigo-500',  bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
  { name: 'Fees',               icon: DollarSign,  color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
  { name: 'Hostel & Transport', icon: Home,        color: 'text-blue-500',    bg: 'bg-blue-50 dark:bg-blue-950/20' },
  { name: 'Eligibility',        icon: CheckCircle, color: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-950/20' },
  { name: 'Merit Calculator',   icon: Calculator,  color: 'text-violet-600',  bg: 'bg-violet-50 dark:bg-violet-950/20' },
  { name: 'Merit Lists',        icon: TrendingUp,  color: 'text-cyan-600',    bg: 'bg-cyan-50 dark:bg-cyan-950/20' },
  { name: 'How to Apply',       icon: Clipboard,   color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-950/20' },
  { name: 'Prerequisites',      icon: FileText,    color: 'text-violet-500',  bg: 'bg-violet-50 dark:bg-violet-950/20' },
  { name: 'Scholarships',       icon: Award,       color: 'text-rose-500',    bg: 'bg-rose-50 dark:bg-rose-950/20' },
  { name: 'FAQs',               icon: HelpCircle,  color: 'text-blue-500',    bg: 'bg-blue-50 dark:bg-blue-950/20' },
  { name: 'Contact Info',       icon: Phone,       color: 'text-teal-600',    bg: 'bg-teal-50 dark:bg-teal-950/20' },
];

export default function Sidebar({ 
  activeCategory, 
  onSelectCategory, 
  conversations, 
  activeConversationId, 
  onSelectConversation, 
  onNewConversation, 
  onDeleteConversation,
  onOpenSearch 
}) {
  return (
    <aside className="flex h-full w-72 flex-col border-r border-warm-200 dark:border-slate-800/60 bg-white dark:bg-[#10151f]">
      
      {/* Brand Header */}
      <div className="px-5 pt-5 pb-4 border-b border-warm-200 dark:border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 font-bold text-white shadow-md text-sm">
            C
          </div>
          <div>
            <h2 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
              COMSATS University
            </h2>
            <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
              Wah Campus · Admission Guide
            </p>
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="px-4 py-3.5 space-y-2">
        <button
          onClick={onNewConversation}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-98 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>

        <button
          onClick={onOpenSearch}
          className="flex w-full items-center justify-between rounded-xl border border-warm-200 dark:border-slate-700/60 bg-warm-50 dark:bg-slate-900/60 px-3.5 py-2.5 text-left text-[13px] text-slate-500 dark:text-slate-400 transition-all hover:bg-warm-100 dark:hover:bg-slate-800/60"
        >
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            Search knowledge base...
          </span>
          <kbd className="hidden rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 sm:inline-block">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Categories + Conversations - unified scrollable area */}
      <div className="flex-1 overflow-y-auto flex flex-col min-h-0">

        {/* Categories */}
        <div className="px-3 pt-1 pb-3 border-b border-warm-200/60 dark:border-slate-800/40 shrink-0">
          <p className="px-2 pb-2 text-[9.5px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">
            Knowledge Base
          </p>
          <nav className="space-y-0.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => onSelectCategory(cat.name)}
                  className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/25 dark:text-blue-400'
                      : 'text-slate-600 hover:bg-warm-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-300'
                  }`}
                >
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${isActive ? cat.bg : ''}`}>
                    <Icon className={`h-3.5 w-3.5 ${isActive ? cat.color : 'text-slate-400 dark:text-slate-500'}`} />
                  </span>
                  {cat.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Conversation History */}
        <div className="px-3 py-4 flex-1">
          <p className="px-2 pb-2.5 text-[9.5px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">
            Recent Chats
          </p>
          <div className="space-y-0.5">
            {conversations.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400 dark:text-slate-500">
                No conversations yet
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = activeConversationId === conv.id;
                return (
                  <div
                    key={conv.id}
                    className={`group relative flex items-center rounded-lg px-2.5 py-2 text-[13px] transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-100 text-slate-800 dark:bg-slate-800/70 dark:text-slate-200'
                        : 'text-slate-500 hover:bg-warm-100 dark:text-slate-400 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <button
                      onClick={() => onSelectConversation(conv.id)}
                      className="flex flex-1 items-center gap-2.5 text-left outline-none min-w-0"
                    >
                      <MessageSquare className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-600" />
                      <span className="truncate font-medium text-[12.5px]">
                        {conv.title || 'New Chat'}
                      </span>
                    </button>
                    <button
                      onClick={() => onDeleteConversation(conv.id)}
                      className="ml-1 shrink-0 opacity-0 p-0.5 rounded hover:text-red-500 group-hover:opacity-100 transition-all dark:hover:text-red-400"
                      title="Delete"
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
      <div className="border-t border-warm-200 dark:border-slate-800/60 px-5 py-3">
        <p className="text-[10px] text-slate-400 dark:text-slate-600 leading-relaxed">
          Answers sourced exclusively from official CUI admission data.
        </p>
      </div>
    </aside>
  );
}
