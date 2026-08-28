// components/admin/AdminHeader.tsx
export const AdminHeader = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      {/* Removed Logo: Global Nav already handles branding */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-slate-800">Admin Hub</span>
        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded">Management</span>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">Administrator</span>
        <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300" />
      </div>
    </header>
  );
};