// app/admin/vendors/page.tsx
'use client';

import { useState } from 'react';

export default function VendorViewPage() {
  const [vendors] = useState([
    { id: 'v-001', name: 'Marera Partners', status: 'Active', pendingTasks: 2, lastActive: '2h ago', reliability: '98%' },
    { id: 'v-002', name: 'Crater Safaris', status: 'Action Required', pendingTasks: 5, lastActive: '1d ago', reliability: '85%' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Vendor Partner Portal</h1>
          <p className="text-slate-500 mt-1">Audit and monitor partner fulfillment and transparency.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700">
          + Onboard New Vendor
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Vendor Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Reliability</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Pending Tasks</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Last Active</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{vendor.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                    vendor.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {vendor.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-slate-600">{vendor.reliability}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{vendor.pendingTasks}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{vendor.lastActive}</td>
                <td className="px-6 py-4">
                  <button className="text-emerald-600 font-semibold text-sm hover:underline">
                    View Logs
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}