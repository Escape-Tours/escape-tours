// app/user/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Compass, FileText, CheckCircle2, Clock } from 'lucide-react';

export default function UserDashboard({ tier, userName }: { tier?: string; userName?: string }) {
  const [totalItineraries, setTotalItineraries] = useState(0);
  const [confirmedBookings, setConfirmedBookings] = useState(0);
  const [draftSessions, setDraftSessions] = useState(0);
  const [itineraryList, setItineraryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDashboardData = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      // Fetch itineraries belonging to this user
      const { data: itineraries, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('user_id', userId)
        .order('id', { ascending: false });

      if (itineraries && !error) {
        setTotalItineraries(itineraries.length);
        
        // Categorize by status (e.g. 'draft', 'secured', 'confirmed')
        const drafts = itineraries.filter(item => item.status === 'draft' || item.status === 'secured');
        const booked = itineraries.filter(item => item.status === 'confirmed');
        
        setDraftSessions(drafts.length);
        setConfirmedBookings(booked.length);
        setItineraryList(itineraries);
      }

      setLoading(false);
    };

    fetchUserDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-amber-400" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      {/* Header section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-100">Welcome back, {userName || 'Explorer'}</h1>
          <p className="text-slate-400 text-sm">Your custom safaris, draft sessions, and travel roadmap.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-center">
            <span className="block text-[10px] uppercase text-slate-500 font-bold">Total Itineraries</span>
            <span className="text-lg font-black text-amber-400">{totalItineraries}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-center">
            <span className="block text-[10px] uppercase text-slate-500 font-bold">Draft Sessions</span>
            <span className="text-lg font-black text-blue-400">{draftSessions}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-center">
            <span className="block text-[10px] uppercase text-slate-500 font-bold">Confirmed</span>
            <span className="text-lg font-black text-emerald-400">{confirmedBookings}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area: Itineraries & Bookings Feed */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Compass className="text-amber-400" size={20} />
          Your Itineraries & Bookings
        </h2>

        {itineraryList.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-12 text-center space-y-3">
            <FileText className="mx-auto text-slate-600" size={48} />
            <h3 className="text-lg font-bold text-slate-300">No Itineraries Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              You haven't created or saved any itineraries yet. Head over to the builder to craft your first custom Tanzanian safari.
            </p>
            <a 
              href="/itinerary-builder" 
              className="inline-block mt-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition text-sm shadow-lg shadow-amber-500/10"
            >
              Build Itinerary Now →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraryList.map((item) => (
              <div key={item.id} className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase tracking-widest bg-slate-800 text-amber-400 px-2.5 py-1 rounded-md font-extrabold">
                      {item.tier || tier || 'CITIZEN'} TIER
                    </span>
                    <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md font-extrabold flex items-center gap-1 ${
                      item.status === 'confirmed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-blue-950 text-blue-400 border border-blue-800/50'
                    }`}>
                      {item.status === 'confirmed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                      {item.status || 'Draft'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">{item.title || 'Custom Safari Itinerary'}</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Created: {new Date(item.created_at || Date.now()).toLocaleDateString()}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-300">
                    {item.total_days ? `${item.total_days} Days` : 'Custom Duration'}
                  </span>
                  <a 
                    href={`/itinerary-builder?id=${item.id}`} 
                    className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
                  >
                    View / Edit →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}