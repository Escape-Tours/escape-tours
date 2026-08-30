'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, Compass, Zap, RefreshCw, Layers } from 'lucide-react';
import { useItineraryStore } from '@/store/useItineraryStore';
import { Day } from '@/lib/types/itinerary-types';
import { ResidencyTier } from '@/lib/constants/index';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  days: Day[];
  residencyTier: ResidencyTier;
  onApplyItinerary: (days: Day[]) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "Build a 3-day Mikumi Wildlife Safari",
  "Design a 4-day Zanzibar Beach & Stone Town escape",
  "Plan a 2-day Selous Game Reserve adventure",
  "Optimize current route & add scenic stops"
];

export default function AIAssistantDrawer({ isOpen, onClose, days, residencyTier, onApplyItinerary }: AIAssistantDrawerProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'ai', 
      text: 'Jambo! I am your Safari Studio AI architect, synced directly with your live Supabase inventory and pricing tiers. Tell me your vision or select an intelligent quick prompt below.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const storeTier = useItineraryStore((state) => state.tier);
  const effectiveTier = residencyTier || storeTier;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const executeSend = async (queryText: string) => {
    if (!queryText.trim() || loading) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: queryText, timestamp: currentTime }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: queryText, tier: effectiveTier, currentDays: days })
      });
      const data = await res.json();

      const responseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (data.success && data.days) {
        onApplyItinerary(data.days);
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          sender: 'ai', 
          text: data.message || "✨ Successfully synthesized your custom route using verified items from your live inventory catalog!",
          timestamp: responseTime
        }]);
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (err) {
      const responseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: "Apologies, I encountered an issue syncing with your live database catalog. Please verify your connection and try your request again.",
        timestamp: responseTime
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMsgText = input;
    setInput('');
    await executeSend(userMsgText);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#050814]/98 backdrop-blur-3xl border-l border-slate-800/80 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] flex flex-col text-slate-100 animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 animate-ping" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Supabase Sync ({effectiveTier.toUpperCase()})
              </span>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-100 mt-1 flex items-center gap-1.5">
              Safari Studio AI Architect
            </h3>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all cursor-pointer shadow-inner"
          aria-label="Close Drawer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-5 py-3.5 bg-slate-900/30 border-b border-slate-800/60 flex gap-2 overflow-x-auto custom-scrollbar">
        {QUICK_PROMPTS.map((promptText, idx) => (
          <button
            key={idx}
            onClick={() => executeSend(promptText)}
            disabled={loading}
            className="whitespace-nowrap px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/60 hover:border-amber-400/50 text-[11px] font-bold text-amber-300 hover:bg-amber-400/10 transition-all flex items-center gap-2 cursor-pointer shadow-sm group"
          >
            <Zap size={12} className="text-amber-400 group-hover:scale-110 transition-transform" />
            <span>{promptText}</span>
          </button>
        ))}
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/60">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${msg.sender === 'user' ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-slate-900 text-amber-400 border-slate-800 shadow-md'}`}>
              {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={`flex flex-col gap-1.5 max-w-[82%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-4 rounded-2xl text-xs leading-relaxed shadow-lg ${msg.sender === 'user' ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold rounded-tr-none' : 'bg-slate-900/90 border border-slate-800/80 text-slate-200 rounded-tl-none backdrop-blur-md'}`}>
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-500 px-1 font-mono">{msg.timestamp}</span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-3.5 animate-in fade-in duration-200">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 border border-slate-800 flex items-center justify-center shadow-lg">
              <Bot size={14} className="animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-amber-300/90 text-xs shadow-xl backdrop-blur-md flex items-center gap-3">
              <Compass size={16} className="animate-spin text-amber-400" />
              <div className="flex flex-col gap-0.5">
                <span className="font-bold tracking-wide">Synthesizing Route...</span>
                <span className="text-[10px] text-slate-400">Querying live Supabase inventory & pricing tables</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-4.5 border-t border-slate-800/80 bg-slate-950/90 flex items-center gap-2.5 shadow-2xl">
        <div className="relative flex-1">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to design or modify your safari itinerary..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all shadow-inner pr-10"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <Layers size={14} />
          </div>
        </div>
        <button 
          type="submit"
          disabled={loading || !input.trim()}
          className="p-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 disabled:opacity-40 disabled:hover:from-amber-400 disabled:hover:to-amber-500 transition-all font-black shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer flex items-center justify-center shrink-0 hover:scale-105 active:scale-95"
          aria-label="Send Message"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}