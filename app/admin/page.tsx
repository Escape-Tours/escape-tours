'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTaskSync } from '@/lib/hooks/useTaskSync';
import { LayoutGrid, AlertTriangle, ShieldCheck, RefreshCw, ChevronRight, Activity, Phone, FileText, Loader2 } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  passport_url: string | null;
  tier: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const { status: systemStatus, isLoading } = useTaskSync('system-health');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users'>('dashboard');
  
  // Real-time metrics & user states
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProfiles = async () => {
    setUserLoading(true);
    const supabase = createClient();
    // Use type assertion to bypass strict generic table definitions if types are out of sync
    const { data, error } = await (supabase.from('profiles') as any)
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setProfiles(data || []);
    }
    setUserLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const updateTier = async (userId: string, newTier: string) => {
    setActionLoading(userId);
    const supabase = createClient();
    
    const { error } = await (supabase.from('profiles') as any)
      .update({ tier: newTier, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      alert('Error updating residency tier: ' + error.message);
    } else {
      setProfiles(profiles.map(p => p.id === userId ? { ...p, tier: newTier } : p));
    }
    setActionLoading(null);
  };

  // Calculate live metrics dynamically from database data
  const totalUsers = profiles.length;
  const pendingPassports = profiles.filter(p => !p.passport_url).length;

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Header with Global Status & Tab Switcher */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Mission Control</h1>
          <p className="text-slate-500 mt-1">Full-stack visibility across the Safari Odyssey ecosystem.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-200/60 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${activeTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              User Management ({totalUsers})
            </button>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${isLoading ? 'bg-amber-400' : 'bg-emerald-500'} animate-pulse`} />
            <span className="text-sm font-semibold text-slate-700">System {isLoading ? 'Syncing...' : 'Operational'}</span>
          </div>
        </div>
      </div>

      {/* KPI Triage Grid (Real-time Data) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard label="Total Registered Users" value={totalUsers.toString()} icon={<LayoutGrid size={20} />} trend="Live DB Sync" />
        <MetricCard label="Pending Verification" value={pendingPassports.toString()} icon={<Activity size={20} />} color="amber" action="Review" onClick={() => setActiveTab('users')} />
        <MetricCard label="Errors" value="0" icon={<AlertTriangle size={20} />} color="emerald" action="All Clear" />
        <MetricCard label="Uptime" value="99.9%" icon={<ShieldCheck size={20} />} color="emerald" />
      </div>

      {/* Conditional View: Dashboard Overview vs User Management Panel */}
      {activeTab === 'dashboard' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-lg text-slate-900">Real-Time User Activity Stream</h2>
              <button 
                onClick={() => { setIsRefreshing(true); fetchProfiles(); }} 
                className="p-2 hover:bg-slate-50 rounded-lg transition"
              >
                <RefreshCw size={18} className={isRefreshing ? 'animate-spin text-amber-500' : 'text-slate-600'} />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {profiles.slice(0, 5).map((profile) => (
                <div key={profile.id} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{profile.full_name || 'Anonymous Client'}</p>
                    <p className="text-xs text-slate-500">Residency Tier: <span className="font-semibold text-amber-600">{profile.tier || 'CITIZEN'}</span> | Phone: {profile.phone || 'N/A'}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              ))}
              {profiles.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">No recent activity detected.</div>
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <button onClick={() => setActiveTab('users')} className="w-full text-left bg-slate-800 p-4 rounded-xl font-medium hover:bg-slate-700 transition flex items-center justify-between">
                  <span>Manage Residency Tiers & Passports</span>
                  <ChevronRight size={16} />
                </button>
                <button onClick={() => fetchProfiles()} className="w-full text-left bg-slate-800 p-4 rounded-xl font-medium hover:bg-slate-700 transition flex items-center justify-between">
                  <span>Sync Database Records</span>
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-400">
              Escape Tours & Safaris • Secured Mission Control
            </div>
          </div>
        </div>
      ) : (
        /* Dedicated User Management & Verification Panel */
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="font-extrabold text-xl text-slate-900">Client Verification & Residency Tiers</h2>
              <p className="text-xs text-slate-500 mt-1">Review live client credentials, inspect uploaded passports, and manage pricing/residency tiers.</p>
            </div>
            <button 
              onClick={fetchProfiles} 
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              <RefreshCw size={14} className={userLoading ? 'animate-spin' : ''} />
              <span>Refresh List</span>
            </button>
          </div>

          {error && (
            <div className="m-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-50">
                  <th className="p-4">Client Name</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Passport Document</th>
                  <th className="p-4">Residency Tier</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{profile.full_name || 'Unnamed Client'}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{profile.id}</div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Phone size={14} className="text-amber-500 shrink-0" />
                        <span>{profile.phone || 'Not provided'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {profile.passport_url ? (
                        <a
                          href={profile.passport_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 font-bold hover:bg-blue-100 transition-all"
                        >
                          <FileText size={14} />
                          <span>View Passport</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">No passport uploaded</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        profile.tier === 'CITIZEN' ? 'bg-emerald-100 border border-emerald-200 text-emerald-700' :
                        profile.tier === 'RESIDENT' ? 'bg-purple-100 border border-purple-200 text-purple-700' :
                        profile.tier === 'INTERNATIONAL' ? 'bg-amber-100 border border-amber-200 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {profile.tier || 'CITIZEN'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={actionLoading === profile.id}
                          onClick={() => updateTier(profile.id, 'CITIZEN')}
                          className={`px-2.5 py-1.5 rounded-xl font-bold text-[9px] uppercase tracking-wider transition-all ${
                            profile.tier === 'CITIZEN' ? 'bg-emerald-500 text-white font-black' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          Citizen
                        </button>
                        <button
                          disabled={actionLoading === profile.id}
                          onClick={() => updateTier(profile.id, 'RESIDENT')}
                          className={`px-2.5 py-1.5 rounded-xl font-bold text-[9px] uppercase tracking-wider transition-all ${
                            profile.tier === 'RESIDENT' ? 'bg-purple-600 text-white font-black' : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
                          }`}
                        >
                          Resident
                        </button>
                        <button
                          disabled={actionLoading === profile.id}
                          onClick={() => updateTier(profile.id, 'INTERNATIONAL')}
                          className={`px-2.5 py-1.5 rounded-xl font-bold text-[9px] uppercase tracking-wider transition-all ${
                            profile.tier === 'INTERNATIONAL' ? 'bg-amber-500 text-white font-black' : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                          }`}
                        >
                          International
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {profiles.length === 0 && !userLoading && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400">
                      No client profiles found in the database.
                    </td>
                  </tr>
                )}
                {userLoading && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400">
                      <Loader2 className="animate-spin inline-block text-amber-500 mr-2" size={18} /> Loading database records...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, icon, color = 'slate', trend, action, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm ${onClick ? 'cursor-pointer hover:border-amber-400 transition-all' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg text-slate-500">{icon}</div>
        {action && <span className="text-[10px] uppercase font-bold text-slate-400 hover:text-slate-900">{action}</span>}
      </div>
      <p className="text-3xl font-extrabold text-slate-900">{value}</p>
      <p className="text-sm font-medium text-slate-500 mt-1">{label}</p>
      {trend && <p className="text-[10px] font-bold text-emerald-600 mt-2">{trend}</p>}
    </div>
  );
}