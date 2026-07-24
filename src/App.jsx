import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ChatContainer from './components/ChatContainer';
import GlobalSearch from './components/GlobalSearch';
import { askAI } from './utils/ai';

export default function App() {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Default keys baked in at build time (from .env)
  const DEFAULT_GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
  const DEFAULT_COHERE_KEY = import.meta.env.VITE_COHERE_API_KEY || '';
  const DEFAULT_OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';

  // AI Configuration State — locked to code-defined default keys from environment
  const [config] = useState(() => {
    // Choose the first available default key
    if (DEFAULT_GROQ_KEY) {
      return { 
        provider: 'groq', 
        model: 'llama-3.3-70b-versatile', 
        apiKey: DEFAULT_GROQ_KEY 
      };
    } else if (DEFAULT_COHERE_KEY) {
      return {
        provider: 'cohere',
        model: 'command-a-plus-05-2026',
        apiKey: DEFAULT_COHERE_KEY
      };
    } else if (DEFAULT_OPENROUTER_KEY) {
      return {
        provider: 'openrouter',
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        apiKey: DEFAULT_OPENROUTER_KEY
      };
    }

    return { 
      provider: 'groq', 
      model: 'llama-3.3-70b-versatile', 
      apiKey: '' 
    };
  });


  // Conversations & History
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('conversations');
    if (saved) return JSON.parse(saved);
    return [];
  });
  
  const [activeConversationId, setActiveConversationId] = useState(() => {
    const saved = localStorage.getItem('active_conversation_id');
    return saved || null;
  });

  // UI Panels / Modals
  const [activeCategory, setActiveCategory] = useState('All');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Sync Theme with DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Sync Conversations with LocalStorage
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem('active_conversation_id', activeConversationId);
    } else {
      localStorage.removeItem('active_conversation_id');
    }
  }, [activeConversationId]);

  // Command-K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize a default conversation if history is empty
  useEffect(() => {
    if (conversations.length === 0) {
      const initId = 'conv_' + Date.now();
      const newConv = {
        id: initId,
        title: 'New Conversation',
        messages: []
      };
      setConversations([newConv]);
      setActiveConversationId(initId);
    }
  }, [conversations]);

  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];
  const messages = activeConversation?.messages || [];

  // Toggle Theme helper
  const handleToggleTheme = () => setIsDarkMode(!isDarkMode);

  // Start a new conversation
  const handleNewConversation = () => {
    const newId = 'conv_' + Date.now();
    const newConv = {
      id: newId,
      title: 'New Conversation',
      messages: []
    };
    setConversations([newConv, ...conversations]);
    setActiveConversationId(newId);
    setActiveCategory('All');
    setIsMobileSidebarOpen(false);
  };

  // Delete a conversation
  const handleDeleteConversation = (id) => {
    const filtered = conversations.filter(c => c.id !== id);
    setConversations(filtered);
    if (activeConversationId === id) {
      if (filtered.length > 0) {
        setActiveConversationId(filtered[0].id);
      } else {
        setActiveConversationId(null);
      }
    }
  };

  // Select active conversation
  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
    setActiveCategory('All');
    setIsMobileSidebarOpen(false);
  };

  // Send message handler
  const handleSendMessage = async (text, overrideCategory = null) => {
    const categoryToUse = overrideCategory || activeCategory;
    
    // Switch to 'All' to view the chat conversation
    setActiveCategory('All');

    const userMessage = {
      id: 'msg_user_' + Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString()
    };

    // Update active conversation locally with user message
    let updatedConversations = conversations.map(c => {
      if (c.id === activeConversationId) {
        // If it was named "New Conversation", rename it to a snippet of the question
        const title = c.title === 'New Conversation' ? (text.length > 30 ? text.slice(0, 30) + '...' : text) : c.title;
        return {
          ...c,
          title: title,
          messages: [...c.messages, userMessage]
        };
      }
      return c;
    });

    setConversations(updatedConversations);
    setInputValue('');
    setIsLoading(true);

    // Call AI Integration
    const startTime = Date.now();
    const response = await askAI({
      provider: config.provider,
      apiKey: config.apiKey,
      model: config.model,
      query: text,
      category: categoryToUse,
      chatHistory: messages
    });
    const elapsedMs = Date.now() - startTime;
    // Calculate realistic thinking time between 4.8s and 6.5s for authentic AI feel
    const thinkingTime = Math.max(parseFloat((elapsedMs / 1000).toFixed(1)), parseFloat((4.8 + Math.random() * 1.6).toFixed(1)));

    const botMessage = {
      id: 'msg_bot_' + Date.now(),
      sender: 'bot',
      text: response, // Contains { answer, sources }
      thinkingTime: thinkingTime,
      timestamp: new Date().toLocaleTimeString()
    };

    // Update active conversation with bot response
    updatedConversations = updatedConversations.map(c => {
      if (c.id === activeConversationId) {
        return {
          ...c,
          messages: [...c.messages, botMessage]
        };
      }
      return c;
    });

    setConversations(updatedConversations);
    setIsLoading(false);
  };

  // Copy Answer Helper
  const handleCopyAnswer = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };


  return (
    <div className="flex h-dvh w-screen overflow-hidden bg-slate-100 text-slate-600 dark:bg-slate-950 dark:text-slate-400 font-sans">
      {/* Sidebar - Desktop Layout */}
      <div className="hidden md:block">
        <Sidebar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      </div>

      {/* Sidebar - Mobile Drawer with backdrop */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative z-50 h-full flex"
            >
              <Sidebar
                activeCategory={activeCategory}
                onSelectCategory={(cat) => {
                  setActiveCategory(cat);
                  setIsMobileSidebarOpen(false);
                }}
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={handleSelectConversation}
                onNewConversation={handleNewConversation}
                onDeleteConversation={handleDeleteConversation}
                onOpenSearch={() => {
                  setIsMobileSidebarOpen(false);
                  setIsSearchOpen(true);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Right Side Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar (Mobile Only) */}
        <Navbar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onNewConversation={handleNewConversation}
        />

        {/* Conversation Chat Window */}
        <ChatContainer
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          messages={messages}
          onSend={handleSendMessage}
          inputValue={inputValue}
          onInputChange={setInputValue}
          isLoading={isLoading}
          copiedId={copiedId}
          onCopyAnswer={handleCopyAnswer}
        />
      </div>

      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onAskQuestion={handleSendMessage}
      />
    </div>
  );
}
