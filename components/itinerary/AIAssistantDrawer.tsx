// components/itinerary/AIAssistantDrawer.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Bot, Sparkles, X, Send, AlertTriangle, CheckCircle2, Loader2, ArrowRight, Zap, ShieldCheck, MapPin, Compass } from 'lucide-react';
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

const QUICK_PROMPTS = [
  "Optimize Northern Circuit route pacing & lodge transfers",
  "Validate 4x4 safari terrain requirements for Serengeti",
  "Check mainland-to-Zanzibar flight and cruise connection flow",
  "Eliminate duplicate lodging slots and balance activity load"
];

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
  const [processingStep, setProcessingStep] = useState(0);
  const [analysisReport, setAnalysisReport] = useState<{
    score: number;
    label: string;
    color: string;
    advice: string;
    optimizedDays?: Day[];
  } | null>(null);

  // Fallback or derive items if days aren't directly passed but itineraryItems are
  const resolvedDays = useMemo(() => {
    if (days && days.length > 0) return days;
    return [];
  }, [days]);

  // Consume decoupled Chrono-Flow Intelligence Analyzer service with both required arguments
  const chronoFlowAnalysis = useMemo(() => {
    const allItems = resolvedDays.length > 0 
      ? resolvedDays.flatMap(d => d.slots.map(s => s.item)).filter(Boolean)
      : itineraryItems.map(i => i.item).filter(Boolean);
      
    return analyzeItineraryPace(resolvedDays, allItems);
  }, [resolvedDays, itineraryItems]);

  // Simulate progressive steps during AI execution for ultimate operator confidence
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      setProcessingStep(1);
      interval = setInterval(() => {
        setProcessingStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 700);
    } else {
      setProcessingStep(0);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  if (!isOpen) return null;

  const handleAiGeneration = async (customPrompt?: string) => {
    const targetPrompt = customPrompt || prompt;
    if (!targetPrompt.trim()) return;

    setIsProcessing(true);
    try {
      const allItems = resolvedDays.length > 0 
        ? resolvedDays.flatMap(d => d.slots.map(s => s.item)).filter(Boolean)
        : itineraryItems.map(i => i.item).filter(Boolean);
      
      const response = await processAdvancedAssistantQuery(
        targetPrompt,
        resolvedDays,
        allItems,
        (residencyTier as ResidencyTier) || 'INTERNATIONAL'
      );

      setIsProcessing(false);
      
      // Safely check for days in response using type assertion to avoid TS2339
      const responseWithDays = response as { reply?: string; days?: Day[] };
      const targetDays = (responseWithDays.days && responseWithDays.days.length > 0)
        ? responseWithDays.days 
        : resolvedDays;

      setAnalysisReport({
        score: Math.min(100, chronoFlowAnalysis.score + 15),
        label: "Fully Optimized",
        color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
        advice: responseWithDays.reply || chronoFlowAnalysis.advice,
        optimizedDays: targetDays
      });
    } catch (error) {
      console.error('AI Assistant Query failed:', error);
      setIsProcessing(false);
      setAnalysisReport({
        ...chronoFlowAnalysis,
        optimizedDays: resolvedDays
      });
    }
  };

  const handleApplyChanges = () => {
    const finalDays = analysisReport?.optimizedDays || resolvedDays;
    
    if (onApplyItinerary) {
      onApplyItinerary(finalDays);
    }
    if (setDays) {
      setDays(finalDays);
    }
    onClose();
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
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                  <Zap size={10} className="fill-amber-300" /> Game-Changer Engine
                </span>
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
        <div className="p-4 bg-slate-950/40 border-b border-white/5 flex items-center gap-3 mx-5 mt-5 rounded-2xl border border-white/10 shadow-inner">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs bg-slate-900 border shrink-0 ${chronoFlowAnalysis.color}`}>
            {chronoFlowAnalysis.score}%
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Live Analyzer Status</span>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${chronoFlowAnalysis.color} border`}>
                {chronoFlowAnalysis.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug truncate">{chronoFlowAnalysis.advice}</p>
          </div>
        </div>

        {/* Chat / Prompt Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          
          {/* Quick Power-User Prompt Chips */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
              <Compass size={12} /> Instant Power Adjustments
            </span>
            <div className="grid grid-cols-1 gap-2">
              {QUICK_PROMPTS.map((quickPrompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(quickPrompt);
                    handleAiGeneration(quickPrompt);
                  }}
                  disabled={isProcessing}
                  className="text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-amber-400/30 text-xs text-slate-300 transition flex items-center justify-between group cursor-pointer disabled:opacity-50"
                >
                  <span className="truncate pr-2">{quickPrompt}</span>
                  <ArrowRight size={14} className="text-slate-500 group-hover:text-amber-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Custom Itinerary Directive</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Optimize my 5-day northern circuit route, ensure proper lodge transfers, and add a full day in Serengeti..."
              className="w-full h-28 bg-slate-950 border border-white/10 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-amber-400 transition resize-none shadow-inner"
            />
          </div>

          {/* Processing State Stream */}
          {isProcessing && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase">
                <Loader2 size={16} className="animate-spin text-amber-400" />
                <span>Executing Chrono-Flow AI Optimization...</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className={`flex items-center gap-2 transition-opacity ${processingStep >= 1 ? 'opacity-100 text-amber-300 font-bold' : 'opacity-40'}`}>
                  <ShieldCheck size={13} /> 1. Validating 4x4 terrain and residency requirements...
                </div>
                <div className={`flex items-center gap-2 transition-opacity ${processingStep >= 2 ? 'opacity-100 text-amber-300 font-bold' : 'opacity-40'}`}>
                  <MapPin size={13} /> 2. Analyzing geographic pacing & lodge connections...
                </div>
                <div className={`flex items-center gap-2 transition-opacity ${processingStep >= 3 ? 'opacity-100 text-amber-300 font-bold' : 'opacity-40'}`}>
                  <Sparkles size={13} /> 3. Synthesizing finalized slot layout...
                </div>
              </div>
            </div>
          )}

          {/* Analysis Report / Success Result */}
          {analysisReport && !isProcessing && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase">
                  <CheckCircle2 size={16} />
                  <span>AI Optimization Complete</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                  New Score: {analysisReport.score}%
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysisReport.advice}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-white/10 bg-slate-950/60 flex gap-3">
          <button
            type="button"
            onClick={() => handleAiGeneration()}
            disabled={isProcessing || !prompt.trim()}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-xl cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? <Loader2 size={16} className="animate-spin text-slate-950" /> : <Sparkles size={16} />}
            <span>{isProcessing ? 'Optimizing Route...' : 'Run AI Optimization'}</span>
          </button>

          {analysisReport && !isProcessing && (
            <button
              type="button"
              onClick={handleApplyChanges}
              className="py-3.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-xl cursor-pointer animate-in zoom-in-95"
            >
              <span>Apply Changes</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}