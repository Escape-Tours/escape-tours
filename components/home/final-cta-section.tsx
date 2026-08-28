"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TourBookingModal } from "@/components/tour-booking-modal";
import { Sparkles, ArrowRight } from "lucide-react";
import { RESIDENCY_TIER } from "@/lib/constants/residency";

interface FinalCtaSectionProps {
    title?: string;
    subtitle?: string;
    defaultTourTitle?: string;
    // Added: Allow passing custom pricing for the CTA
    basePriceByTier?: Record<string, number>;
}

export function FinalCtaSection({
    title = "Ready for Your African Adventure?",
    subtitle = "Let us craft a bespoke Tanzania experience tailored to your exact desires.",
    defaultTourTitle = "Custom Safari",
    // Defaulting to 0 or a base starting price for a custom tour
    basePriceByTier = {
        [RESIDENCY_TIER.INTERNATIONAL]: 500,
        [RESIDENCY_TIER.RESIDENT]: 300,
        [RESIDENCY_TIER.CITIZEN]: 150,
    }
}: FinalCtaSectionProps) {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    return (
        <>
            <section className="relative py-24 bg-zinc-950 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent" />

                <div className="container relative mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tight">
                            {title.split("African Adventure").map((part, i) => (
                                <span key={i}>
                                    {part}
                                    {i === 0 && <span className="text-orange-500">African Adventure</span>}
                                </span>
                            ))}
                        </h2>
                        <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto font-medium">
                            {subtitle}
                        </p>

                        <Button
                            size="lg"
                            onClick={() => setIsBookingModalOpen(true)}
                            className="group bg-orange-600 hover:bg-orange-500 text-white font-bold h-16 px-12 text-xl shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all hover:scale-105 rounded-full"
                        >
                            <Sparkles className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                            Book Your Journey
                            <ArrowRight className="ml-3 h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>
                </div>
            </section>

            <TourBookingModal
                open={isBookingModalOpen}
                onOpenChange={setIsBookingModalOpen}
                tourTitle={defaultTourTitle}
                basePriceByTier={basePriceByTier}
            />
        </>
    );
}