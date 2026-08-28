"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-elephant.jpg"
          alt="Majestic elephant in Tanzania wilderness"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 text-balance">
          Escape the Ordinary, Embrace the Wild
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto text-pretty">
          Experience authentic safaris and epic adventures with Escape Tours, Tanzania's top adventure experts.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-brand-orange hover:bg-brand-orange/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <Link href="/packages">Explore Packages</Link>
        </Button>
      </div>
    </section>
  )
}
