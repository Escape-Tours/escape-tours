'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader2, UploadCloud } from 'lucide-react';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', phone: '' });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Passport upload is mandatory.");
    setLoading(true);

    try {
      // 1. Auth Sign Up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed.');

      // 2. Upload Passport to Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${authData.user.id}/${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('passports')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 3. Insert Profile using explicit any assertion to resolve Supabase strict typings mismatch
      const { error: profileError } = await (supabase.from('profiles') as any).insert({
        id: authData.user.id,
        full_name: formData.full_name,
        phone: formData.phone,
        passport_url: uploadData.path,
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
    <form onSubmit={handleRegister} className="space-y-4 bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
      <div>
        <h3 className="text-xl font-extrabold text-white">Create Account</h3>
        <p className="text-xs text-slate-400 mt-1">Register with your phone & passport for tier verification.</p>
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
        <input 
          type="tel" 
          placeholder="+255 XXX XXX XXX" 
          required 
          className="w-full p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-all" 
          onChange={(e) => setFormData({...formData, phone: e.target.value})} 
        />
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