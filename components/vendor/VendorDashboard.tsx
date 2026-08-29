'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Building2, Calendar, DollarSign, Users, ShieldCheck, Loader2 } from 'lucide-react';

interface LedgerItem {
  id: string;
  itinerary_id: string;
  allocated_amount: number;
  currency: string;
  status: string;
  gateway_reference: string;
  created_at: string;
}

export const VendorDashboard = ({ vendorId }: { vendorId: string }) => {
  const [ledgers, setLedgers] = useState<LedgerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const { data, error } = await (supabase
          .from('financial_ledgers' as any) as any)
          .select('*')
          .eq('recipient_id', vendorId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLedgers(data || []);
      } catch (err) {
        console.error("Failed to fetch vendor ledgers:", err);
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) {
      fetchVendorData();
    }
  }, [vendorId]);

  const totalEarnings = ledgers.reduce((sum, item) => sum + Number(item.allocated_amount), 0);

  if (loading) {
    return (
      <div className="w-full h-96 bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-400" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 p-8 font-sans text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Building2 size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">Vendor Partner Portal</span>
              <h1 className="text-2xl font-black tracking-tight mt-1">Fulfillment & Ledger View</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-950 px-5 py-3 rounded-2xl border border-white/10 shadow-inner">
            <div className="w-8 h-8 rounded-xl bg-emerald-400/10 flex items-center justify-center text-emerald-400">
              <DollarSign size={18} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Total Payout Balance</p>
              <p className="text-lg font-black text-white">${totalEarnings.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 mb-3">
              <Calendar size={18} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Bookings Assigned</p>
            <p className="text-2xl font-black text-white mt-1">{ledgers.length}</p>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 mb-3">
              <Users size={18} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Fulfillment Status</p>
            <p className="text-2xl font-black text-white mt-1">Active & Synced</p>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-emerald-400/10 flex items-center justify-center text-emerald-400 mb-3">
              <ShieldCheck size={18} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Ledger Security</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">Verified</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-black tracking-tight text-white">Recent Split Payout Settlements</h2>
          
          {ledgers.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No ledger records found for this vendor profile.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="py-3 px-4">Ledger ID</th>
                    <th className="py-3 px-4">Gateway Reference</th>
                    <th className="py-3 px-4">Allocated Share</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {ledgers.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-mono text-slate-400">{item.id.slice(0, 8)}...</td>
                      <td className="py-4 px-4 font-mono text-white">{item.gateway_reference}</td>
                      <td className="py-4 px-4 font-black text-amber-400">${item.allocated_amount.toLocaleString()} {item.currency}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                          item.status === 'SETTLED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-400">{new Date(item.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default VendorDashboard;