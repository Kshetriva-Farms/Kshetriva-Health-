'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../application/context/AuthContext';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { SidebarNav } from '../../components/dashboard/SidebarNav';
import { BottomNav } from '../../components/dashboard/BottomNav';
import { QuickAddModal } from '../../components/dashboard/QuickAddModal';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { MarkdownRenderer } from '../../components/ai/MarkdownRenderer';
import { geminiService } from '../../infrastructure/services/geminiService';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  Zap,
  Award,
  Copy,
  Check,
  Save,
  Download,
  Trash2,
  History,
  MessageSquare,
  X,
} from 'lucide-react';
import { AIAdviceResponse } from '../../domain/entities/AIAdvisor';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  advice?: AIAdviceResponse;
  timestamp: string;
}

interface SavedConversation {
  id: string;
  title: string;
  date: string;
  messages: ChatMessage[];
}

const LOCAL_STORAGE_KEY = 'kshetriva_ai_chat_history';
const SAVED_CONVERSATIONS_KEY = 'kshetriva_saved_ai_conversations';

export default function AIAdvisorPage() {
  const { user } = useAuth();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [savedConversations, setSavedConversations] = useState<SavedConversation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialWelcomeMessage: ChatMessage = {
    id: 'm-welcome',
    sender: 'ai',
    text: `### 👋 Welcome to your AI Nutrition Assistant!
I'm Dr. Health+, powered by **Gemini 2.5 AI Engine**. How can I help you reach your nutrition goals today?

**Try asking me:**
- How many calories should I eat?
- Suggest dinner.
- Healthy breakfast.
- High protein meals.
- Weight loss tips.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        } else {
          setMessages([initialWelcomeMessage]);
        }
      } else {
        setMessages([initialWelcomeMessage]);
      }

      const storedSaved = localStorage.getItem(SAVED_CONVERSATIONS_KEY);
      if (storedSaved) {
        const parsedSaved = JSON.parse(storedSaved);
        if (Array.isArray(parsedSaved)) {
          setSavedConversations(parsedSaved);
        }
      }
    } catch (e) {
      setMessages([initialWelcomeMessage]);
    }
  }, []);

  // Save chat history to localStorage when messages update
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
      } catch (e) {
        console.error('Failed to store chat history:', e);
      }
    }
  }, [messages]);

  // Auto-scroll chat feed
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    try {
      const response = await geminiService.generateAdvice({
        userQuery: queryText,
        vitalsSummary: {
          age: user?.age || 28,
          weightKg: user?.weightKg || 68.5,
          targetWeightKg: user?.targetWeightKg || 65,
          primaryGoal: user?.primaryGoal || 'Weight Loss',
          activityLevel: user?.activityLevel || 'Moderately Active',
          dailyCaloriesGoal: user?.dailyCaloriesGoal || 2000,
          waterGoalMl: user?.waterGoalMl || 3000,
        },
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.content || response.summary || 'Here is your personalized health guidance.',
        advice: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: '### 🌿 Nutrition Guidance Summary\nFor optimal vitality, maintain a balanced daily target of **2000 kcal** with 30% Protein, 45% Carbs, and 25% Healthy Fats. Hydrate with at least 3L of water daily.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveConversation = () => {
    if (messages.length <= 1) return;

    const firstUserMsg = messages.find((m) => m.sender === 'user')?.text || 'Nutrition Session';
    const title = firstUserMsg.length > 35 ? `${firstUserMsg.substring(0, 35)}...` : firstUserMsg;

    const newSaved: SavedConversation = {
      id: `saved-${Date.now()}`,
      title,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      messages: [...messages],
    };

    const updated = [newSaved, ...savedConversations];
    setSavedConversations(updated);
    localStorage.setItem(SAVED_CONVERSATIONS_KEY, JSON.stringify(updated));
    alert('Conversation saved to history!');
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear current chat history?')) {
      setMessages([initialWelcomeMessage]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const handleExportMarkdown = () => {
    if (messages.length === 0) return;

    const mdContent = messages
      .map((m) => `**[${m.timestamp}] ${m.sender === 'user' ? 'You' : 'AI Nutrition Advisor'}:**\n${m.text}\n`)
      .join('\n---\n\n');

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kshetriva-ai-chat-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadSavedConversation = (conv: SavedConversation) => {
    setMessages(conv.messages);
    setShowSavedModal(false);
  };

  const deleteSavedConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedConversations.filter((c) => c.id !== id);
    setSavedConversations(updated);
    localStorage.setItem(SAVED_CONVERSATIONS_KEY, JSON.stringify(updated));
  };

  const presetQuestions = [
    'How many calories should I eat?',
    'Suggest dinner.',
    'Healthy breakfast.',
    'High protein meals.',
    'Weight loss tips.',
  ];

  return (
    <ProtectedRoute fallbackMessage="Subscribers get unlimited 24/7 AI Health & Nutrition Coaching powered by Gemini.">
      <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
        {/* Sidebar Nav (Desktop) */}
        <SidebarNav />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-8 pt-6 pb-24 max-w-5xl mx-auto flex flex-col h-screen overflow-hidden">
          {/* Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-4 sm:p-5 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-xl shrink-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 border border-emerald-400/30 shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge variant="emerald">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> Gemini 2.5 API
                  </Badge>
                  <Badge variant="teal">AI Nutritionist</Badge>
                </div>
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-100 tracking-tight">
                  AI Health & Nutrition Assistant
                </h1>
              </div>
            </div>

            {/* Header Action Tools */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowSavedModal(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
                title="View Saved Conversations"
              >
                <History className="w-3.5 h-3.5 text-emerald-400" />
                <span>Saved ({savedConversations.length})</span>
              </button>

              <button
                onClick={handleSaveConversation}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
                title="Save Current Conversation"
              >
                <Save className="w-3.5 h-3.5 text-teal-400" />
                <span>Save</span>
              </button>

              <button
                onClick={handleExportMarkdown}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
                title="Export Chat as Markdown"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={handleClearHistory}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/30 text-slate-400 hover:text-red-300 transition-all"
                title="Clear Chat History"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Quick Preset Prompts Bar */}
          <div className="my-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none shrink-0">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 shrink-0">
              <Zap className="w-3 h-3" /> Quick Questions:
            </span>
            {presetQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(question)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 text-xs font-medium text-slate-300 hover:text-emerald-300 transition-all whitespace-nowrap shadow-sm active:scale-95"
              >
                {question}
              </button>
            ))}
          </div>

          {/* Chat Messages Feed Container */}
          <div className="flex-1 bg-slate-900/50 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-4 sm:p-6 overflow-y-auto space-y-4 shadow-inner min-h-0">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shrink-0 mt-1 shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`relative group max-w-[90%] sm:max-w-[80%] p-4 rounded-2xl space-y-2 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-md font-medium'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-xl'
                  }`}
                >
                  {/* Markdown formatted content */}
                  {msg.sender === 'ai' ? (
                    <MarkdownRenderer content={msg.text} />
                  ) : (
                    <p className="whitespace-pre-line">{msg.text}</p>
                  )}

                  {/* AI Advice Action Recommendations */}
                  {msg.advice && msg.advice.recommendations && msg.advice.recommendations.length > 0 && (
                    <div className="pt-2.5 mt-2 border-t border-slate-800/90 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <Award className="w-3 h-3" /> Recommended Action Steps
                      </span>
                      <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                        {msg.advice.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Message Timestamp & Copy Button */}
                  <div className="flex items-center justify-between pt-1 text-[9px] opacity-70">
                    {msg.sender === 'ai' && (
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="hover:opacity-100 text-emerald-400 flex items-center gap-1 font-mono transition-opacity"
                        title="Copy response to clipboard"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-300" />
                            <span className="text-emerald-300">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}

                    <span className="font-mono ml-auto">{msg.timestamp}</span>
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700 shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-start items-center"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none text-xs text-slate-400 flex items-center gap-3 shadow-lg">
                  <span className="font-medium text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" /> Gemini AI is analyzing nutrition...
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery(inputQuery);
            }}
            className="mt-3 flex items-center gap-2 sm:gap-3 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl shadow-2xl shrink-0"
          >
            <input
              type="text"
              placeholder="Ask AI Nutritionist (e.g. 'How many calories should I eat?')"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-transparent text-slate-100 text-xs sm:text-sm focus:outline-none placeholder:text-slate-500"
            />
            <Button
              variant="primary"
              type="submit"
              disabled={!inputQuery.trim() || isThinking}
              className="py-2.5 px-4 rounded-xl text-xs shadow-emerald-900/40"
            >
              <Send className="w-4 h-4 mr-1 inline" /> Send
            </Button>
          </form>
        </main>

        {/* Saved Conversations Modal */}
        <AnimatePresence>
          {showSavedModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base font-bold text-slate-100">Saved Conversations</h3>
                  </div>
                  <button
                    onClick={() => setShowSavedModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {savedConversations.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">No saved conversations yet.</p>
                    <p className="text-[11px] text-slate-500">Click 'Save' in the header to store your active session.</p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
                    {savedConversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => loadSavedConversation(conv)}
                        className="p-3.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/40 rounded-2xl cursor-pointer flex items-center justify-between group transition-all"
                      >
                        <div className="space-y-1 max-w-[80%]">
                          <h4 className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 truncate">
                            {conv.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono block">{conv.date} • {conv.messages.length} messages</span>
                        </div>

                        <button
                          onClick={(e) => deleteSavedConversation(conv.id, e)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete saved conversation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 text-right">
                  <Button variant="outline" onClick={() => setShowSavedModal(false)} className="text-xs py-1.5 px-4">
                    Close
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation (Mobile) */}
        <BottomNav onQuickAddOpen={() => setIsQuickAddOpen(true)} />

        {/* Quick Add Logging Modal */}
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          onAddWater={() => {}}
          onAddMeal={() => {}}
          onAddWeight={() => {}}
          onAddExercise={() => {}}
        />
      </div>
    </ProtectedRoute>
  );
}
