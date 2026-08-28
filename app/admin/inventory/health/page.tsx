// app/admin/inventory/health/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface HealthReport {
  id: string;
  itineraryId: string;
  issue: string;
  severity: 'high' | 'medium';
}

export default function InventoryHealthMonitor() {
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthStatus = async () => {
      setLoading(false);
      setReports([
        { id: '1', itineraryId: 'SAF-001', issue: 'Missing seasonal metadata', severity: 'high' },
        { id: '2', itineraryId: 'SAF-005', issue: 'Pricing engine mismatch', severity: 'medium' },
        { id: '3', itineraryId: 'SAF-009', issue: 'Outdated vendor tier', severity: 'medium' }
      ]);
    };

    fetchHealthStatus();
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedReports(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedReports(prev => 
      prev.length === reports.length ? [] : reports.map(r => r.id)
    );
  };
const handleBulkApprove = async () => {
    try {
      // Use 'as any' to bypass the type definition limit until your types are regenerated.
      // This tells TypeScript: "I know this function exists in the database."
      const { error } = await (supabase.rpc as any)('approve_itineraries', { 
        itinerary_ids: selectedReports 
      });

      if (error) throw error;

  // Update UI state
      setReports(prev => prev.filter(r => !selectedReports.includes(r.id)));
      setSelectedReports([]);
      alert("Successfully validated selected itineraries.");
    } catch (err) {
      console.error("Bulk approval failed:", err);
      alert("Failed to update status. Please check your connection.");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Health Monitor</h1>
        {selectedReports.length > 0 && (
          <button 
            onClick={handleBulkApprove}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Approve {selectedReports.length} Selected
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 w-12">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300" 
                  checked={selectedReports.length === reports.length && reports.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-4 font-semibold text-slate-700">Itinerary ID</th>
              <th className="p-4 font-semibold text-slate-700">Issue</th>
              <th className="p-4 font-semibold text-slate-700">Severity</th>
              <th className="p-4 font-semibold text-slate-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading reports...</td></tr>
            ) : reports.map((report) => (
              <tr key={report.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="p-4">
                  <input 
                    type="checkbox" 
                    checked={selectedReports.includes(report.id)}
                    onChange={() => toggleSelect(report.id)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </td>
                <td className="p-4 font-mono text-sm">{report.itineraryId}</td>
                <td className="p-4 text-slate-600">{report.issue}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    report.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {report.severity}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-emerald-600 font-semibold hover:underline">Resolve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}