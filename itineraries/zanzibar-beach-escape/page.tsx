

import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Image } from "next/image"; // Corrected default import
import { Calendar, Users, DollarSign, Check, X, MapPin, Clock } from "lucide-react";

// SEO Metadata: Defined at the top (Server Component)
export const metadata = {
    title: "Zanzibar Island & Beach Relaxation Escape | Escape Tours",
    description: "10-day luxury Zanzibar escape: Stone Town, spice farms, and Nungwi beaches. Expertly guided tours for unforgettable memories.",
    alternates: { canonical: "https://escapetours.com/zanzibar" },
};

export default function ZanzibarBeachEscapePage() {
    // Production Feature: Pricing Logic (Easily extendable for discount codes)
    const basePrice = 6500;

    return (
        <div className="min-h-screen">
           

            <main>
                {/* HERO SECTION */}
                <section className="relative h-[60vh] min-h-[500px] w-full">
                    <Image
                        src="/images/zanzibar-beach-paradise.jpg"
                        alt="Zanzibar Beach"
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-12 left-0 w-full px-8">
                        <div className="max-w-7xl mx-auto">
                            <Badge className="bg-brand-orange text-white mb-4">10 Days</Badge>
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                                Zanzibar Island & Beach Relaxation Escape
                            </h1>
                        </div>
                    </div>
                </section>

                {/* QUICK INFO BAR */}
                <section className="bg-brand-dark text-white py-8 border-b-4 border-brand-orange">
                    <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: DollarSign, label: "Price from", val: `$${basePrice}` },
                            { icon: Calendar, label: "Duration", val: "10 Days" },
                            { icon: Users, label: "Group Size", val: "Flexible" },
                            { icon: MapPin, label: "Destinations", val: "3 Regions" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <item.icon className="h-6 w-6 text-brand-orange" />
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-white/60">{item.label}</p>
                                    <p className="font-bold">{item.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* TOUR OVERVIEW & ITINERARY */}
                <section className="py-16 bg-white max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2">
                        <h2 className="text-3xl font-black mb-6">Tour Overview</h2>
                        <p className="text-gray-700 leading-relaxed mb-8">
                            Immerse yourself in the tropical paradise of Zanzibar. From the historic streets of Stone Town to
                            the pristine beaches of Nungwi, this itinerary offers a perfect blend of culture and relaxation.
                        </p>

                        <h3 className="text-2xl font-black mb-6">What's Included</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {['Airport Transfers', 'Luxury Accommodation', 'Guided Stone Town Tour', 'Daily Breakfast'].map(feat => (
                                <div key={feat} className="flex items-center gap-2"><Check className="text-green-600" /> {feat}</div>
                            ))}
                        </div>
                    </div>

                    {/* BOOKING CARD */}
                    <div className="bg-gray-100 p-8 rounded-2xl h-fit sticky top-24">
                        <h3 className="text-xl font-bold mb-4">Book Your Escape</h3>
                        <p className="mb-6">Secure your spot with a flexible deposit.</p>
                        <Button asChild size="lg" className="w-full bg-brand-orange">
                            <Link href="/contact?package=zanzibar-beach-escape">Inquire Now</Link>
                        </Button>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 bg-brand-orange text-white text-center px-8">
                    <h2 className="text-4xl font-black mb-6">Ready to Experience Zanzibar?</h2>
                    <Button asChild size="lg" className="bg-white text-brand-orange hover:bg-gray-100">
                        <Link href="/contact?package=zanzibar-beach-escape">Get Custom Quote</Link>
                    </Button>
                </section>
            </main>

            
            <WhatsAppFloat />
        </div>
    )
}