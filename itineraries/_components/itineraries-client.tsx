"use client";

import { useState, useEffect, useMemo } from 'react';
import Navigation from "@/components/";
import  from "@/components/footer";
import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Calendar, DollarSign, AlertCircle } from "lucide-react";
import { TOURS } from "@/lib/data/tours";
import { PricingEngine } from "@/utils/PricingEngine";
import { ResidencyTier } from "@/types/tariffs";
import { FilterBar } from "@/components/filter-bar";

const PESAPAL_BOOKING_URL = "https://store.pesapal.com/escapetours";

export function ItinerariesClient() {
    const [tier, setTier] = useState<ResidencyTier>(ResidencyTier.INTERNATIONAL);
    const [activeCategory, setActiveCategory] = useState('All');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('residency-tier='))
            ?.split('=')[1];

        if (cookie === 'resident') setTier(ResidencyTier.RESIDENT);
        else if (cookie === 'citizen') setTier(ResidencyTier.CITIZEN);
        else setTier(ResidencyTier.INTERNATIONAL);
    }, []);

    // Derive categories and filtered list
    const categories = useMemo(() => Array.from(new Set(TOURS.map(t => t.category))), []);

    const filteredTours = useMemo(() => {
        return activeCategory === 'All'
            ? TOURS
            : TOURS.filter(t => t.category === activeCategory);
    }, [activeCategory]);

    const handleBookNow = () => window.open(PESAPAL_BOOKING_URL, "_blank");

    const getTourPrice = (tourId: string, defaultPrice: number) => {
        if (!isClient) return defaultPrice;
        try {
            return PricingEngine.calculateParkFees(tourId, tier, 1).amount;
        } catch (e) {
            return defaultPrice;
        }
    };

    return (
        <div className="min-h-screen">
           
            <main className="pt-20">
                <section className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center bg-gradient-to-r from-brand-dark to-brand-green">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">Safari Packages</h1>
                        <p className="text-lg md:text-xl text-white/90">
                            {tier !== ResidencyTier.INTERNATIONAL ? "Special Rates Applied" : "Carefully crafted adventures across Tanzania"}
                        </p>
                    </div>
                </section>

                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <FilterBar
                            categories={categories}
                            activeCategory={activeCategory}
                            onFilterChange={setActiveCategory}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {filteredTours.map((tour) => (
                                <Card key={tour.id} className="overflow-hidden hover:shadow-2xl transition-all">
                                    <div className="relative h-64 w-full">
                                        <Image src={tour.image} alt={tour.shortTitle} fill className="object-cover" />
                                        <div className="absolute top-4 right-4">
                                            <Badge className="bg-brand-orange text-white">
                                                From ${getTourPrice(tour.id, tour.price)}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-black text-brand-dark">{tour.shortTitle}</CardTitle>
                                        <CardDescription>{tour.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-4 mb-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1"><Calendar className="h-4" /> <span>{tour.duration}</span></div>
                                            <div className="flex items-center gap-1"><DollarSign className="h-4" /> <span>From ${getTourPrice(tour.id, tour.price)}</span></div>
                                        </div>
                                        {"requiresPermit" in tour && (
                                            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 p-2 rounded text-xs font-bold border border-amber-200">
                                                <AlertCircle className="h-4 w-4" /> Mandatory Permit Required
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="flex gap-3">
                                        <Button asChild className="flex-1 bg-brand-dark text-white"><Link href={`/packages/${tour.id}`}>View Package</Link></Button>
                                        <Button onClick={handleBookNow} className="flex-1 bg-brand-orange text-white">Book Now</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
                < />
                <WhatsAppFloat />
            </main>
        </div>
    );
}