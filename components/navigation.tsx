"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Wand2, User, Store, Gift, LogOut, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [safariDropdownOpen, setSafariDropdownOpen] = useState(false);
  const [userHubDropdownOpen, setUserHubDropdownOpen] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/user-hub';
  };

  const navLinkClass = "text-[#41210a] hover:text-[#d97706] transition-all duration-300 font-bold text-sm tracking-wide uppercase";

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/escape-tours-logo.png"
                alt="Escape Tours"
                width={140}
                height={90}
                className="h-14 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/" className={navLinkClass}>Home</Link>
              <Link href="/about" className={navLinkClass}>About</Link>

              {/* Safaris Dropdown */}
              <div className="relative" onMouseEnter={() => setSafariDropdownOpen(true)} onMouseLeave={() => setSafariDropdownOpen(false)}>
                <button className={`flex items-center gap-1 ${navLinkClass}`}>Safaris <ChevronDown size={14} /></button>
                <AnimatePresence>
                  {safariDropdownOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 mt-2 z-50">
                      <Link href="/northern-circuit" className="block px-4 py-3 hover:bg-amber-50 hover:text-[#d97706] rounded-xl font-medium text-[#41210a] transition-colors">Northern Circuit</Link>
                      <Link href="/southern-circuit" className="block px-4 py-3 hover:bg-amber-50 hover:text-[#d97706] rounded-xl font-medium text-[#41210a] transition-colors">Southern Circuit</Link>
                      <Link href="/zanzibar" className="block px-4 py-3 hover:bg-amber-50 hover:text-[#d97706] rounded-xl font-medium text-[#41210a] transition-colors">Zanzibar</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Itinerary Builder */}
              <Link href="/itinerary-builder" className="flex items-center gap-2 bg-[#d97706]/10 text-[#d97706] px-3.5 py-2 rounded-full font-bold text-xs hover:bg-[#d97706] hover:text-white transition-all duration-300 border border-[#d97706]/20 shadow-sm">
                <Wand2 size={15} />
                BUILDER
              </Link>

              <Link href="/packages" className={navLinkClass}>Packages</Link>
              <Link href="/hotels" className={navLinkClass}>Hotels</Link>

              {/* Dynamic User Hub State */}
              {!loading && (
                user ? (
                  <div 
                    className="relative"
                    onMouseEnter={() => setUserHubDropdownOpen(true)}
                    onMouseLeave={() => setUserHubDropdownOpen(false)}
                  >
                    <Link 
                      href="/user-hub"
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-amber-500/50 text-amber-300 text-xs font-bold transition-all shadow-md hover:border-amber-400"
                    >
                      <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400">
                        <User size={12} />
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      </div>
                      <span className="max-w-[80px] truncate">{user.email?.split('@')[0]}</span>
                      <ChevronDown size={12} className="text-slate-400" />
                    </Link>

                    <AnimatePresence>
                      {userHubDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                          animate={{ opacity: 1, y: 0, scale: 1 }} 
                          exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                          transition={{ duration: 0.15 }}
                          className="absolute top-full right-0 w-56 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-3 mt-2 z-50"
                        >
                          <div className="px-3 py-2 border-b border-slate-800 mb-2">
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Active Session</p>
                            <p className="text-xs font-medium text-amber-300 truncate">{user.email}</p>
                          </div>
                          <Link href="/user-hub" className="flex items-center gap-2 px-3 py-2.5 hover:bg-slate-800 hover:text-amber-400 rounded-xl text-xs font-medium text-slate-200 transition-colors">
                            <ShieldCheck size={14} className="text-amber-400" />
                            <span>Client Portal Hub</span>
                          </Link>
                          <button 
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-red-500/10 hover:text-red-400 rounded-xl text-xs font-medium text-slate-300 text-left transition-colors mt-1 border-t border-slate-800/80"
                          >
                            <LogOut size={14} />
                            <span>Sign Out</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link 
                    href="/user-hub"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-200 hover:text-amber-400 text-xs font-bold transition-all shadow-sm"
                  >
                    <User size={14} className="text-amber-400" />
                    <span>User Hub</span>
                  </Link>
                )
              )}

              {/* Vendor & Lifestyle Hubs */}
              <Link href="/vendor-hub" className="p-2.5 rounded-xl bg-slate-900 text-pink-400 border border-slate-800 hover:border-pink-500/40 transition-all" title="Vendor Hub">
                <Store size={15} />
              </Link>

              <Link href="/lifestyle-hub" className="p-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-200 hover:bg-amber-200 transition-all" title="Lifestyle Hub">
                <Gift size={15} />
              </Link>

              {/* Driver Portal Link */}
              <Link href="/driver-portal" className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center gap-2 px-3.5" title="Driver Portal">
                <Truck size={15} />
                <span className="text-xs font-bold">Driver</span>
              </Link>

              {/* Enquire Button Restored to the Far Right */}
              <Button asChild className="bg-[#41210a] hover:bg-[#2a1606] text-white rounded-xl px-5 py-2 font-bold text-xs shadow-md">
                <Link href="/contact">ENQUIRE</Link>
              </Button>
            </div>

            {/* Mobile Toggle Button */}
            <button className="lg:hidden p-2 rounded-xl text-[#41210a] hover:bg-amber-50 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-3 shadow-lg"
            >
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-[#41210a] uppercase">Home</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-[#41210a] uppercase">About</Link>
              <Link href="/northern-circuit" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-[#41210a] uppercase">Northern Circuit Safaris</Link>
              <Link href="/southern-circuit" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-[#41210a] uppercase">Southern Circuit Safaris</Link>
              <Link href="/zanzibar" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-[#41210a] uppercase">Zanzibar Holidays</Link>
              <Link href="/packages" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-[#41210a] uppercase">Packages</Link>
              <Link href="/hotels" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-[#41210a] uppercase">Hotels</Link>
              
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <Link href="/itinerary-builder" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-amber-50 text-[#d97706] font-bold text-xs">
                  <Wand2 size={14} /> Builder
                </Link>
                <Link href="/user-hub" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900 text-amber-300 font-bold text-xs">
                  <User size={14} /> User Hub
                </Link>
                <Link href="/vendor-hub" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900 text-pink-400 font-bold text-xs">
                  <Store size={14} /> Vendor Hub
                </Link>
                <Link href="/lifestyle-hub" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs">
                  <Gift size={14} /> Lifestyle Hub
                </Link>
                <Link href="/driver-portal" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-bold text-xs col-span-2">
                  <Truck size={14} /> Driver Portal
                </Link>
              </div>

              <div className="pt-2">
                <Button asChild className="w-full bg-[#41210a] hover:bg-[#2a1606] text-white rounded-xl py-3 font-bold text-xs shadow-md">
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>ENQUIRE</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}