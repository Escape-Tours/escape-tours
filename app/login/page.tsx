// app/login/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Lock, Mail, KeyRound, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      router.push('/user-hub');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-700/80 rounded-3xl p-8 space-y-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3 relative z-10">
          <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-inner">
            <ShieldCheck size={32} />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest bg-amber-950 text-amber-300 border border-amber-700/60 px-3 py-1 rounded-full font-bold">
            Escape+ Client Portal
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">Vault Authentication</h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Enter your credentials to access your private traveler dashboard and custom itineraries.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              Account Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="explorer@escapetourstz.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-800/60 text-red-300 text-xs p-3 rounded-xl">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-xl transition text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <>Sign In to User Hub <ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center relative z-10">
          <button 
            onClick={() => router.push('/')}
            className="text-xs text-slate-400 hover:text-white transition font-medium"
          >
            ← Return to Escape Tours Home
          </button>
        </div>

      </div>
    </div>
  );
}