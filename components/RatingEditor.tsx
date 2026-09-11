'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Minus, Plus, Loader2 } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function RatingEditor({ hotelId, initialRating }: { hotelId: number, initialRating: number }) {
  const [rating, setRating] = useState(initialRating);
  const [loading, setLoading] = useState(false);

  const updateRating = async (newRating: number) => {
    // Prevent out-of-bounds ratings (e.g., below 0 or above 5)
    if (newRating < 0 || newRating > 5) return;
    
    setLoading(true);
    const { error } = await getSupabaseClient()
      .from('hotels')
      .update({ rating: newRating })
      .eq('id', hotelId);

    if (!error) {
      setRating(newRating);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-6 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 w-fit">
      <div className="flex items-center gap-2">
        <Star className="text-amber-400 fill-amber-400" size={20} />
        <span className="font-black text-xl">{rating.toFixed(1)}</span>
      </div>

      <div className="flex items-center gap-1">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={loading}
          onClick={() => updateRating(rating - 0.5)}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Minus size={16} />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={loading}
          onClick={() => updateRating(rating + 0.5)}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
        </motion.button>
      </div>
    </div>
  );
}