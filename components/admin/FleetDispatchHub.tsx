// components/admin/FleetDispatchHub.tsx
"use client";

import { useState } from "react";

const SAFARI_LOCATIONS = [
  "Mikumi Gate",
  "Seronera Airstrip",
  "Ngorongoro Crater Rim",
  "Tarangire Main Gate",
  "Lake Manyara National Park",
  "Nyerere National Park (Selous)",
  "Arusha National Park",
  "Ruaha National Park",
] as const;

type SafariLocation = (typeof SAFARI_LOCATIONS)[number];

interface DispatchEntry {
  id: string;
  vehicleName: string;
  location: SafariLocation | string;
  assignedDriver: string;
  tcaaDroneId: string;
  status: "DISPATCHED" | "STANDBY" | "IN_TRANSIT";
}

export default function FleetDispatchHub() {
  const [dispatches, setDispatches] = useState<DispatchEntry[]>([
    {
      id: "1",
      vehicleName: "CRUISER-04 (Mikumi)",
      location: "Mikumi Gate",
      assignedDriver: "Charles Geofrey",
      tcaaDroneId: "TCAA-AV2-881",
      status: "DISPATCHED",
    },
    {
      id: "2",
      vehicleName: "CRUISER-09 (Serengeti)",
      location: "Seronera Airstrip",
      assignedDriver: "Juma Kassim",
      tcaaDroneId: "TCAA-AV2-902",
      status: "STANDBY",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleName: "",
    location: SAFARI_LOCATIONS[0] as string,
    assignedDriver: "",
    tcaaDroneId: "",
    status: "STANDBY" as const,
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: DispatchEntry = {
      id: Date.now().toString(),
      ...formData,
    };
    setDispatches([newEntry, ...dispatches]);
    setIsOpen(false);
    setFormData({
      vehicleName: "",
      location: SAFARI_LOCATIONS[0],
      assignedDriver: "",
      tcaaDroneId: "",
      status: "STANDBY",
    });
  };

  return (
    <div className="p-6 bg-[#121212] text-white rounded-xl border border-zinc-800">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-wide">LIVE FLEET & TCAA DRONE DISPATCH CENTER</h2>
          <p className="text-xs text-zinc-400">Track 4x4 safari cruisers across expanded Tanzanian parks and DJI Avata 2 compliance.</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg text-sm transition cursor-pointer"
        >
          + Manual Dispatch Entry
        </button>
      </div>

      {/* Dispatch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dispatches.map((item) => (
          <div key={item.id} className="bg-[#1a1a1a] border border-zinc-800 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="font-bold text-sm">{item.vehicleName}</span>
                <p className="text-xs text-zinc-400">Assigned Driver: {item.assignedDriver}</p>
              </div>
              <span
                className={`text-[10px] px-2 py-1 rounded font-semibold ${
                  item.status === "DISPATCHED" ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-amber-950 text-amber-400 border border-amber-800"
                }`}
              >
                {item.status}
              </span>
            </div>
            <div className="flex justify-between items-end text-xs pt-3 border-t border-zinc-800 text-zinc-300">
              <span>Location: {item.location}</span>
              <span className="font-mono text-amber-400">Drone ID: {item.tcaaDroneId}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Entry Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#18181b] border border-zinc-700 w-full max-w-lg p-6 rounded-2xl shadow-2xl">
            <h3 className="text-lg font-bold mb-4 text-white">Manual Fleet & Drone Lodging</h3>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Vehicle / Cruiser Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CRUISER-12 (Ngorongoro)"
                  value={formData.vehicleName}
                  onChange={(e) => setFormData({ ...formData, vehicleName: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Location / Hub</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-amber-500 outline-none"
                >
                  {SAFARI_LOCATIONS.map((loc: string) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Assigned Driver</label>
                <input
                  type="text"
                  required
                  placeholder="Driver Full Name"
                  value={formData.assignedDriver}
                  onChange={(e) => setFormData({ ...formData, assignedDriver: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">TCAA Drone ID (DJI Avata 2)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TCAA-AV2-999"
                  value={formData.tcaaDroneId}
                  onChange={(e) => setFormData({ ...formData, tcaaDroneId: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-amber-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Initial Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-amber-500 outline-none"
                >
                  <option value="STANDBY">STANDBY</option>
                  <option value="DISPATCHED">DISPATCHED</option>
                  <option value="IN_TRANSIT">IN TRANSIT</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg text-sm transition cursor-pointer"
                >
                  Save Dispatch Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}