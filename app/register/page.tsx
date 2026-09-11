// app/register/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader2, UploadCloud, Phone, Globe, ShieldCheck, UserCheck } from 'lucide-react';
import { ResidencyTier } from '@/lib/utils/price-translator';

const COUNTRY_PREFIXES = [
  { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+256', country: 'Uganda', flag: '🇺🇬' },
  { code: '+250', country: 'Rwanda', flag: '🇷🇼' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({ 
    full_name: '', 
    email: '', 
    password: '', 
    phoneLocal: '', 
    passport_number: '' 
  });
  const [selectedPrefix, setSelectedPrefix] = useState(COUNTRY_PREFIXES[0].code);
  const [residencyTier, setResidencyTier] = useState<ResidencyTier>('CITIZEN');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Passport or verification document upload is mandatory.");
    setLoading(true);

    try {
      const cleanPassport = formData.passport_number.trim().toUpperCase();
      const fullPhoneNumber = `${selectedPrefix} ${formData.phoneLocal.trim()}`;

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed.');

      const fileExt = file.name.split('.').pop();
      const fileName = `${authData.user.id}/${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('passports')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: profileError } = await supabase
        .from('profiles' as any)
        .insert({
          id: authData.user.id,
          full_name: formData.full_name,
          phone_number: fullPhoneNumber,
          passport_number: cleanPassport,
          passport_url: uploadData.path,
          residency_tier: residencyTier,
        });

      if (profileError) throw profileError;

      router.push('/user-hub');
    } catch (err: any) {
      alert(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <form onSubmit={handleRegister} className="max-w-md w-full space-y-4 bg-slate-900/95 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-md text-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="text-amber-400" size={20} />
            <h3 className="text-xl font-extrabold text-white">Create Verified Account</h3>
          </div>
          <p className="text-xs text-slate-400">Provide your details and select your correct residency tier for accurate pricing.</p>
        </div>

        <div className="space-y-3">
          <input 
            type="text" 
            placeholder="Full Name" 
            required 
            className="w-full p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-all" 
            onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
          />
          
          <input 
            type="email" 
            placeholder="Email Address" 
            required 
            className="w-full p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-all" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            required 
            className="w-full p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-all" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Phone Number & Country Code</label>
            <div className="flex gap-2">
              <select 
                value={selectedPrefix}
                onChange={(e) => setSelectedPrefix(e.target.value)}
                className="px-3 py-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-amber-300 font-bold outline-none cursor-pointer focus:border-amber-500"
              >
                {COUNTRY_PREFIXES.map((item) => (
                  <option key={item.code} value={item.code} className="bg-slate-900 text-slate-100">
                    {item.flag} {item.code}
                  </option>
                ))}
              </select>
              <div className="relative flex-1">
                <Phone className="absolute left-3.5 top-4 text-slate-600" size={14} />
                <input 
                  type="tel"
                  placeholder="700 000 000"
                  required
                  value={formData.phoneLocal}
                  onChange={(e) => setFormData({...formData, phoneLocal: e.target.value})}
                  className="w-full pl-10 pr-3.5 py-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-white focus:border-amber-500 outline-none placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Explicit Residency Tier Selection */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-amber-400 mb-1.5 flex items-center gap-1">
              <UserCheck size={12} /> Select Residency Status Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['CITIZEN', 'RESIDENT', 'INTERNATIONAL'] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setResidencyTier(tier)}
                  className={`py-2.5 px-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
                    residencyTier === tier
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              {residencyTier === 'RESIDENT' ? 'Residence Permit / ID Number' : 'Passport Number'}
            </label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-4 text-slate-600" size={14} />
              <input 
                type="text"
                placeholder={residencyTier === 'RESIDENT' ? 'TZ/WP/2026/...' : 'A12345678'}
                required
                value={formData.passport_number}
                onChange={(e) => setFormData({...formData, passport_number: e.target.value})}
                className="w-full pl-10 pr-3.5 py-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-white uppercase font-mono focus:border-amber-500 outline-none placeholder:text-slate-600"
              />
            </div>
          </div>
        </div>
        
        <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 p-6 text-center rounded-2xl bg-slate-950/40 transition-all cursor-pointer relative">
          <input 
            type="file" 
            accept="image/*,.pdf" 
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <UploadCloud className="text-amber-400" size={24} />
            <p className="text-xs font-semibold text-slate-300">
              {file ? file.name : (residencyTier === 'RESIDENT' ? "Upload Residence Permit / ID Document" : "Upload Passport Image or PDF")}
            </p>
            <p className="text-[10px] text-slate-500">Mandatory for tier & identity validation.</p>
          </div>
        </div>

        <button 
          disabled={loading} 
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 p-4 rounded-xl font-extrabold text-sm shadow-lg transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin text-slate-950" size={20} /> : "Create Verified Account"}
        </button>
      </form>
    </div>
  );
}