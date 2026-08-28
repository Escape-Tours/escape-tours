'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Compass, Mail, Lock, Phone, Upload, Loader2, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

interface UserAuthPortalProps {
  onSuccess: (user: any, tier: string) => void;
}

export const UserAuthPortal = ({ onSuccess }: UserAuthPortalProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const supabase = createClient();

    if (isSignUp) {
      // 1. Sign up the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (authError || !authData.user) {
        setError(authError?.message || 'Registration failed. Please check your details.');
        setLoading(false);
        return;
      }

      const user = authData.user;
      let passportUrl = null;

      // 2. Optional: Upload passport document to Supabase Storage if provided
      if (passportFile) {
        const fileExt = passportFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('passports')
          .upload(fileName, passportFile);

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('passports')
            .getPublicUrl(fileName);
          passportUrl = publicUrlData.publicUrl;
        }
      }

      // 3. Precise tier classification matching your business rules:
      // - CITIZEN/RESIDENT strictly for Tanzanian formats (+255 or local 07/06 leading numbers)
      // - INTERNATIONAL for any other country code or missing local indicators
      const cleanedPhone = phone.trim().replace(/\s+/g, '');
      let assignedTier = 'INTERNATIONAL';

      if (cleanedPhone.startsWith('+255') || (cleanedPhone.startsWith('0') && cleanedPhone.length === 10)) {
        assignedTier = 'CITIZEN'; // Or 'RESIDENT' depending on secondary profile checks
      } else {
        assignedTier = 'INTERNATIONAL';
      }

      // 4. Create or update profile record with verification details & correct tier
      const { error: profileError } = await (supabase.from('profiles') as any)
        .upsert({
          id: user.id,
          full_name: fullName,
          phone: phone,
          passport_url: passportUrl,
          tier: assignedTier,
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Profile creation error:', profileError.message);
      }

      setSuccessMsg('Account created successfully! You can now sign in.');
      setIsSignUp(false);
      setLoading(false);
    } else {
      // Sign In Flow
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        setError(authError?.message || 'Invalid login credentials. Please check your email or password.');
        setLoading(false);
        return;
      }

      const user = authData.user;

      // Fetch verified user tier from profiles table
      const { data: profileData } = await supabase
        .from('profiles')
        .select('tier')
        .eq('id', user.id)
        .single();

      const userTier = profileData?.tier || user.user_metadata?.tier || 'INTERNATIONAL';

      setLoading(false);
      onSuccess(user, userTier);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 -z-10" />
      <div className="absolute w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -top-10 left-1/2 -translate-x-1/2" />

      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Compass size={140} />
        </div>

        <div className="text-center mb-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider mb-3 shadow-inner">
            <ShieldCheck size={14} /> {isSignUp ? 'Client Registration' : 'Secure Access'}
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {isSignUp ? 'Create Account' : 'Client Portal Sign In'}
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {isSignUp 
              ? 'Register with your phone & passport for tier verification.' 
              : 'Access your personalized safari roadmap and bookings.'}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-xs">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-xs">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4 relative z-10">
          {isSignUp && (
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ndashimye Masebu"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition-all shadow-inner"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="explorer@escapetourstz.com"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 pl-11 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition-all shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 pl-11 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition-all shadow-inner"
              />
            </div>
          </div>

          {isSignUp && (
            <>
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
                  Phone Number (Country code determines tier)
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+255... or +1... / +44..."
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 pl-11 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition-all shadow-inner"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1 pl-1">
                  * Use +255 for Tanzanian Citizen/Resident rates, or international formats for global rates.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
                  Passport Upload (Verification)
                </label>
                <div className="relative flex items-center justify-between w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 shadow-inner">
                  <div className="flex items-center gap-2 truncate">
                    <Upload size={16} className="text-amber-400 shrink-0" />
                    <span className="truncate">{passportFile ? passportFile.name : 'Upload passport image or PDF'}</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setPassportFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin text-slate-950" size={18} />
            ) : (
              <>
                <span>{isSignUp ? 'Complete Registration' : 'Access Dashboard'}</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center relative z-10">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setSuccessMsg(null);
            }}
            className="text-xs text-slate-400 hover:text-amber-400 font-bold transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAuthPortal;