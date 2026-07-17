import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Shield, Check, AlertTriangle, Cpu } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, config, onSaveConfig }) {
  const [provider, setProvider] = useState(config.provider || 'gemini');
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [model, setModel] = useState(config.model || 'gemini-2.0-flash');
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setProvider(config.provider || 'gemini');
    setApiKey(config.apiKey || '');
    setModel(config.model || 'gemini-2.0-flash');
  }, [config, isOpen]);

  // Handle provider changes to set sensible default models
  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    if (newProvider === 'gemini') {
      setModel('gemini-2.0-flash');
    } else {
      setModel('gpt-4o-mini');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveConfig({ provider, apiKey, model });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">AI Configuration</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Configure your local API credentials</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* API Provider Toggle */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                AI Service Provider
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleProviderChange('gemini')}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all ${
                    provider === 'gemini'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-600 dark:border-blue-500 dark:bg-blue-950/20 dark:text-blue-400'
                      : 'border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="font-bold">Google</span> Gemini
                </button>
                <button
                  type="button"
                  onClick={() => handleProviderChange('openai')}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all ${
                    provider === 'openai'
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-600 dark:border-emerald-500 dark:bg-emerald-950/20 dark:text-emerald-400'
                      : 'border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="font-bold">OpenAI</span> GPT
                </button>
              </div>
            </div>

            {/* Model Selector */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Cpu className="h-4 w-4 text-slate-400" />
                Model Selection
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-blue-400 dark:focus:bg-slate-900"
              >
                {provider === 'gemini' ? (
                  <>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash ⚡ (Free — Recommended)</option>
                    <option value="gemini-2.0-flash-lite">Gemini 2.0 Flash Lite (Fastest)</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Legacy)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Legacy Pro)</option>
                  </>
                ) : (
                  <>
                    <option value="gpt-4o-mini">GPT-4o Mini (Cost-Effective & Smart)</option>
                    <option value="gpt-4o">GPT-4o (High-End Reasoning)</option>
                  </>
                )}
              </select>
            </div>

            {/* API Key Input */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  API Key
                </label>
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  {showKey ? 'Hide key' : 'Show key'}
                </button>
              </div>
              <input
                type={showKey ? 'text' : 'password'}
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={provider === 'gemini' ? 'AIzaSy...' : 'sk-proj-...'}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-blue-400 dark:focus:bg-slate-900"
              />
            </div>

            {/* Privacy Warning */}
            <div className="flex items-start gap-2.5 rounded-xl bg-amber-50/50 p-3 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                <strong>Privacy Info:</strong> Keys are stored only in your browser's local storage and used directly for API requests. No keys are sent to any server.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaved}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-green-600 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-green-600"
              >
                {isSaved ? (
                  <>
                    <Check className="h-4 w-4" />
                    Saved Successfully!
                  </>
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
