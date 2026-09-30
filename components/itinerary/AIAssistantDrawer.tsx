// components/itinerary/AIAssistantDrawer.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Bot, Sparkles, X, Send, AlertTriangle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { Day, ItineraryItem, Slot } from '@/lib/types/itinerary-types';
import { ResidencyTier } from '@/lib/constants/index';
import { processAdvancedAssistantQuery } from '@/lib/services/aiAssistantService';
import { analyzeItineraryPace } from '@/lib/services/itineraryAnalyzer';

export interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  days?: Day[];
  itineraryItems?: (Slot & { item: ItineraryItem; dayNumber: number })[];
  residencyTier?: ResidencyTier | string;
  onApplyItinerary?: (newDays: Day[]) => void;
  onAddItem?: (item: ItineraryItem) => void;
  setDays?: React.Dispatch<React.SetStateAction<Day[]>>;
}

export default function AIAssistantDrawer({
  isOpen,
  onClose,
  days = [],
  itineraryItems = [],
  residencyTier = 'INTERNATIONAL',
  onApplyItinerary,
  onAddItem,
  setDays,
}: AIAssistantDrawerProps) {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<{
    score: number;
    label: string;
    color: string;
    advice: string;
  } | null>(null);

  // Fallback or derive items if days aren't directly passed but itineraryItems are
  const resolvedDays = useMemo(() => {
    if (days && days.length > 0) return days;
    // If you need to construct days from itineraryItems or handle them gracefully:
    return [];
  }, [days]);

  // Consume decoupled Chrono-Flow Intelligence Analyzer service with both required arguments
  const chronoFlowAnalysis = useMemo(() => {
    const allItems = resolvedDays.length > 0 
      ? resolvedDays.flatMap(d => d.slots.map(s => s.item)).filter(Boolean)
      : itineraryItems.map(i => i.item).filter(Boolean);
      
    return analyzeItineraryPace(resolvedDays, allItems);
  }, [resolvedDays, itineraryItems]);

  if (!isOpen) return null;

  const handleAiGeneration = async () => {
    setIsProcessing(true);
    try {
      const allItems = resolvedDays.length > 0 
        ? resolvedDays.flatMap(d => d.slots.map(s => s.item)).filter(Boolean)
        : itineraryItems.map(i => i.item).filter(Boolean);
      
      // Pass the parameters matching your decoupled service signature
      const response = await processAdvancedAssistantQuery(
        prompt,
        resolvedDays,
        allItems,
        (residencyTier as ResidencyTier) || 'INTERNATIONAL'
      );

      setIsProcessing(false);
      setAnalysisReport({
        score: chronoFlowAnalysis.score,
        label: chronoFlowAnalysis.label,
        color: chronoFlowAnalysis.color,
        advice: response.reply || chronoFlowAnalysis.advice
      });
    } catch (error) {
      console.error('AI Assistant Query failed:', error);
      setIsProcessing(false);
      setAnalysisReport(chronoFlowAnalysis);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-end pointer-events-auto animate-in fade-in duration-300">
      <div className="bg-slate-900 border-l border-white/10 w-full max-w-lg h-full flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg">
              <Bot size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-tight">AI Chrono-Flow Assistant</h3>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">Expert Engine</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">Smart Itinerary Optimization & Validation</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Real-time Chrono-Flow Status Widget */}
        <div className="p-4 bg-slate-950/40 border-b border-white/5 flex items-center gap-3 mx-5 mt-5 rounded-2xl border border-white/10">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs bg-slate-900 border border-white/10 shrink-0 ${chronoFlowAnalysis.color}`}>
            {chronoFlowAnalysis.score}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Live Analyzer Status</span>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${chronoFlowAnalysis.color} bg-white/5 border border-white/10`}>
                {chronoFlowAnalysis.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{chronoFlowAnalysis.advice}</p>
          </div>
        </div>

        {/* Chat / Prompt Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
            <span className="font-black text-amber-400 uppercase tracking-wider block text-[10px]">Capabilities Active:</span>
            <ul className="space-y-1 text-slate-400 list-disc list-inside">
              <li>Automatic detection of duplicate lodging slots.</li>
              <li>Cross-regional transit validation (Mainland parks vs. Zanzibar).</li>
              <li>Mandatory 4x4 transport verification for rough terrain.</li>
              <li>Pacing score calculation & itinerary auto-structuring.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Describe Your Desired Itinerary Adjustment</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Optimize my 5-day northern circuit route, ensure proper lodge transfers, and add a full day in Serengeti..."
              className="w-full h-36 bg-slate-950 border border-white/10 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-amber-400 transition resize-none shadow-inner"
            />
          </div>

          {analysisReport && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase">
                <CheckCircle2 size={16} />
                <span>AI Optimization Complete</span>
              </div>
              <p className="text-xs text-slate-300">
                {analysisReport.advice}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-white/10 bg-slate-950/60 flex gap-3">
          <button
            type="button"
            onClick={handleAiGeneration}
            disabled={isProcessing || !prompt.trim()}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-xl cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? <Loader2 size={16} className="animate-spin text-slate-950" /> : <Sparkles size={16} />}
            <span>{isProcessing ? 'Analyzing Chrono-Flow...' : 'Run AI Optimization'}</span>
          </button>

          {analysisReport && (
            <button
              type="button"
              onClick={() => {
                if (onApplyItinerary) onApplyItinerary(resolvedDays);
                if (setDays) setDays(resolvedDays);
                onClose();
              }}
              className="py-3.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-xl cursor-pointer"
            >
              <span>Apply</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}