// app/admin/layout.tsx
'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Sparkles, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-stone-950 text-stone-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-stone-950/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-72 bg-stone-900 border-r border-amber-500/20 flex flex-col flex-shrink-0 shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-amber-500/10 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Sparkles size={16} />
            </div>
            <div>
              <span className="text-sm font-serif font-bold text-stone-100 tracking-wide block">Admin Hub</span>
              <span className="text-[9px] font-serif uppercase tracking-[0.2em] text-amber-400/80">Escape Tours</span>
            </div>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-stone-400 hover:text-stone-100 p-1"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <Sidebar />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-stone-950">
        <div className="flex items-center bg-stone-950 border-b border-amber-500/10 md:border-none">
          {/* Mobile Menu Trigger Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-4 text-amber-400 hover:text-amber-300 focus:outline-none"
            aria-label="Open Sidebar"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1">
            <AdminHeader />
          </div>
        </div>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-stone-950 via-stone-900/40 to-stone-950">
          {children}
        </main>
      </div>
    </div>
  );
}