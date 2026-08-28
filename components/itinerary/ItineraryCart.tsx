// components/itinerary/ItineraryCart.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, ArrowRight, X, Sparkles } from 'lucide-react';

interface CartItem {
  id: string | number;
  title?: string;
  name?: string;
  price?: number;
  category?: string;
  image?: string;
  type?: string;
  [key: string]: any;
}

interface ItineraryCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ItineraryCart({ isOpen, onClose }: ItineraryCartProps) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart items from localStorage on mount and listen for storage or custom events
  useEffect(() => {
    const loadCart = () => {
      try {
        // Check standard keys used across your platform pages
        const stored = localStorage.getItem('escape_itinerary_cart') || 
                       localStorage.getItem('itinerary_cart_items') || 
                       localStorage.getItem('cart');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
          }
        }
      } catch (err) {
        console.error('Error loading itinerary cart:', err);
      }
    };

    loadCart();

    // Listen to window custom events dispatched from "Add to Itinerary" buttons across pages
    window.addEventListener('storage', loadCart);
    window.addEventListener('cartUpdated', loadCart as EventListener);

    return () => {
      window.removeEventListener('storage', loadCart);
      window.removeEventListener('cartUpdated', loadCart as EventListener);
    };
  }, [isOpen]);

  const removeItem = (id: string | number) => {
    const updated = cartItems.filter(item => (item.id || item.title) !== id);
    setCartItems(updated);
    
    // Update all potential storage keys to keep them in sync
    localStorage.setItem('escape_itinerary_cart', JSON.stringify(updated));
    localStorage.setItem('itinerary_cart_items', JSON.stringify(updated));
    
    // Dispatch event so other components know cart changed
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearAll = () => {
    setCartItems([]);
    localStorage.removeItem('escape_itinerary_cart');
    localStorage.removeItem('itinerary_cart_items');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleBuildFromCart = () => {
    // Pass cart items or save them for the builder to consume
    localStorage.setItem('builder_imported_items', JSON.stringify(cartItems));
    onClose();
    router.push('/itinerary-builder?imported=true');
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-neutral-950 border-l border-neutral-800 h-full flex flex-col shadow-2xl animate-slideLeft">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Itinerary Cart</h2>
              <p className="text-xs text-slate-400 font-mono">
                {cartItems.length} item(s) picked for your trip
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center mx-auto text-slate-600">
                <ShoppingBag size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Your Cart is Empty</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Browse our safaris, hotels, or packages across the website and click <span className="text-amber-400 font-bold">"Add to Itinerary"</span> to build your custom trip.
                </p>
              </div>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div 
                key={item.id || index}
                className="bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/40 transition rounded-2xl p-4 flex items-center justify-between gap-4 shadow-md group"
              >
                <div className="space-y-1 flex-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-700/60">
                    {item.category || item.type || 'Selected Experience'}
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {item.title || item.name || 'Custom Activity'}
                  </h4>
                  <p className="text-xs font-mono font-bold text-amber-400">
                    {item.price ? `$${Number(item.price).toFixed(2)}` : 'Included'}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id || index)}
                  className="w-8 h-8 rounded-xl bg-neutral-950 hover:bg-red-950/40 text-slate-500 hover:text-red-400 border border-neutral-800 flex items-center justify-center transition shrink-0"
                  title="Remove item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer & Actions */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-neutral-800 bg-neutral-900/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Total</span>
              <span className="text-lg font-black text-amber-400 font-mono">${totalPrice.toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleBuildFromCart}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-xl transition text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
              >
                <Sparkles size={16} /> Build Itinerary From Cart <ArrowRight size={14} />
              </button>
              
              <button
                onClick={clearAll}
                className="w-full bg-transparent hover:bg-neutral-900 text-red-400/80 hover:text-red-400 font-bold py-2.5 rounded-xl transition text-xs uppercase tracking-wider"
              >
                Clear All Items
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}