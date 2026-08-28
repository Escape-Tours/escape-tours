'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, Compass, Zap } from 'lucide-react';
import { useItineraryStore } from '@/store/useItineraryStore';
import { Day } from '@/lib/types/itinerary-types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyItinerary: (days: Day[]) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

const QUICK_PROMPTS = [
  "Build a 3-day Mikumi Wildlife Safari",
  "Design a 4-day Zanzibar Beach & Stone Town escape",
  "Plan a 2-day Selous Game Reserve adventure"
];

export default function AIAssistantDrawer({ isOpen, onClose, onApplyItinerary }: AIAssistantDrawerProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'ai', 
      text: 'Jambo! I am your Safari Studio AI architect. I query your live Supabase inventory to build real, bookable itineraries. Tell me what you are looking for or select a quick prompt below!' 
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const tier = useItineraryStore((state) => state.tier);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const executeSend = async (queryText: string) => {
    if (!queryText.trim() || loading) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: queryText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: queryText, tier })
      });
      const data = await res.json();

      if (data.success && data.days) {
        onApplyItinerary(data.days);
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          sender: 'ai', 
          text: data.message || "✨ Successfully synthesized your itinerary using verified items from your live inventory catalog!" 
        }]);
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: "Apologies, I encountered an issue syncing with your database catalog. Please try your request again." 
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
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#070b19]/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl flex flex-col text-slate-100 animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <Sparkles size={18} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-md">
                Live Inventory Sync Active
              </span>
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-100 mt-1">Safari Studio AI</h3>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-5 py-3 bg-slate-900/40 border-b border-slate-800/60 flex gap-2 overflow-x-auto custom-scrollbar">
        {QUICK_PROMPTS.map((promptText, idx) => (
          <button
            key={idx}
            onClick={() => executeSend(promptText)}
            disabled={loading}
            className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/60 hover:border-amber-400/50 text-[10px] font-bold text-amber-300 hover:bg-amber-400/10 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Zap size={11} />
            <span>{promptText}</span>
          </button>
        ))}
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${msg.sender === 'user' ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'bg-slate-900 text-amber-400 border-slate-800'}`}>
              {msg.sender === 'user' ? <User size={13} /> : <Bot size={13} />}
            </div>
            <div className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[82%] ${msg.sender === 'user' ? 'bg-amber-400 text-slate-950 font-semibold shadow-md' : 'bg-slate-900/90 border border-slate-800/80 text-slate-200 shadow-lg'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-slate-900 text-amber-400 border border-slate-800 flex items-center justify-center">
              <Bot size={13} className="animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-amber-300/90 text-xs animate-pulse flex items-center gap-2">
              <Compass size={14} className="animate-spin" />
              <span>Querying verified catalog & building route...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-800/80 bg-slate-950/80 flex items-center gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI to design a custom route..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors shadow-inner"
        />
        <button 
          type="submit"
          disabled={loading || !input.trim()}
          className="p-3 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 disabled:opacity-50 transition-all font-black shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}