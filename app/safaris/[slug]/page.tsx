"use client";

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ShieldCheck, MapPin, Sparkles, Clock, Hotel, Lock } from 'lucide-react';
import WhatsAppFloat from '@/components/whatsapp-float';
import { EXTENDED_SAFARI_PACKAGES, SafariPackage } from '@/lib/constants/itineraries';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function SafariDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  const [userTier, setUserTier] = useState<'INTERNATIONAL' | 'RESIDENT' | 'CITIZEN'>('INTERNATIONAL');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function checkAuthAndTier() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setIsAuthenticated(true);
          const { data: profile } = await supabase
            .from('profiles')
            .select('residency_tier')
            .eq('id', session.user.id)
            .single();

          if (profile?.residency_tier) {
            const tier = profile.residency_tier.toUpperCase();
            if (tier === 'RESIDENT' || tier === 'CITIZEN' || tier === 'INTERNATIONAL') {
              setUserTier(tier as any);
            }
          } else if (session.user.user_metadata?.residency_tier) {
            const metaTier = session.user.user_metadata.residency_tier.toUpperCase();
            if (metaTier === 'RESIDENT' || metaTier === 'CITIZEN' || metaTier === 'INTERNATIONAL') {
              setUserTier(metaTier as any);
            }
          }
        } else {
          setIsAuthenticated(false);
          setUserTier('INTERNATIONAL');
        }
      } catch (err) {
        console.error("Error checking session/tier:", err);
      } finally {
        setLoadingUser(false);
      }
    }

    checkAuthAndTier();
  }, []);

  const matchedPackage: SafariPackage | undefined = EXTENDED_SAFARI_PACKAGES.find(p => p.id === slug);

  if (!matchedPackage) {
    notFound();
  }

  const currentPricing = matchedPackage.pricing[userTier] || matchedPackage.pricing.INTERNATIONAL;
  const grandTotal = currentPricing.grandTotal;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Point this to your actual login route or User Hub modal trigger
      router.push('/login');
      return;
    }
    router.push(`/checkout?source=package&bookingId=${matchedPackage.id.toUpperCase()}&amount=${grandTotal}&tier=${userTier}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/packages" className="hover:text-orange-600 transition-colors">Packages</Link>
          <span>/</span>
          <span className="text-slate-900 truncate max-w-[250px]">{matchedPackage.title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white py-20 mt-4 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <div className="w-full lg:w-1/2 rounded-[2rem] overflow-hidden shadow-2xl relative h-[420px] border border-white/10 group">
            <Image
              src={matchedPackage.image_url || `/images/serengeti.jpg`}
              alt={matchedPackage.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <Badge className="bg-orange-600 text-white px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full shadow-lg shadow-orange-600/20">
              <Sparkles className="w-3.5 h-3.5 inline mr-1.5" /> {matchedPackage.circuit} Circuit Expedition
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
              {matchedPackage.title}
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed font-light">
              {matchedPackage.tagline}
            </p>
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  {isAuthenticated ? `${userTier} Price` : "Standard Price"}
                </p>
                <p className="text-2xl font-black text-orange-500 mt-1">
                  {loadingUser ? "..." : `$${grandTotal.toLocaleString()}`}
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Duration</p>
                <p className="text-lg font-bold text-white mt-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-500" /> {matchedPackage.duration_days} Days
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Starting Hub</p>
                <p className="text-sm font-bold text-white mt-1 truncate">
                  {matchedPackage.starting_hub}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Bar */}
      <section className="bg-white border-b border-slate-200/80 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-around gap-6 text-slate-800">
          <div className="flex items-center gap-3 font-semibold text-sm">
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm">
              <Check className="h-4 w-4" />
            </div>
            <span>Professional Driver-Guide & 4x4 Cruiser</span>
          </div>
          <div className="flex items-center gap-3 font-semibold text-sm">
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm">
              <Check className="h-4 w-4" />
            </div>
            <span>Full Board Lodge Accommodation</span>
          </div>
          <div className="flex items-center gap-3 font-semibold text-sm">
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm">
              <Check className="h-4 w-4" />
            </div>
            <span>Park Fees, VAT & Agency Included</span>
          </div>
        </div>
      </section>

      {/* Main Content & Itinerary Breakdown */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            
            {/* Accommodation Box */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                  <Hotel className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Accommodation & Logistics</h2>
                  <p className="text-sm text-slate-500">Verified properties and fully factored service components</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-amber-50/50 border border-orange-100/80 p-6 rounded-2xl space-y-2 shadow-sm">
                <span className="text-xs uppercase tracking-wider font-extrabold text-orange-600 bg-orange-100/80 px-3 py-1 rounded-full">
                  Primary Lodging Base
                </span>
                <p className="text-lg font-bold text-slate-900 mt-2">{matchedPackage.lodging_name}</p>
              </div>
            </div>

            {/* Day-by-Day Schedule */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Day-by-Day Expedition Schedule</h2>
                  <p className="text-sm text-slate-500">Detailed timeline of your adventure</p>
                </div>
              </div>
              
              <div className="space-y-8 border-l-2 border-orange-500/30 pl-6 ml-3 relative">
                {matchedPackage.days.map((day) => (
                  <div key={day.day_number} className="relative space-y-3 group">
                    <div className="absolute -left-[35px] top-0 bg-orange-600 text-white rounded-full h-7 w-7 flex items-center justify-center text-xs font-black shadow-md shadow-orange-600/30 ring-4 ring-white">
                      {day.day_number}
                    </div>
                    <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100 hover:border-orange-200 transition-colors space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Day {day.day_number}: {day.title}</h3>
                        {day.accommodation && (
                          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">
                            {day.accommodation}
                          </span>
                        )}
                      </div>
                      {day.bullets ? (
                        <ul className="space-y-2 text-slate-600 text-sm pl-4 list-disc">
                          {day.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                        </ul>
                      ) : (
                        <div className="space-y-2 text-sm text-slate-600">
                          {day.morning && <p><strong className="text-slate-900">Morning:</strong> {day.morning}</p>}
                          {day.afternoon && <p><strong className="text-slate-900">Afternoon:</strong> {day.afternoon}</p>}
                          {day.evening && <p><strong className="text-slate-900">Evening:</strong> {day.evening}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Secure Checkout Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sticky top-6 space-y-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Instant Reservation</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {isAuthenticated 
                    ? `Authenticated via User Hub. Tier verified: ${userTier}.` 
                    : "Sign in to your User Hub account to load your resident or citizen rate."}
                </p>
              </div>
              
              <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center justify-between shadow-inner">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                    {isAuthenticated ? `${userTier} Total` : "Standard Total"}
                  </span>
                  <span className="text-xs text-slate-400">All fees, VAT & lodging included</span>
                </div>
                <span className="text-3xl font-black text-orange-500">
                  {loadingUser ? "..." : `$${grandTotal.toLocaleString()}`}
                </span>
              </div>

              <Button 
                onClick={handleCheckout}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 text-base h-auto rounded-2xl shadow-xl shadow-orange-600/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                {isAuthenticated ? (
                  <>
                    <ShieldCheck className="mr-2" size={18} /> Book & Pay via PesaPal
                  </>
                ) : (
                  <>
                    <Lock className="mr-2" size={18} /> Sign In via User Hub
                  </>
                )}
              </Button>

              {!isAuthenticated && (
                <div className="text-center">
                  <Link href="/login" className="text-xs text-orange-600 font-bold hover:underline">
                    Access User Hub to sign in
                  </Link>
                </div>
              )}
              
              <div className="border-t border-slate-100 pt-4 text-center">
                <p className="text-xs text-slate-400 font-medium">
                  Secured via PesaPal API. Instant card and mobile money processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppFloat />
    </div>
  );
}