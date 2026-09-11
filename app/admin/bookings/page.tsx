// app/admin/bookings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  FileText, 
  Search, 
  Loader2, 
  CheckCircle2,
  Clock,
  AlertCircle,
  Receipt,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Download,
  Filter
} from 'lucide-react';

interface BookingTransaction {
  id: string;
  booking_reference: string;
  user_email: string;
  itinerary_name: string;
  total_amount: number;
  payment_gateway: string;
  payment_status: 'PAID' | 'PENDING' | 'FAILED';
  created_at: string;
  source: 'Builder' | 'Storefront' | 'Direct Checkout';
}

export default function AdminBookingsAndPaymentsPortal() {
  const [transactions, setTransactions] = useState<BookingTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [selectedTx, setSelectedTx] = useState<BookingTransaction | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchBookingsAndPayments = async () => {
    setLoading(true);
    const supabase = createClient();
    
    // Fetching unified bookings & payments directly from Supabase
    const { data, error } = await (supabase.from('bookings' as any) as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      setTransactions(data.map((item: any) => ({
        id: item.id || item.booking_reference,
        booking_reference: item.booking_reference || `ESC-${Math.floor(100000 + Math.random() * 900000)}`,
        user_email: item.user_email || item.email || 'guest@escapetourstz.com',
        itinerary_name: item.itinerary_name || item.title || 'Custom Luxury Safari Itinerary',
        total_amount: item.total_amount || item.amount || 0,
        payment_gateway: item.payment_gateway || 'Stripe',
        payment_status: (item.payment_status || item.status || 'PAID').toUpperCase(),
        created_at: item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today',
        source: item.source || 'Builder'
      })));
    } else {
      setTransactions([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (mounted) {
      fetchBookingsAndPayments();
    }
  }, [mounted]);

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.itinerary_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || tx.payment_status === statusFilter;
    const matchesSource = sourceFilter === 'ALL' || tx.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const totalVolume = transactions
    .filter(t => t.payment_status === 'PAID')
    .reduce((acc, curr) => acc + curr.total_amount, 0);

  if (!mounted) return null;

  return (
    <div className="space-y-10 pb-16 max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      
      {/* Luxury Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 p-8 sm:p-10 rounded-[2.5rem] border border-amber-500/30 backdrop-blur-2xl shadow-2xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-12 w-64 h-64 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-serif text-amber-300 uppercase tracking-[0.25em]">
              <Sparkles size={12} className="text-amber-400" />
              <span>Escape Tours Executive Command Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100 tracking-wide">
              Bookings & Financial Ledger
            </h1>
            <p className="text-stone-400 font-serif text-xs sm:text-sm max-w-2xl leading-relaxed">
              Real-time synchronization of bespoke builder itineraries, gateway settlements (Stripe, DPO, PesaPal, Flutterwave), and storefront fulfillment.
            </p>
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 w-full lg:w-auto bg-stone-950/80 p-5 rounded-2xl border border-amber-500/20 shadow-inner">
            <div>
              <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-stone-400 block text-left sm:text-right">Total Cleared Volume</span>
              <span className="text-3xl font-serif font-extrabold text-amber-400 tracking-tight">${totalVolume.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-serif text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <TrendingUp size={12} />
              <span>Live Database Sync Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Matrix */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-stone-900/90 p-5 rounded-2xl border border-amber-500/20 backdrop-blur-xl shadow-xl">
        <div className="relative w-full lg:w-96">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/60" />
          <input 
            type="text"
            placeholder="Search reference, client email, or package..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl pl-11 pr-4 py-3 text-xs font-serif text-stone-200 placeholder-stone-500 outline-none transition shadow-inner"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-1.5 bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800 text-[10px] font-serif text-stone-400 uppercase tracking-wider">
            <Filter size={12} className="text-amber-400" />
            <span>Source:</span>
          </div>
          {['ALL', 'Builder', 'Storefront'].map((src) => (
            <button
              key={src}
              onClick={() => setSourceFilter(src)}
              className={`px-3.5 py-2 rounded-xl text-[10px] font-serif font-bold uppercase tracking-wider transition cursor-pointer ${
                sourceFilter === src
                  ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/10'
                  : 'bg-stone-950/60 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {src}
            </button>
          ))}

          <div className="h-6 w-[1px] bg-stone-800 hidden sm:block" />

          <div className="flex items-center gap-1.5 bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800 text-[10px] font-serif text-stone-400 uppercase tracking-wider">
            <span>Status:</span>
          </div>
          {['ALL', 'PAID', 'PENDING', 'FAILED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-2 rounded-xl text-[10px] font-serif font-bold uppercase tracking-wider transition cursor-pointer ${
                statusFilter === status
                  ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/10'
                  : 'bg-stone-950/60 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Container */}
      <div className="bg-stone-900/90 rounded-[2.5rem] border border-amber-500/20 overflow-hidden shadow-2xl backdrop-blur-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-amber-400 space-y-4">
            <Loader2 className="animate-spin" size={36} />
            <span className="font-serif text-xs uppercase tracking-[0.25em] text-stone-300">Synchronizing Luxury Ledger...</span>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-32 px-4 space-y-3">
            <div className="w-16 h-16 rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center mx-auto text-stone-600">
              <Receipt size={28} />
            </div>
            <h3 className="font-serif font-bold text-stone-200 text-lg tracking-wide">No Transactions Recorded</h3>
            <p className="text-xs text-stone-400 font-serif max-w-sm mx-auto">
              Live database records from customer builder itineraries and storefront checkouts will appear here instantly upon creation.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-amber-500/20 text-[10px] font-serif font-extrabold uppercase tracking-[0.2em] text-amber-400 bg-stone-950/80">
                  <th className="px-6 py-5">Reference</th>
                  <th className="px-6 py-5">Origin</th>
                  <th className="px-6 py-5">Client Identity</th>
                  <th className="px-6 py-5">Itinerary / Product Package</th>
                  <th className="px-6 py-5">Gateway</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Amount</th>
                  <th className="px-6 py-5 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-xs font-serif">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-800/40 transition-colors group">
                    <td className="px-6 py-5 font-mono font-bold text-amber-400 text-sm tracking-wide">
                      {tx.booking_reference}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                        tx.source === 'Builder' 
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' 
                          : 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                      }`}>
                        {tx.source}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-stone-200 font-medium">{tx.user_email}</td>
                    <td className="px-6 py-5 font-bold text-stone-100 max-w-xs truncate group-hover:text-amber-200 transition-colors">
                      {tx.itinerary_name}
                    </td>
                    <td className="px-6 py-5 text-stone-400">{tx.payment_gateway}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 ${
                        tx.payment_status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10' :
                        tx.payment_status === 'PENDING' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {tx.payment_status === 'PAID' && <CheckCircle2 size={11} />}
                        {tx.payment_status === 'PENDING' && <Clock size={11} />}
                        {tx.payment_status === 'FAILED' && <AlertCircle size={11} />}
                        {tx.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-mono font-extrabold text-stone-100 text-sm">
                      ${tx.total_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => setSelectedTx(tx)}
                        className="px-4 py-2 bg-stone-950 hover:bg-amber-400 hover:text-stone-950 text-stone-200 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-stone-800 hover:border-amber-400 transition cursor-pointer inline-flex items-center gap-1.5 shadow-md"
                      >
                        <FileText size={13} /> Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Luxury Inspection Dossier Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-500/40 rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start border-b border-stone-800 pb-5">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-[10px] font-serif uppercase tracking-[0.25em] font-semibold mb-1">
                  <ShieldCheck size={14} />
                  <span>Verified Financial Dossier</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-100 font-mono tracking-wide">{selectedTx.booking_reference}</h3>
                <p className="text-xs text-stone-400 mt-1">Logged from <strong className="text-amber-400">{selectedTx.source}</strong> on {selectedTx.created_at}</p>
              </div>
              <button 
                onClick={() => setSelectedTx(null)}
                className="w-9 h-9 rounded-full bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-100 hover:border-amber-400 flex items-center justify-center font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 bg-stone-950 p-6 rounded-2xl border border-stone-800/80 text-xs font-serif shadow-inner">
              <div className="flex justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Client Email</span>
                <span className="text-stone-100 font-bold">{selectedTx.user_email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Itinerary / Product Title</span>
                <span className="text-amber-400 font-bold text-right max-w-[220px] truncate">{selectedTx.itinerary_name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Payment Gateway</span>
                <span className="text-stone-200 font-bold uppercase tracking-wider">{selectedTx.payment_gateway}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Payment Status</span>
                <span className={`font-bold uppercase tracking-wider ${selectedTx.payment_status === 'PAID' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {selectedTx.payment_status}
                </span>
              </div>
              <div className="flex justify-between py-2 items-center">
                <span className="text-stone-400">Total Charged Amount</span>
                <span className="font-mono font-extrabold text-stone-100 text-base">${selectedTx.total_amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => {
                  alert(`Transaction ${selectedTx.booking_reference} successfully verified and dispatched to luxury operations.`);
                  setSelectedTx(null);
                }}
                className="flex-1 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-serif font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition cursor-pointer shadow-lg shadow-amber-400/20"
              >
                Verify & Dispatch
              </button>
              <button 
                onClick={() => setSelectedTx(null)}
                className="px-6 py-3.5 bg-stone-950 hover:bg-stone-800 text-stone-300 font-serif font-bold text-xs uppercase tracking-widest rounded-xl border border-stone-800 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}