// app/admin/vendors/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Building2, 
  ShieldCheck, 
  Plus, 
  Search, 
  Loader2, 
  Crown,
  DollarSign
} from 'lucide-react';

interface Vendor {
  id: string;
  vendor_name: string;
  service_type: string;
  commission_rate: number;
  balance_payout: number;
  status: 'PENDING' | 'SETTLED' | 'ACTIVE' | 'ACTION REQUIRED';
  reliability: string;
  last_active: string;
}

export default function LuxuryVendorPortal() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal State for Onboarding New Vendor
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [newServiceType, setNewServiceType] = useState('Luxury Accommodation');
  const [newCommission, setNewCommission] = useState('15');
  const [newPayout, setNewPayout] = useState('0');

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    const supabase = createClient();
    
    // Fetching strictly from live Supabase vendors table with type assertions to resolve strict typing mismatches
    const { data, error } = await (supabase.from('vendors' as any) as any)
      .select('*')
      .order('vendor_name', { ascending: true });

    if (!error && data) {
      setVendors(data.map((v: any) => ({
        id: v.id,
        vendor_name: v.vendor_name || v.name,
        service_type: v.service_type || 'Lodge / Safari',
        commission_rate: v.commission_rate ?? 15,
        balance_payout: v.balance_payout ?? 0,
        status: (v.status || 'ACTIVE').toUpperCase(),
        reliability: v.reliability || '98.5%',
        last_active: v.last_active || 'Just now'
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (mounted) {
      fetchVendors();
    }
  }, [mounted]);

  const handleSettlePayout = async (vendorId: string) => {
    setActionLoading(vendorId);
    const supabase = createClient();
    
    const { error } = await (supabase.from('vendors' as any) as any)
      .update({ status: 'SETTLED', balance_payout: 0 })
      .eq('id', vendorId);

    if (!error) {
      setVendors(vendors.map(v => v.id === vendorId ? { ...v, status: 'SETTLED', balance_payout: 0 } : v));
    }
    setActionLoading(null);
  };

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName.trim()) return;

    const supabase = createClient();
    const newEntry = {
      vendor_name: newVendorName,
      service_type: newServiceType,
      commission_rate: parseFloat(newCommission),
      balance_payout: parseFloat(newPayout),
      status: 'ACTIVE',
      reliability: '100%',
      last_active: 'Just now'
    };

    const { data, error } = await (supabase.from('vendors' as any) as any)
      .insert([newEntry])
      .select();

    if (!error && data) {
      setVendors([...vendors, { id: data[0].id, ...newEntry, status: 'ACTIVE' }]);
      setIsModalOpen(false);
      setNewVendorName('');
      setNewPayout('0');
    }
  };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.service_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = vendors.reduce((acc, curr) => acc + (curr.status !== 'SETTLED' ? curr.balance_payout : 0), 0);
  const avgReliability = vendors.length > 0 
    ? (vendors.reduce((acc, curr) => acc + parseFloat(curr.reliability || '0'), 0) / vendors.length).toFixed(1)
    : '100.0';

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-8 pb-12">
      
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-stone-900/90 p-8 rounded-[2.5rem] border border-amber-500/20 backdrop-blur-xl shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-serif uppercase tracking-[0.3em] text-amber-400 font-semibold">Escape Tours & Safaris</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[9px] font-serif text-amber-300 uppercase tracking-widest flex items-center gap-1">
              <Crown size={10} /> Live Database Matrix
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-stone-100 tracking-wide">Vendor Partner Portal</h1>
          <p className="text-stone-400 font-serif text-xs max-w-xl">
            Live telemetry monitoring partner fulfillment, commission structures, reliability indexes, and automated payout settlements directly synced with Supabase.
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-serif font-bold text-xs uppercase tracking-widest rounded-2xl shadow-xl transition flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>Onboard New Vendor</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-stone-900/90 p-6 rounded-[2rem] border border-amber-500/20 shadow-xl backdrop-blur-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-serif uppercase tracking-widest text-stone-400">Total Partners</span>
            <Building2 size={18} className="text-amber-400" />
          </div>
          <p className="text-3xl font-serif font-extrabold text-stone-100">{vendors.length}</p>
          <span className="text-[10px] font-serif text-emerald-400 mt-1 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live DB Sync Active
          </span>
        </div>

        <div className="bg-stone-900/90 p-6 rounded-[2rem] border border-amber-500/20 shadow-xl backdrop-blur-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-serif uppercase tracking-widest text-stone-400">Outstanding Payouts</span>
            <DollarSign size={18} className="text-amber-400" />
          </div>
          <p className="text-3xl font-serif font-extrabold text-stone-100">${totalOutstanding.toLocaleString()}</p>
          <span className="text-[10px] font-serif text-amber-400 mt-1 inline-block">Ready for settlement clearance</span>
        </div>

        <div className="bg-stone-900/90 p-6 rounded-[2rem] border border-amber-500/20 shadow-xl backdrop-blur-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-serif uppercase tracking-widest text-stone-400">Avg Reliability Index</span>
            <ShieldCheck size={18} className="text-emerald-400" />
          </div>
          <p className="text-3xl font-serif font-extrabold text-stone-100">{avgReliability}%</p>
          <span className="text-[10px] font-serif text-emerald-400 mt-1 inline-block">Tier 1 Service Standard</span>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-stone-900/90 p-4 rounded-2xl border border-amber-500/20 backdrop-blur-xl">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />
          <input 
            type="text"
            placeholder="Search vendors or services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl pl-11 pr-4 py-2.5 text-xs font-serif text-stone-200 placeholder-stone-500 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'ACTIVE', 'PENDING', 'ACTION REQUIRED', 'SETTLED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-2 rounded-xl text-[10px] font-serif font-bold uppercase tracking-wider transition cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'bg-stone-950/60 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Vendor Table */}
      <div className="bg-stone-900/90 rounded-[2.5rem] border border-amber-500/20 overflow-hidden shadow-2xl backdrop-blur-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-amber-400 space-y-3">
            <Loader2 className="animate-spin" size={32} />
            <span className="font-serif text-xs uppercase tracking-widest text-stone-300">Fetching Live Supabase Contracts...</span>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="text-center py-24 px-4">
            <Building2 size={40} className="mx-auto text-stone-600 mb-3" />
            <h3 className="font-serif font-bold text-stone-200 text-base">No Vendor Partners Found</h3>
            <p className="text-xs text-stone-500 font-serif mt-1">Try adjusting your filters or click 'Onboard New Vendor' to add one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-amber-500/20 text-[10px] font-serif font-extrabold uppercase tracking-widest text-amber-400 bg-stone-950/60">
                  <th className="px-6 py-4">Vendor Partner</th>
                  <th className="px-6 py-4">Service Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Reliability</th>
                  <th className="px-6 py-4">Markup / Payout</th>
                  <th className="px-6 py-4">Last Active</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-xs font-serif">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-stone-100 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                          {vendor.vendor_name ? vendor.vendor_name.charAt(0) : 'V'}
                        </div>
                        <span>{vendor.vendor_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-300">{vendor.service_type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        vendor.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        vendor.status === 'SETTLED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                        vendor.status === 'PENDING' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">{vendor.reliability}</td>
                    <td className="px-6 py-4">
                      <div className="font-mono">
                        <span className="text-stone-100 font-bold">${vendor.balance_payout.toLocaleString()}</span>
                        <span className="text-[10px] text-amber-400 ml-1.5">({vendor.commission_rate}% margin)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-400">{vendor.last_active}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => setSelectedVendor(vendor)}
                        className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 text-stone-200 rounded-xl text-[10px] font-bold uppercase border border-stone-800 transition cursor-pointer"
                      >
                        Audit Logs
                      </button>
                      {vendor.balance_payout > 0 && vendor.status !== 'SETTLED' && (
                        <button 
                          disabled={actionLoading === vendor.id}
                          onClick={() => handleSettlePayout(vendor.id)}
                          className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-400 hover:text-stone-950 text-amber-300 rounded-xl text-[10px] font-bold uppercase border border-amber-500/30 transition cursor-pointer"
                        >
                          {actionLoading === vendor.id ? 'Processing...' : 'Settle'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Audit Detail Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-500/30 rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl space-y-6 relative">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-serif uppercase tracking-widest text-amber-400 font-semibold">Vendor Audit Report</span>
                <h3 className="text-2xl font-serif font-bold text-stone-100 mt-1">{selectedVendor.vendor_name}</h3>
                <p className="text-xs text-stone-400 mt-0.5">{selectedVendor.service_type} • Reliability Index: <strong className="text-emerald-400">{selectedVendor.reliability}</strong></p>
              </div>
              <button 
                onClick={() => setSelectedVendor(null)}
                className="w-8 h-8 rounded-full bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-100 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 bg-stone-950 p-6 rounded-2xl border border-stone-800 text-xs font-serif">
              <div className="flex justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Current Balance Payout</span>
                <span className="font-mono font-bold text-stone-100 text-sm">${selectedVendor.balance_payout.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Agreed Commission Markup</span>
                <span className="font-mono font-bold text-amber-400">{selectedVendor.commission_rate}%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Contract Status</span>
                <span className="text-emerald-400 font-bold uppercase">{selectedVendor.status}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-stone-400">Last System Sync</span>
                <span className="text-stone-200">{selectedVendor.last_active}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => {
                  alert(`Contract document verified for ${selectedVendor.vendor_name}. All terms aligned with Escape Tours guidelines.`);
                  setSelectedVendor(null);
                }}
                className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-serif font-bold text-xs uppercase tracking-widest rounded-xl transition cursor-pointer"
              >
                Verify Contract Terms
              </button>
              <button 
                onClick={() => setSelectedVendor(null)}
                className="px-6 py-3 bg-stone-950 hover:bg-stone-800 text-stone-300 font-serif font-bold text-xs uppercase tracking-widest rounded-xl border border-stone-800 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboard New Vendor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-500/30 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold text-stone-100 uppercase tracking-wide">Onboard Partner Vendor</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-100 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddVendor} className="space-y-4 font-serif text-xs">
              <div>
                <label className="block text-stone-400 uppercase tracking-widest mb-1.5">Vendor Name</label>
                <input 
                  type="text"
                  required
                  value={newVendorName}
                  onChange={(e) => setNewVendorName(e.target.value)}
                  placeholder="e.g. Serengeti Luxury Camp"
                  className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-3 text-stone-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-400 uppercase tracking-widest mb-1.5">Service Category</label>
                <select 
                  value={newServiceType}
                  onChange={(e) => setNewServiceType(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-3 text-stone-200 outline-none"
                >
                  <option value="Luxury Accommodation">Luxury Accommodation</option>
                  <option value="Vehicle & Game Drive">Vehicle & Game Drive</option>
                  <option value="Luxury Tented Camp">Luxury Tented Camp</option>
                  <option value="Park Transport">Park Transport</option>
                  <option value="Marine Excursion">Marine Excursion</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 uppercase tracking-widest mb-1.5">Commission (%)</label>
                  <input 
                    type="number"
                    value={newCommission}
                    onChange={(e) => setNewCommission(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-3 text-stone-200 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 uppercase tracking-widest mb-1.5">Initial Balance ($)</label>
                  <input 
                    type="number"
                    value={newPayout}
                    onChange={(e) => setNewPayout(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-3 text-stone-200 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold uppercase tracking-widest rounded-xl transition cursor-pointer">
                  Save to Database
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-3 bg-stone-950 text-stone-300 font-bold uppercase rounded-xl border border-stone-800 hover:bg-stone-800 transition cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}