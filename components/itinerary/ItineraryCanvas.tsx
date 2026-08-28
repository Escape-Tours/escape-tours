'use client';

import { Trash2, Plus, Calendar, GripVertical } from 'lucide-react';
import { memo, useState } from 'react';
import { useItineraryStore, type ItineraryItem, type SlotType } from 'store/useItineraryStore';

const SlotDropZone = memo(({ 
  dayId, 
  slot, 
  items, 
  onDrop, 
  onRemove,
  onDragStartItem
}: { 
  dayId: number; 
  slot: SlotType; 
  items: ItineraryItem[]; 
  onDrop: (e: React.DragEvent, dayId: number, slot: SlotType) => void;
  onRemove: (id: string) => void;
  onDragStartItem: (e: React.DragEvent, item: ItineraryItem) => void;
}) => {
  const [isOver, setIsOver] = useState(false);

  return (
    <div 
      onDrop={(e) => { e.preventDefault(); setIsOver(false); onDrop(e, dayId, slot); }}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      className={`min-h-[140px] rounded-xl border-2 border-dashed p-3 transition-all duration-300 ${
        isOver 
          ? 'border-indigo-400 bg-indigo-50/50 scale-[1.02]' 
          : items.length > 0 
            ? 'border-indigo-100 bg-indigo-50/20' 
            : 'border-slate-200 bg-slate-50 hover:border-indigo-200'
      }`}
    >
      <p className="text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest">{slot}</p>
      
      <div className="space-y-2">
        {items.map((item) => (
          <div 
            key={item.id} 
            draggable
            onDragStart={(e) => onDragStartItem(e, item)}
            className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2 cursor-grab active:cursor-grabbing group/item animate-in fade-in zoom-in-95 duration-200 hover:border-indigo-300 transition-all"
          >
            <GripVertical size={12} className="text-slate-300" />
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-bold text-slate-800 truncate">{item.name}</p>
              <p className="text-[8px] text-indigo-500 uppercase font-semibold">{item.type}</p>
            </div>
            <button 
              onClick={() => onRemove(item.id)} 
              className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover/item:opacity-100"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        {items.length === 0 && !isOver && (
          <div className="h-20 flex flex-col items-center justify-center opacity-20 pointer-events-none transition-opacity">
            <Plus size={20} className="text-slate-400" />
            <span className="text-[9px] font-bold mt-1">EMPTY</span>
          </div>
        )}
      </div>
    </div>
  );
});

SlotDropZone.displayName = 'SlotDropZone';

export const ItineraryCanvas = () => {
  const { totalDays, addDay, removeDay, getSlotItems, addItem, removeItem, updateItemSlot } = useItineraryStore();
  const slots: SlotType[] = ['MORNING', 'AFTERNOON', 'EVENING'];

  const handleDrop = (e: React.DragEvent, dayId: number, slot: SlotType) => {
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    
    if (data.id) {
      updateItemSlot(data.id, dayId, slot);
    } else {
      addItem({
        originalId: data.originalId,
        name: data.name,
        type: data.type,
        basePrice: data.basePrice,
        image_url: data.image_url
      }, dayId, slot);
    }
  };

  const handleDragStartItem = (e: React.DragEvent, item: ItineraryItem) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-0 z-20">
        <h2 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
          <Calendar size={14} className="text-indigo-500" /> Itinerary Timeline
        </h2>
        <div className="flex gap-2">
          <button onClick={removeDay} className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            Remove Day
          </button>
          <button onClick={addDay} className="text-[10px] font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-1">
            <Plus size={12} /> Add Day
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: totalDays }).map((_, idx) => {
          const dayId = idx + 1;
          return (
            <div key={dayId} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-[10px] font-black text-indigo-500 mb-4 uppercase tracking-widest">Day {dayId}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {slots.map((slot) => (
                  <SlotDropZone 
                    key={slot}
                    dayId={dayId}
                    slot={slot}
                    items={getSlotItems(dayId, slot)}
                    onDrop={handleDrop}
                    onRemove={removeItem}
                    onDragStartItem={handleDragStartItem}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};