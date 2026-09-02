// app/admin/layout.tsx
import { Sidebar } from '@/components/admin/Sidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Sparkles } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-stone-950 text-stone-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-stone-900 border-r border-amber-500/20 flex flex-col flex-shrink-0 shadow-2xl">
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
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <Sidebar />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-stone-950">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gradient-to-br from-stone-950 via-stone-900/40 to-stone-950">
          {children}
        </main>
      </div>
    </div>
  );
}