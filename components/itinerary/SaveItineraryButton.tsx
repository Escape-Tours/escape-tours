'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveUserItinerary } from '@/lib/utils/itinerary-actions';
import { Bookmark, Loader2, CheckCircle2 } from 'lucide-react';

export const SaveItineraryButton = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    const savedData = await saveUserItinerary();
    setLoading(false);

    if (savedData) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/user-hub');
      }, 1000);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={loading || success}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-lg hover:border-amber-500/60 disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={16} />
          <span>Saving Itinerary...</span>
        </>
      ) : success ? (
        <>
          <CheckCircle2 className="text-emerald-400" size={16} />
          <span className="text-emerald-400">Saved Successfully!</span>
        </>
      ) : (
        <>
          <Bookmark size={16} />
          <span>Save Itinerary to Hub</span>
        </>
      )}
    </button>
  );
};

export default SaveItineraryButton;