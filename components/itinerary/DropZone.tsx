'use client';

import React, { useState } from 'react';
import { Calendar, Plus, Trash2, MapPin, Sun, Sunset, Moon, Sparkles, ArrowRight } from 'lucide-react';

interface DropZoneDay {
  id: string;
  dayNumber: number;
  location?: string;
  items: Array<{ id: string; name: string; type?: string }>;
}

interface DropZoneProps {
  day: DropZoneDay;
  onDrop: (dayId: string, itemId: string) => void;
  onRemoveItem?: (dayId: string, itemId: string) => void;
  onDeleteDay?: (dayId: string) => void;
}

export const DropZone = ({ day, onDrop, onRemoveItem, onDeleteDay }: DropZoneProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  return (
    <div 
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        const itemId = e.dataTransfer.getData('itemId') || e.dataTransfer.getData('application/json');
        if (itemId) {
          // If JSON was passed, handle object parse safety or raw string ID
          try {
            const parsed = JSON.parse(itemId);
            onDrop(day.id, parsed.originalId || parsed.id || itemId);
          } catch {
            onDrop(day.id, itemId);
          }
        }
      }}
      className={`group relative bg-[#0a1128]/95 backdrop-blur-2xl p-6 rounded-3xl border transition-all duration-300 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${
        isDraggingOver 
          ? 'border-amber-400 bg-slate-900/90 shadow-[0_0_30px_rgba(245,158,11,0.2)] scale-[1.01]' 
          : 'border-slate-800/80 hover:border-amber-500/40'
      }`}
    >
      {/* Ambient Glow Accent */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/10 transition-all duration-500" />

      {/* Header Info */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black tracking-wider uppercase shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-1.5">
            <Calendar size={13} className="stroke-[2.5]" />
            <span>DAY {day.dayNumber}</span>
          </div>
          {day.location && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-amber-400">
              <MapPin size={12} />
              <span className="text-[10px] font-black uppercase tracking-widest">{day.location}</span>
            </div>
          )}
        </div>

        {onDeleteDay && (
          <button 
            onClick={() => onDeleteDay(day.id)}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-900 hover:border-rose-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
            title="Delete Day"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Items Container / Drop Area */}
      <div className="space-y-3 relative z-10">
        {day.items.length === 0 ? (
          <div className="min-h-[120px] border-2 border-dashed border-slate-800/80 rounded-2xl bg-slate-950/40 flex flex-col items-center justify-center p-6 text-center group-hover:border-amber-500/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-2 text-slate-500 group-hover:text-amber-400 group-hover:border-amber-500/30 transition-all shadow-inner">
              <Plus size={16} className="stroke-[3]" />
            </div>
            <p className="text-xs font-bold text-slate-300">Drop inventory items here</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Drag lodges, activities, or transfers into this day</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {day.items.map((item, index) => (
              <div 
                key={item.id || index} 
                className="group/item relative bg-slate-950/90 p-3.5 rounded-2xl shadow-inner border border-slate-800/80 flex items-center justify-between transition-all duration-300 hover:border-amber-500/40"
              >
                <div className="flex items-center gap-3 overflow-hidden pr-6">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <Sparkles size={14} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-100 text-xs truncate tracking-tight">{item.name}</h4>
                    {item.type && (
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-400/80 block mt-0.5">
                        {item.type}
                      </span>
                    )}
                  </div>
                </div>

                {onRemoveItem && (
                  <button 
                    onClick={() => onRemoveItem(day.id, item.id)}
                    className="absolute right-3 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors opacity-80 group-hover/item:opacity-100"
                    title="Remove item"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropZone;