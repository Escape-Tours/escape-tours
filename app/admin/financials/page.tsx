// app/admin/financials/page.tsx
'use client';

import { useState } from 'react';

export default function AdminFinancialsPage() {
  const [ledgers] = useState([
    { id: 'L-001', itinerary: 'Serengeti Safari', total: 12000, status: 'PARTIAL', balanceDue: 4000, updated: '2026-06-15' },
    { id: 'L-002', itinerary: 'Ngorongoro Trek', total: 8500, status: 'PAID', balanceDue: 0, updated: '2026-06-14' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Financial Ledger Audit</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800">
            Export Report
          </button>
        </div>
      </div>

      {/* Audit Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm text-slate-500">Total Outstanding</p>
          <p className="text-2xl font-bold text-red-600">$4,000</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Itinerary</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Total</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Balance Due</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ledgers.map((ledger) => (
              <tr key={ledger.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium">{ledger.itinerary}</td>
                <td className="px-6 py-4">${ledger.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    ledger.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {ledger.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">${ledger.balanceDue.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <button className="text-emerald-600 font-semibold text-sm hover:underline">
                    View Details
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