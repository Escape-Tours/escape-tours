// app/client-portal/tracking/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { 
  MapPin, Navigation as NavIcon, Users, Phone, Shield, Clock, 
  Compass, MessageSquare, Send, Radio, Activity, CheckCircle2, 
  Calendar, Hotel, FileText, Sparkles, Map as MapIcon, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClientTrackingPage() {
  const [activeTrip, setActiveTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"telemetry" | "itinerary" | "vouchers">("telemetry");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchLiveTripAndMessages = async () => {
    setLoading(true);
    const { data: tripData } = await supabase
      .from("driver_postings")
      .select("*")
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    if (tripData) {
      setActiveTrip(tripData);
      const { data: msgData } = await supabase
        .from("driver_messages")
        .select("*")
        .eq("trip_id", tripData.id)
        .order("created_at", { ascending: true });

      if (msgData) setMessages(msgData);
    } else {
      setActiveTrip(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLiveTripAndMessages();

    const channel = supabase
      .channel('client-tracking-feature-rich')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'driver_postings' },
        (payload) => {
          if (payload.new) setActiveTrip(payload.new);
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'driver_messages' },
        (payload) => {
          if (payload.new) {
            setMessages((prev) => {
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeTrip) return;

    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgPayload = {
      trip_id: activeTrip.id,
      sender: "Client",
      text: newMessage,
      time: formattedTime
    };

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
        Loading Escape+ Expedition Hub...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">
              <Shield size={14} />
              <span>Escape+ Traveller Live Matrix & Concierge</span>
            </div>
            <h1 className="text-2xl font-black text-white">Your Expedition Command Center</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Driver Stream Synced
            </span>
          </div>
        </div>

        {!activeTrip ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center space-y-6 shadow-xl">
            <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto">
              <Compass className="text-amber-400 animate-spin" style={{ animationDuration: '15s' }} size={36} />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-xl font-bold text-white">Expedition Standby Mode</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your assigned driver has not yet activated telemetry transmission. Once your journey begins, real-time GPS coordinates, vehicle tracking, and live messaging will unlock here automatically.
              </p>
            </div>
            <Button 
              onClick={fetchLiveTripAndMessages}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-amber-500/10"
            >
              Refresh Telemetry Feed
            </Button>
          </div>
        ) : (
          <>
            {/* Interactive Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <button
                onClick={() => setActiveTab("telemetry")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "telemetry" 
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/10' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Activity size={14} />
                <span>Live Telemetry & Comms</span>
              </button>
              <button
                onClick={() => setActiveTab("itinerary")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "itinerary" 
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/10' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Calendar size={14} />
                <span>Itinerary Milestones</span>
              </button>
              <button
                onClick={() => setActiveTab("vouchers")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "vouchers" 
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/10' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <FileText size={14} />
                <span>Passes & Vouchers</span>
              </button>
            </div>

            {/* TAB 1: TELEMETRY & COMMS */}
            {activeTab === "telemetry" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Location & Progress */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                        <h3 className="font-bold text-lg text-amber-300 flex items-center gap-2">
                          <MapPin size={18} />
                          <span>Active Route Progress</span>
                        </h3>
                        <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-xl">
                          {activeTrip.pax_count || 1} Guests
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Live Coordinates</p>
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              {activeTrip.coordinates || "GPS Active"}
                            </span>
                          </div>
                          <p className="text-base font-bold text-white flex items-center gap-2">
                            <MapPin size={16} className="text-amber-400 shrink-0" />
                            {activeTrip.current_location || activeTrip.location}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Estimated Arrival</p>
                            <p className="text-sm font-bold text-amber-300 mt-1 flex items-center gap-1.5">
                              <Clock size={14} />
                              {activeTrip.eta || "En Route"}
                            </p>
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Driver Support Line</p>
                            <a href={`tel:${activeTrip.support_phone}`} className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5 hover:underline">
                              <Phone size={14} />
                              {activeTrip.support_phone || "Support"}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                      <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
                      <p className="text-xs text-emerald-200/90 font-medium">
                        Milestones are synchronized live with your assigned expert guide.
                      </p>
                    </div>
                  </div>

                  {/* Vehicle Info & Map Preview Slot */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                        <h3 className="font-bold text-lg text-emerald-400 flex items-center gap-2">
                          <NavIcon size={18} />
                          <span>Vehicle & Satellite Feed</span>
                        </h3>
                        <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <Activity size={12} className="animate-pulse" />
                          {activeTrip.speed || "Active Cruise"}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assigned Safari Cruiser</p>
                            <p className="text-sm font-bold text-white mt-0.5">{activeTrip.vehicle_name || activeTrip.title}</p>
                          </div>
                          <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-500/20">
                            {activeTrip.license_plate || "T-EAT"}
                          </span>
                        </div>

                        {/* Mapbox Integration Placeholder box */}
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                              <MapIcon size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">Mapbox Satellite Overlay</p>
                              <p className="text-[10px] text-slate-400">Real-time coordinates telemetry stream active</p>
                            </div>
                          </div>
                          <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2.5 py-1 rounded-lg">
                            Connected
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                      <Shield className="text-amber-400 shrink-0" size={20} />
                      <p className="text-xs text-amber-200/90 font-medium">
                        Protected by Escape+ Verified Safety Standards.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Direct Comms Chat Stream */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      <MessageSquare size={18} className="text-amber-400" />
                      <span>Direct Comms Stream with Your Driver</span>
                    </h3>
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                      <Radio size={12} className="animate-pulse" />
                      Live WebSocket
                    </span>
                  </div>

                  <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                    {messages.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-6">No messages yet. Send a message to your driver below.</p>
                    ) : (
                      messages.map((m) => (
                        <div key={m.id || Math.random()} className={`flex flex-col ${m.sender === 'Client' ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{m.sender}</span>
                            <span className="text-[10px] text-slate-500">{m.time}</span>
                          </div>
                          <div className={`p-3.5 rounded-2xl text-xs max-w-lg shadow-sm ${
                            m.sender === 'Client' 
                              ? 'bg-amber-500/15 border border-amber-500/30 text-amber-100 rounded-tr-none' 
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
                      placeholder="Message your assigned driver..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                    <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-3 rounded-xl flex items-center gap-1.5 shrink-0 shadow-lg shadow-amber-500/10">
                      <Send size={14} />
                      <span>Send</span>
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 2: ITINERARY MILESTONES */}
            {activeTab === "itinerary" && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl animate-fadeIn">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="text-amber-400" size={20} />
                    <span>Scheduled Itinerary Breakdown</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Detailed day-by-day routing mapped to your active expedition package.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { day: "Day 1", title: "Arrival & Ngorongoro Crater Transit", status: "Completed", desc: "Arrive at Kilimanjaro International Airport, transfer to Arusha, and scenic drive towards the Ngorongoro Conservation Area." },
                    { day: "Day 2", title: "Ngorongoro Crater Floor Game Drive", status: "Active Now", desc: "Descend 600 meters into the crater floor for an unforgettable wildlife viewing experience among the Big Five." },
                    { day: "Day 3", title: "Serengeti National Park Central Seronera", status: "Upcoming", desc: "Journey north into the endless plains of the Serengeti with game drives tracking lion prides and migration herds." }
                  ].map((item, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <span className="px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-xl shrink-0">
                          {item.day}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-white">{item.title}</h4>
                          <p className="text-xs text-slate-400 mt-1 max-w-xl">{item.desc}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full self-start md:self-center ${
                        item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        item.status === 'Active Now' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PASSES & VOUCHERS */}
            {activeTab === "vouchers" && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl animate-fadeIn">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="text-amber-400" size={20} />
                    <span>Verified Passes & Lodging Vouchers</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Official digital credentials for park entry and luxury lodge accommodations.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Park Entry Pass</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-mono">Verified #TZA-8821</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Tanzania National Parks Authority Pass</h4>
                      <p className="text-xs text-slate-400 mt-1">Covers Serengeti & Ngorongoro Conservation Area access.</p>
                    </div>
                    <Button variant="outline" className="w-full bg-slate-900 border-slate-700 text-slate-200 hover:text-amber-400 text-xs h-9 rounded-xl">
                      Download Official Pass PDF
                    </Button>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Lodging Voucher</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-mono">Confirmed</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Serengeti Luxury Migration Camp</h4>
                      <p className="text-xs text-slate-400 mt-1">All-inclusive full board reservation for 2 guests.</p>
                    </div>
                    <Button variant="outline" className="w-full bg-slate-900 border-slate-700 text-slate-200 hover:text-amber-400 text-xs h-9 rounded-xl">
                      View Lodge Reservation QR
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}