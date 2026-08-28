"use client";


import  from "@/components/footer";
import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {Image} from "next/image";
import { Check } from "lucide-react";

export default function UdzungwaPage() {
    return (
        <div className="min-h-screen">
            
            <main>
                {/* Hero Section */}
                <section className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center bg-gradient-to-r from-brand-dark to-brand-brown">
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">Udzungwa Mountains</h1>
                        <p className="text-lg md:text-xl text-white/90">Biodiversity Hotspot & Waterfall Paradise</p>
                    </div>
                </section>
            </main>
            < />
            <WhatsAppFloat />
        </div>
    );
}