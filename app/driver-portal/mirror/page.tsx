// app/driver-portal/mirror/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { MapPin, Navigation as NavIcon, Users, Phone, Shield, Clock, Compass, CheckCircle2, MessageSquare, Send, Radio, Activity, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MirrorViewPage() {
  const [activeTrip, setActiveTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchLiveTripAndMessages = async () => {
    setLoading(true);
    
    // Query active trip directly from Supabase driver_postings table
    const { data: tripData, error: tripError } = await supabase
      .from("driver_postings")
      .select("*")
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    if (tripData) {
      setActiveTrip(tripData);
      
      // Fetch corresponding messages for this live trip
      const { data: msgData } = await supabase
        .from("driver_messages")
        .select("*")
        .eq("trip_id", tripData.id)
        .order("created_at", { ascending: true });
      
      if (msgData) {
        setMessages(msgData);
      }
    } else {
      setActiveTrip(null);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchLiveTripAndMessages();

    // Realtime Subscriptions for Live Database Sync
    const channel = supabase
      .channel('driver-mirror-strict-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'driver_postings' },
        (payload) => {
          if (payload.new) {
            setActiveTrip(payload.new);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'driver_messages' },
        (payload) => {
          if (payload.new) {
            setMessages((prev) => {
              // Prevent duplicate insertions if already present
              if (prev.some((m) => m.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAdvanceMilestone = async () => {
    if (!activeTrip) return;
    setUpdating(true);

    const nextMilestone = activeTrip.current_location?.includes("Ngorongoro") 
      ? "Arrived at Serengeti National Park Central Seronera" 
      : "En Route to Crater Rim Descent Gate";

    const updatedCoords = activeTrip.current_location?.includes("Ngorongoro") 
      ? "-2.3333° S, 34.8333° E" 
      : "-3.2333° S, 35.5833° E";

    // Update real database row
    const { error } = await supabase
      .from("driver_postings")
      .update({ current_location: nextMilestone, coordinates: updatedCoords })
      .eq("id", activeTrip.id);

    if (!error) {
      setActiveTrip((prev: any) => ({ ...prev, current_location: nextMilestone, coordinates: updatedCoords }));
    }
    
    setUpdating(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeTrip) return;

    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgPayload = {
      trip_id: activeTrip.id,
      sender: "Driver",
      text: newMessage,
      time: formattedTime
    };

    // Insert directly into Supabase database table
    const { data, error } = await supabase
      .from("driver_messages")
      .insert([msgPayload])
      .select()
      .single();

    if (!error && data) {
      setMessages((prev) => [...prev, data]);
    }

    setNewMessage("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-400 font-bold text-sm">
        Querying Active Database Telemetry...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">
              <Shield size={14} />
              <span>Escape+ Live Mirror View Matrix</span>
            </div>
            <h1 className="text-2xl font-black text-white">Client & Driver Sync Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={fetchLiveTripAndMessages}
              variant="outline"
              className="bg-slate-800 border-slate-700 text-slate-200 hover:text-amber-400 hover:bg-slate-700 text-xs h-9 rounded-xl flex items-center gap-1.5"
            >
              <RefreshCw size={13} />
              <span>Sync DB Feed</span>
            </Button>

            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold shadow-lg shadow-emerald-500/5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Strict Database Mode
            </span>
          </div>
        </div>

        {/* Conditional Rendering based on Live Database Entry */}
        {!activeTrip ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xl">
            <AlertTriangle className="mx-auto text-amber-400" size={48} />
            <h2 className="text-xl font-bold text-white">No Active Trip Dispatched in Supabase</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No live record was found in your <code className="text-amber-400">driver_postings</code> table with status <code className="text-amber-400">active</code>. Go to your Driver Portal dashboard and trigger or assign a dispatch to initialize live telemetry streaming.
            </p>
            <Button 
              onClick={fetchLiveTripAndMessages}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs"
            >
              Check Again
            </Button>
          </div>
        ) : (
          <>
            {/* Split Screen Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Box: Client Manifest & Status */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                    <h3 className="font-bold text-lg text-amber-300 flex items-center gap-2">
                      <Users size={18} />
                      <span>Client Manifest</span>
                    </h3>
                    <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-xl">
                      {activeTrip.pax_count || 1} Guests Confirmed
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Current Milestone</p>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {activeTrip.coordinates || "GPS Live Lock"}
                        </span>
                      </div>
                      <p className="text-base font-bold text-white flex items-center gap-2">
                        <MapPin size={16} className="text-amber-400 shrink-0" />
                        {activeTrip.current_location || activeTrip.location || "En Route"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Estimated Arrival</p>
                        <p className="text-sm font-bold text-amber-300 mt-1 flex items-center gap-1.5">
                          <Clock size={14} />
                          {activeTrip.eta || "Pending"}
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Emergency Dispatch</p>
                        <a href={`tel:${activeTrip.support_phone || "+255700000000"}`} className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5 hover:underline">
                          <Phone size={14} />
                          {activeTrip.support_phone || "Support Line"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                  <Compass className="text-amber-400 shrink-0 animate-spin" style={{ animationDuration: '10s' }} size={20} />
                  <p className="text-xs text-amber-200/90 font-medium">
                    Connected live to database row ID: <span className="font-mono">{activeTrip.id}</span>
                  </p>
                </div>
              </div>

              {/* Right Box: Driver Telemetry & Navigation Feed */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                    <h3 className="font-bold text-lg text-emerald-400 flex items-center gap-2">
                      <NavIcon size={18} />
                      <span>Driver Guidance Feed</span>
                    </h3>
                    <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <Activity size={12} className="animate-pulse" />
                      Speed: {activeTrip.speed || "Live Feed"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Next Waypoint Turn</span>
                      <p className="text-sm font-medium text-slate-200">Proceed along main track according to dispatch specifications.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assigned Vehicle</p>
                        <p className="text-sm font-bold text-white mt-0.5">{activeTrip.vehicle_name || activeTrip.title || "Safari Cruiser"}</p>
                      </div>
                      <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-500/20">
                        {activeTrip.license_plate || "T-EAT"}
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleAdvanceMilestone}
                  disabled={updating}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <CheckCircle2 size={18} />
                  <span>{updating ? "Broadcasting to DB..." : "Advance Milestone Status"}</span>
                </Button>
              </div>

            </div>

            {/* Live Comms Stream */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <MessageSquare size={18} className="text-amber-400" />
                  <span>Secure Dispatch & Client Comms Channel (Live DB)</span>
                </h3>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <Radio size={12} className="animate-pulse" />
                  Table Stream Active
                </span>
              </div>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                {messages.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">No communication records found for this trip yet. Send a message below.</p>
                ) : (
                  messages.map((m) => (
                    <div key={m.id || Math.random()} className={`flex flex-col ${m.sender === 'Driver' ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{m.sender}</span>
                        <span className="text-[10px] text-slate-500">{m.time}</span>
                      </div>
                      <div className={`p-3.5 rounded-2xl text-xs max-w-lg shadow-sm ${
                        m.sender === 'Driver' 
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-100 rounded-tr-none' 
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <input 
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Send live database message to client..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
                <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-3 rounded-xl flex items-center gap-1.5 shrink-0 shadow-lg shadow-amber-500/10">
                  <Send size={14} />
                  <span>Send Live</span>
                </Button>
              </form>
            </div>
          </>
        )}

      </div>
    </main>
  );
}