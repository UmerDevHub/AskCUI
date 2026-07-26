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
  GraduationCap
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
  onOpenSearch
}) {
  return (
    <aside className="flex h-full w-72 flex-col border-r border-[#E7E2D8] dark:border-[#1A2A40] bg-white dark:bg-[#0B1524]">
      
      {/* Institutional Brand Header */}
      <div className="px-5 pt-5 pb-4 border-b border-[#E7E2D8] dark:border-[#1A2A40] bg-[#FFFFFF] dark:bg-[#0B1524]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0B2545] font-serif font-bold text-[#C9A227] text-base border border-[#C9A227]/40 shadow-xs">
            <GraduationCap className="h-5 w-5 text-[#C9A227]" />
          </div>
          <div className="min-w-0">
            <h2 className="font-serif text-[13.5px] font-bold text-[#0B2545] dark:text-[#E2EBFA] leading-tight truncate">
              COMSATS University
            </h2>
            <p className="text-[11px] text-[#7A1E2B] dark:text-[#C9A227] font-semibold mt-0.5 tracking-wide truncate">
              Wah Campus Admissions
            </p>
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="px-4 py-3.5 space-y-2">
        <button
          onClick={onNewConversation}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B2545] py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-[#7A1E2B] active:scale-[0.99] cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>New Inquiry</span>
        </button>

        <button
          onClick={onOpenSearch}
          className="flex w-full items-center justify-between rounded-lg border border-[#E7E2D8] dark:border-[#1A2A40] bg-[#F4F5F7] dark:bg-[#0E1B2D] px-3.5 py-2.5 text-left text-[12.5px] text-[#2B2B2B] dark:text-[#A0B0C5] transition-all hover:border-[#0B2545]/40 dark:hover:border-[#6C8EBF]/40 cursor-pointer"
        >
          <span className="flex items-center gap-2 truncate">
            <Search className="h-3.5 w-3.5 text-[#0B2545] dark:text-[#809BCE] shrink-0" />
            <span>Search admissions info...</span>
          </span>
          <kbd className="hidden rounded bg-[#E7E2D8] dark:bg-[#1A2A40] px-1.5 py-0.5 text-[9px] font-mono text-[#0B2545] dark:text-[#C0D0E5] sm:inline-block">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Categories + Conversations - scrollable navigation panel */}
      <div className="flex-1 overflow-y-auto flex flex-col min-h-0">

        {/* Knowledge Base Categories */}
        <div className="px-3 pt-1 pb-3 border-b border-[#E7E2D8]/70 dark:border-[#1A2A40]/70 shrink-0">
          <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#7A1E2B] dark:text-[#C9A227]">
            Information Resources
          </p>
          <nav className="space-y-0.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => onSelectCategory(cat.name)}
                  className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[12.5px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0B2545] text-white font-semibold shadow-xs'
                      : 'text-[#2B2B2B] hover:bg-[#F4F5F7] hover:text-[#0B2545] dark:text-[#C0D0E5] dark:hover:bg-[#112035] dark:hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#C9A227]' : 'text-[#0B2545] dark:text-[#809BCE]'}`} />
                  <span className="truncate">{cat.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Saved Inquiries / History */}
        <div className="px-3 py-3.5 flex-1">
          <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#0B2545] dark:text-[#A0B0C5]">
            Recent Inquiries
          </p>
          <div className="space-y-0.5">
            {conversations.length === 0 ? (
              <div className="py-4 text-center text-xs text-[#666666] dark:text-[#708095]">
                No recent inquiries
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = activeConversationId === conv.id;
                return (
                  <div
                    key={conv.id}
                    className={`group relative flex items-center rounded-md px-2.5 py-2 text-[12.5px] transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#F4F5F7] text-[#0B2545] dark:bg-[#112035] dark:text-white font-semibold border-l-2 border-[#7A1E2B]'
                        : 'text-[#2B2B2B] hover:bg-[#F4F5F7] dark:text-[#A0B0C5] dark:hover:bg-[#112035]'
                    }`}
                  >
                    <button
                      onClick={() => onSelectConversation(conv.id)}
                      className="flex flex-1 items-center gap-2.5 text-left outline-none min-w-0"
                    >
                      <MessageSquare className="h-3.5 w-3.5 shrink-0 text-[#0B2545] dark:text-[#809BCE]" />
                      <span className="truncate font-medium text-[12px]">
                        {conv.title || 'New Inquiry'}
                      </span>
                    </button>
                    <button
                      onClick={() => onDeleteConversation(conv.id)}
                      className="ml-1 shrink-0 opacity-0 p-0.5 rounded hover:text-[#7A1E2B] group-hover:opacity-100 transition-all cursor-pointer"
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

      {/* Institutional Footer */}
      <div className="border-t border-[#E7E2D8] dark:border-[#1A2A40] px-4 py-3 bg-[#F4F5F7] dark:bg-[#070D18]">
        <p className="text-[10px] text-[#0B2545] dark:text-[#A0B0C5] font-semibold tracking-wide truncate">
          COMSATS University Islamabad
        </p>
        <p className="text-[9.5px] text-[#7A1E2B] dark:text-[#C9A227] font-medium mt-0.5 truncate">
          Wah Campus Admissions Office
        </p>
      </div>
    </aside>
  );
}
