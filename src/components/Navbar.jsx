import React from 'react';
import { Sun, Moon, Settings, Menu, AlertCircle, Zap } from 'lucide-react';

export default function Navbar({ 
  isDarkMode, 
  onToggleTheme, 
  onOpenSettings, 
  isConfigured, 
  config,
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
        
        {/* API Status badge */}
        {isConfigured ? (
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">{config.provider === 'gemini' ? 'Gemini' : 'OpenAI'}</span>
            <span className="sm:hidden">Live</span>
          </div>
        ) : (
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors"
          >
            <AlertCircle className="h-3 w-3" />
            Set API Key
          </button>
        )}

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="rounded-lg border border-warm-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-2 text-slate-500 dark:text-slate-400 transition-all hover:bg-warm-100 dark:hover:bg-slate-800"
          title={isDarkMode ? 'Light mode' : 'Dark mode'}
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="rounded-lg border border-warm-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-2 text-slate-500 dark:text-slate-400 transition-all hover:bg-warm-100 dark:hover:bg-slate-800 animate-spin-hover"
          title="AI Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
