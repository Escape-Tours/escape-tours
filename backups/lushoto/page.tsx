"use client"
// Essential for pages with client components like WhatsAppFloat

import  from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float"; // Assuming file is at app/lushoto/page.tsx
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {Image} from "next/image"
import { Check } from "lucide-react"

export default function LushotoPage() {
  return (
    <div className="min-h-screen">
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center bg-gradient-to-r from-green-700 to-blue-600">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">Lushoto</h1>
            <p className="text-lg md:text-xl text-white/90">Usambara Mountains Cultural & Scenic Retreat</p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-6 text-center">
              Escape to the Cool Mountain Town
            </h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Lushoto is a scenic mountain town nestled in the Usambara Mountains of Tanga Region, offering a cool
                climate escape from Tanzania's coastal heat. The area is renowned for beautiful hiking trails through
                forests and traditional villages, providing authentic cultural experiences with local communities.
              </p>
              <p>
                The Usambara Mountains are known for their stunning landscapes, with terraced hillsides, lush forests,
                and panoramic viewpoints. The region's pleasant climate and fertile soil support diverse agriculture,
                creating a patchwork of green valleys and mountain peaks.
              </p>
              <p>
                Visitors can explore waterfalls, visit local markets selling fresh produce and traditional crafts, and
                interact with friendly local communities. The area offers various hiking trails ranging from easy walks
                to challenging multi-day treks, all showcasing the natural beauty and cultural richness of the Usambara
                Mountains.
              </p>
            </div>

            {/* Highlights */}
            <div className="mt-12 bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-black text-brand-dark mb-6">Highlights</h3>
              <ul className="space-y-3">
                {[
                  "Scenic mountain landscapes and viewpoints",
                  "Cool, pleasant climate year-round",
                  "Cultural village visits and community experiences",
                  "Waterfalls and forest trails",
                  "Local markets with fresh produce and crafts",
                  "Traditional Usambara architecture",
                  "Panoramic views of surrounding valleys",
                ].map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check size={20} className="text-brand-green mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trail Options */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-bold text-brand-dark mb-2">2 Days</h4>
                <p className="text-sm text-gray-600">Village walks and viewpoint hikes</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-bold text-brand-dark mb-2">3-4 Days</h4>
                <p className="text-sm text-gray-600">Extended cultural and nature trails</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-bold text-brand-dark mb-2">5+ Days</h4>
                <p className="text-sm text-gray-600">Comprehensive Usambara exploration</p>
              </div>
            </div>
          </div>
        </section>

        {/* Image Section */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="/images/lushoto-mountains.jpg"
                alt="Panoramic view of Usambara Mountains in Lushoto with green valleys"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-brand-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6">Discover Lushoto</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Experience the cool mountain climate and rich culture of the Usambara Mountains
            </p>
            <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white">
              <Link href="/packages">View Packages</Link>
            </Button>
          </div>
        </section>
      </main>
      < />
      <WhatsAppFloat />
    </div>
  )
}
