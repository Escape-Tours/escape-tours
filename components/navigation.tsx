"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Wand2, User, Store, Gift, LogOut, ShieldCheck, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";
import { useItineraryStore } from "@/store/useItineraryStore";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [safariDropdownOpen, setSafariDropdownOpen] = useState(false);
  const [trekkingDropdownOpen, setTrekkingDropdownOpen] = useState(false);
  const [userHubDropdownOpen, setUserHubDropdownOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Zustand Store for Itinerary Cart Items
  const { items, removeItem, clearItinerary } = useItineraryStore();
  const [animatingBadge, setAnimatingBadge] = useState(false);

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

  // Trigger bounce animation when cart items change
  useEffect(() => {
    if (items.length > 0) {
      setAnimatingBadge(true);
      const timer = setTimeout(() => setAnimatingBadge(false), 600);
      return () => clearTimeout(timer);
    }
  }, [items.length]);

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

              {/* Itinerary Cart Trigger Button with Animation */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-md hover:bg-amber-600 transition-all ${
                  animatingBadge ? "scale-110 ring-4 ring-amber-300" : ""
                }`}
              >
                <ShoppingBag size={15} />
                <span>Itinerary Cart</span>
                {items.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-amber-300 border border-amber-500 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold animate-bounce">
                    {items.length}
                  </span>
                )}
              </button>

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
      </nav>

      {/* Slide-Over Itinerary Cart Drawer */}
      <AnimatePresence>
        {cartDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setCartDrawerOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer Content */}
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }} 
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-amber-50/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500 text-white">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-[#41210a]">Itinerary Cart</h2>
                    <p className="text-xs text-gray-500">{items.length} items picked for your trip</p>
                  </div>
                </div>
                <button onClick={() => setCartDrawerOpen(false)} className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-600 font-bold">Your itinerary cart is empty</p>
                    <p className="text-xs text-gray-400 mt-1">Browse hotels, safaris, or parks and click "Add to Itinerary" to build your custom adventure.</p>
                  </div>
                ) : (
                  items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">
                          {item.item_type || 'Selected Experience'}
                        </span>
                        <h4 className="font-bold text-sm text-[#41210a] mt-1">{item.title || item.name || item.item_name}</h4>
                        <p className="text-xs text-gray-500 font-medium">{item.price ? `$${item.price}` : 'Live Rate Custom'}</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id || item.item_id)}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Actions */}
              {items.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-3">
                  <Button asChild className="w-full bg-[#d97706] hover:bg-[#b45309] text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2">
                    <Link href="/itinerary-builder" onClick={() => setCartDrawerOpen(false)}>
                      <span>Build Itinerary From Cart</span>
                      <ArrowRight size={18} />
                    </Link>
                  </Button>
                  <button 
                    onClick={clearItinerary}
                    className="w-full text-center text-xs text-red-500 font-bold hover:underline py-1"
                  >
                    Clear All Items
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}