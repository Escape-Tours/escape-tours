'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader2, UploadCloud, Phone, Globe, ShieldCheck } from 'lucide-react';
import { ResidencyTier } from '@/lib/utils/price-translator';

const COUNTRY_PREFIXES = [
  { code: '+255', country: 'Tanzania', flag: '🇹🇿', tier: 'CITIZEN' as ResidencyTier },
  { code: '+254', country: 'Kenya', flag: '🇰🇪', tier: 'INTERNATIONAL' as ResidencyTier },
  { code: '+256', country: 'Uganda', flag: '🇺🇬', tier: 'INTERNATIONAL' as ResidencyTier },
  { code: '+250', country: 'Rwanda', flag: '🇷🇼', tier: 'INTERNATIONAL' as ResidencyTier },
  { code: '+1', country: 'United States', flag: '🇺🇸', tier: 'INTERNATIONAL' as ResidencyTier },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', tier: 'INTERNATIONAL' as ResidencyTier },
  { code: '+49', country: 'Germany', flag: '🇩🇪', tier: 'INTERNATIONAL' as ResidencyTier },
];

export default function RegistrationForm() {
  const [formData, setFormData] = useState({ 
    full_name: '', 
    email: '', 
    password: '', 
    phoneLocal: '', 
    passport_number: '' 
  });
  const [selectedPrefix, setSelectedPrefix] = useState(COUNTRY_PREFIXES[0].code);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Passport document upload is mandatory.");
    setLoading(true);

    try {
      // 1. Determine residency tier based on phone prefix and passport criteria strictly categorized as citizen, resident, and international
      const activeCountry = COUNTRY_PREFIXES.find(c => c.code === selectedPrefix);
      let calculatedTier: ResidencyTier = activeCountry ? activeCountry.tier : 'INTERNATIONAL';
      
      const cleanPassport = formData.passport_number.trim().toUpperCase();

      // If Tanzanian prefix is selected, check passport format to differentiate between citizen and local resident if needed
      if (calculatedTier === 'CITIZEN' && (cleanPassport.startsWith('TZR') || cleanPassport.startsWith('RES'))) {
        calculatedTier = 'RESIDENT';
      }

      const fullPhoneNumber = `${selectedPrefix} ${formData.phoneLocal.trim()}`;

      // 2. Auth Sign Up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed.');

      // 3. Upload Passport to Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${authData.user.id}/${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('passports')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 4. Insert Profile with verified phone, passport, and automatically evaluated residency tier
      const { error: profileError } = await (supabase.from('profiles' as any) as any).insert({
        id: authData.user.id,
        full_name: formData.full_name,
        phone_number: fullPhoneNumber,
        passport_number: cleanPassport,
        passport_url: uploadData.path,
        residency_tier: calculatedTier,
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
    <form onSubmit={handleRegister} className="space-y-4 bg-slate-900/95 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-md text-slate-100">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="text-amber-400" size={20} />
          <h3 className="text-xl font-extrabold text-white">Create Verified Account</h3>
        </div>
        <p className="text-xs text-slate-400">Select your country code and provide passport verification for tier assignment.</p>
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

        {/* Multi-prefix Phone Input */}
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

        {/* Passport Number Input */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Passport Number</label>
          <div className="relative">
            <Globe className="absolute left-3.5 top-4 text-slate-600" size={14} />
            <input 
              type="text"
              placeholder="A12345678"
              required
              value={formData.passport_number}
              onChange={(e) => setFormData({...formData, passport_number: e.target.value})}
              className="w-full pl-10 pr-3.5 py-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-white uppercase font-mono focus:border-amber-500 outline-none placeholder:text-slate-600"
            />
          </div>
        </div>
      </div>
      
      {/* File Upload Section */}
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
            {file ? file.name : "Upload passport image or PDF"}
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
  );
}