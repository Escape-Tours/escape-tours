// components/vendor/VendorCatalogManager.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Package, 
  Plus, 
  Loader2, 
  Key, 
  ShieldCheck, 
  Tag, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  Layers,
  Trash2,
  ExternalLink
} from 'lucide-react';

interface VendorCatalogManagerProps {
  vendorId?: string;
}

export default function VendorCatalogManager({ vendorId }: VendorCatalogManagerProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State including Digital Voucher Codes / Inventory Stock
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Digital Store');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [voucherCodes, setVoucherCodes] = useState(''); // New: Codes or instructions sent upon payment
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCatalogItems();
  }, []);

  const fetchCatalogItems = async () => {
    const supabase = createClient();
    const { data, error } = await (supabase.from('storefront_items' as any) as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setItems(data);
    }
    setLoading(false);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    setSubmitting(true);
    const supabase = createClient();

    // Format codes into an array or keep as secure text payload
    const codePool = voucherCodes
      .split('\n')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const newItem = {
      title,
      category,
      price: parseFloat(price),
      description,
      voucher_codes: codePool, // Stored securely for automated post-payment fulfillment
      is_active: true,
      vendor_id: vendorId || null
    };

    const { error } = await (supabase.from('storefront_items' as any) as any)
      .insert([newItem]);

    if (!error) {
      setTitle('');
      setPrice('');
      setDescription('');
      setVoucherCodes('');
      setIsModalOpen(false);
      setSuccessMessage('Catalog item and secure digital voucher pool added successfully!');
      fetchCatalogItems();
      setTimeout(() => setSuccessMessage(null), 4000);
    } else {
      console.error('Error adding catalog item:', error);
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 text-neutral-100 bg-[#050505] min-h-screen">
      
      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-5 py-3 rounded-2xl text-xs font-mono font-bold flex items-center gap-3 shadow-lg">
          <CheckCircle2 size={16} /> {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/80 border border-neutral-800 p-6 rounded-3xl backdrop-blur-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-amber-400 text-[10px] font-mono uppercase tracking-widest font-bold">
            <ShieldCheck size={14} /> Vendor Hub &bull; Automated Digital Fulfillment
          </div>
          <h1 className="text-2xl font-black text-white">Storefront Catalog & Voucher Pool</h1>
          <p className="text-xs text-neutral-400">Manage PSN gift cards, voucher codes, and instant-delivery digital assets.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-black px-6 py-3.5 rounded-2xl transition text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_10px_25px_rgba(245,158,11,0.25)]"
        >
          <Plus size={16} /> Add New Catalog Item
        </button>
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="py-20 text-center flex items-center justify-center gap-3 text-xs text-neutral-400 font-mono">
          <Loader2 className="animate-spin text-amber-400" size={20} /> Loading vendor inventory...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-16 text-center space-y-3">
          <Package size={36} className="mx-auto text-neutral-600" />
          <p className="text-sm font-bold text-white">No items in your storefront catalog.</p>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">Add gift cards or digital vouchers with auto-dispatch codes to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const stockCount = Array.isArray(item.voucher_codes) ? item.voucher_codes.length : 0;
            return (
              <div key={item.id} className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono uppercase bg-neutral-800 text-amber-300 px-3 py-1 rounded-lg border border-neutral-700 font-bold">
                      {item.category}
                    </span>
                    <span className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
                      stockCount > 0 ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/10 text-red-300 border border-red-500/30'
                    }`}>
                      <Key size={11} /> {stockCount} Codes in Stock
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">{item.description || 'Instant digital delivery upon payment confirmation.'}</p>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-lg font-black text-amber-400 font-mono">${item.price}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Auto-Dispatch Active</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Adding Item + Voucher Codes */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] w-full max-w-lg p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">Add New Catalog Item</h3>
                <p className="text-xs text-neutral-400">Configure product details and load voucher codes for auto-delivery.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white text-sm font-bold px-3 py-1 bg-neutral-800 rounded-xl">✕</button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">Item Name</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. PSN $100 GIFT CARD"
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Digital Store">Digital Store</option>
                    <option value="PSN Gift Cards">PSN Gift Cards</option>
                    <option value="Subscriptions">Subscriptions</option>
                    <option value="Vouchers">Vouchers</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="100.00"
                    required
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">Description / Instructions</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Redeemable on PlayStation Store US region accounts..."
                  rows={2}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              {/* Voucher / Claim Codes Pool */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                    <Key size={12} /> Digital Voucher / Claim Codes (One per line)
                  </label>
                  <span className="text-[10px] text-neutral-500 font-mono">Auto-assigned upon payment</span>
                </div>
                <textarea 
                  value={voucherCodes} 
                  onChange={(e) => setVoucherCodes(e.target.value)}
                  placeholder="ABCD-1234-EFGH-5678&#10;WXYZ-9876-UVWX-5432&#10;..."
                  rows={4}
                  className="w-full bg-neutral-950 border border-amber-500/40 rounded-xl px-4 py-3 text-xs font-mono text-amber-300 focus:border-amber-500 focus:outline-none resize-none"
                />
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Enter each claim code or voucher string on a new line. When a customer completes checkout, one code is automatically deducted from this pool and securely delivered to their user dashboard along with instructions.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold py-3.5 rounded-2xl transition text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-black py-3.5 rounded-2xl transition text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="animate-spin" size={16} />} Save Item & Voucher Pool
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}