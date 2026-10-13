'use client';

import dynamic from 'next/dynamic';

const EscapesClientGrid = dynamic(
  () => import('@/components/hotel/EscapesClientGrid'),
  { ssr: false, loading: () => <GridLoading /> }
);

interface EscapesPageClientProps {
  hotels: any[];
}

export default function EscapesPageClient({ hotels }: EscapesPageClientProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pt-20 sm:pt-28 pb-16 sm:pb-20 px-3 sm:px-6 md:px-12 selection:bg-pink-500 selection:text-white overflow-x-hidden w-full box-border">
      <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <Header />
        <EscapesClientGrid hotels={hotels} />
      </div>
    </main>
  );
}

function Header() {
  return (
    <div className="mb-6 sm:mb-12 text-center md:text-left relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-pink-500/30 p-4 sm:p-8 md:p-10 shadow-2xl w-full box-border">
      <div className="relative z-10 space-y-2 sm:space-y-3 w-full max-w-full">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] sm:text-xs font-black tracking-wider uppercase">
          The ESCAPE + VISION Collection
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-white tracking-tight leading-tight break-words">
          Visionary Escapes
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed font-light break-words">
          Redefining luxury through the ESCAPE + VISION lens. Authentic, profound, and meticulously curated with live residency pricing tiers.
        </p>
      </div>
    </div>
  );
}

function GridLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 animate-pulse w-full">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-72 sm:h-80 md:h-96 bg-slate-900 border border-white/10 rounded-2xl w-full" />
      ))}
    </div>
  );
}