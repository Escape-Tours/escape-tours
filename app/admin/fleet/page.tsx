// app/admin/fleet/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Compass, 
  Crown, 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  MapPin, 
  UserCheck, 
  Truck, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  X
} from 'lucide-react';

interface FleetDispatchRecord {
  id: string;
  vehicle_id: string;
  asset_code: string;
  location: string;
  driver: string;
  tcaa_auth?: string | null;
  status: 'DISPATCHED' | 'STANDBY' | 'MAINTENANCE';
}

const TANZANIA_LOCATIONS = [
  'Ngorongoro Crater',
  'Ngorongoro Conservation Area',
  'Serengeti National Park (Seronera)',
  'Mikumi Gate',
  'Tarangire National Park',
  'Lake Manyara National Park',
  'Arusha Headquarters',
  'Zanzibar Base'
];

export default function FleetAndDronesDispatchHub() {
  const [fleetRecords, setFleetRecords] = useState<FleetDispatchRecord[]>([
    { id: '1', vehicle_id: 'F-01', asset_code: 'CRUISER-04 (Mikumi)', location: 'Mikumi Gate', driver: 'Charles Geofrey', tcaa_auth: 'TCAA-AV2-881', status: 'DISPATCHED' },
    { id: '2', vehicle_id: 'F-02', asset_code: 'CRUISER-09 (Serengeti)', location: 'Seronera Airstrip', driver: 'Juma Kassim', tcaa_auth: 'TCAA-AV2-902', status: 'STANDBY' },
    { id: '3', vehicle_id: 'F-03', asset_code: 'CRUISER-12 (Ngorongoro)', location: 'Ngorongoro Crater', driver: 'Baraka Mallya', tcaa_auth: null, status: 'DISPATCHED' }
  ]);

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state for manual entries
  const [vehicleId, setVehicleId] = useState('');
  const [assetCode, setAssetCode] = useState('');
  const [location, setLocation] = useState(TANZANIA_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [driver, setDriver] = useState('');
  const [tcaaAuth, setTcaaAuth] = useState('');
  const [status, setStatus] = useState<'DISPATCHED' | 'STANDBY' | 'MAINTENANCE'>('DISPATCHED');

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !assetCode || !driver) return;

    const finalLocation = location === 'Custom' ? customLocation : location;

    const newRecord: FleetDispatchRecord = {
      id: Date.now().toString(),
      vehicle_id: vehicleId.toUpperCase(),
      asset_code: assetCode,
      location: finalLocation || 'Ngorongoro Crater',
      driver,
      tcaa_auth: tcaaAuth.trim() ? tcaaAuth.trim() : null, // Optional drone auth
      status
    };

    setFleetRecords([newRecord, ...fleetRecords]);
    resetForm();
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setVehicleId('');
    setAssetCode('');
    setLocation(TANZANIA_LOCATIONS[0]);
    setCustomLocation('');
    setDriver('');
    setTcaaAuth('');
    setStatus('DISPATCHED');
  };

  const handleDelete = (id: string) => {
    setFleetRecords(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-zinc-950 text-stone-100 p-6 md:p-10 selection:bg-amber-400 selection:text-stone-950">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-stone-900/80 p-6 sm:p-8 rounded-[2.5rem] border border-amber-500/25 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/40 rounded-2xl shadow-inner">
              <Truck size={32} className="text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-serif uppercase tracking-[0.3em] text-amber-400 font-semibold">Escape Tours & Safaris</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[9px] font-serif text-amber-300 uppercase tracking-widest flex items-center gap-1">
                  <Crown size={10} /> Unified Command
                </span>
              </div>
              <h1 className="text-3xl font-serif font-bold text-stone-100 tracking-wide mt-1">Fleet & TCAA Drone Dispatch Hub</h1>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-serif font-bold text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>New Manual Dispatch</span>
          </button>
        </div>

        {/* Fleet Table */}
        <div className="bg-stone-900/90 border border-amber-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="p-6 sm:p-8 border-b border-amber-500/20 flex justify-between items-center bg-stone-950/40">
            <div>
              <h2 className="font-serif font-extrabold text-xl text-stone-100 uppercase tracking-widest">Active Dispatch Manifest</h2>
              <p className="text-xs text-stone-400 font-serif mt-1">Manage safari cruisers, wilderness deployments, and optional TCAA aerial drone authorisations.</p>
            </div>
            <span className="text-xs font-serif text-amber-400 font-bold bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 flex items-center gap-1.5">
              <Sparkles size={12} /> {fleetRecords.length} Units Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-amber-500/20 text-[10px] font-serif font-extrabold uppercase tracking-widest text-amber-400 bg-stone-950/60">
                  <th className="p-5">Vehicle ID</th>
                  <th className="p-5">Cruiser / Asset Code</th>
                  <th className="p-5">Current Location</th>
                  <th className="p-5">Assigned Driver</th>
                  <th className="p-5">TCAA Drone Auth</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-xs font-serif">
                {fleetRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="p-5 font-bold text-stone-100 font-mono">{record.vehicle_id}</td>
                    <td className="p-5 text-stone-300 font-bold">{record.asset_code}</td>
                    <td className="p-5 text-stone-300 flex items-center gap-1.5 pt-6">
                      <MapPin size={13} className="text-amber-400 shrink-0" />
                      <span>{record.location}</span>
                    </td>
                    <td className="p-5 text-stone-200">{record.driver}</td>
                    <td className="p-5">
                      {record.tcaa_auth ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
                          <ShieldCheck size={12} /> {record.tcaa_auth}
                        </span>
                      ) : (
                        <span className="text-stone-500 italic text-[10px] uppercase tracking-wider">No Drone Assigned</span>
                      )}
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                        record.status === 'DISPATCHED' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' : 
                        record.status === 'STANDBY' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' :
                        'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {record.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="p-2 bg-stone-950 hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 rounded-xl border border-stone-800 transition cursor-pointer"
                        title="Delete Dispatch Entry"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
                {fleetRecords.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-16 text-center text-stone-500 font-serif">
                      No active fleet dispatches logged. Use manual entry to add units.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manual Entry Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
            <div className="bg-stone-900 border border-amber-500/30 w-full max-w-xl rounded-[2.5ref] p-8 shadow-2xl relative space-y-6">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-100 bg-stone-950 rounded-full border border-stone-800 transition"
              >
                <X size={18} />
              </button>

              <div>
                <span className="text-[10px] font-serif uppercase tracking-[0.3em] text-amber-400 font-semibold">Manual Dispatch Entry</span>
                <h3 className="text-2xl font-serif font-bold text-stone-100 mt-1">Configure Fleet & Drone Unit</h3>
              </div>

              <form onSubmit={handleAddEntry} className="space-y-4 font-serif text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-400 uppercase tracking-wider mb-1">Vehicle ID *</label>
                    <input
                      type="text"
                      placeholder="e.g. F-04"
                      value={vehicleId}
                      onChange={(e) => setVehicleId(e.target.value)}
                      required
                      className="w-full bg-stone-950 border border-amber-500/20 rounded-xl p-3 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 uppercase tracking-wider mb-1">Asset Code / Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. CRUISER-15 (Ngorongoro)"
                      value={assetCode}
                      onChange={(e) => setAssetCode(e.target.value)}
                      required
                      className="w-full bg-stone-950 border border-amber-500/20 rounded-xl p-3 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-400 uppercase tracking-wider mb-1">Location *</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-stone-950 border border-amber-500/20 rounded-xl p-3 text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    {TANZANIA_LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                    <option value="Custom">Other Custom Location...</option>
                  </select>
                </div>

                {location === 'Custom' && (
                  <div>
                    <label className="block text-stone-400 uppercase tracking-wider mb-1">Custom Location Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ndutu Special Area"
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      required
                      className="w-full bg-stone-950 border border-amber-500/20 rounded-xl p-3 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-stone-400 uppercase tracking-wider mb-1">Assigned Driver *</label>
                  <input
                    type="text"
                    placeholder="e.g. Daudi Omari"
                    value={driver}
                    onChange={(e) => setDriver(e.target.value)}
                    required
                    className="w-full bg-stone-950 border border-amber-500/20 rounded-xl p-3 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 uppercase tracking-wider mb-1">
                    TCAA Drone Authorization <span className="text-stone-500 lowercase font-normal">(optional - leave blank if no drone)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TCAA-AV2-995"
                    value={tcaaAuth}
                    onChange={(e) => setTcaaAuth(e.target.value)}
                    className="w-full bg-stone-950 border border-amber-500/20 rounded-xl p-3 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-stone-950 border border-amber-500/20 rounded-xl p-3 text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="DISPATCHED">Dispatched</option>
                    <option value="STANDBY">Standby</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-stone-950 hover:bg-stone-800 text-stone-300 rounded-xl border border-stone-800 transition uppercase tracking-widest font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl transition uppercase tracking-widest font-bold shadow-lg"
                  >
                    Save Dispatch Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}