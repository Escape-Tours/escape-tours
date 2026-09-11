import React from 'react';
import { HeroSection } from '@/components/home/hero-section';
import { EscapeVisionIntro } from '@/components/home/escape-vision-intro';
import { AboutSection } from '@/components/home/about-section';
import { WhyChooseUsSection } from '@/components/home/why-choose-us-section';
import { TopDestinationsSection } from '@/components/home/top-destinations-section';
import { KilimanjaroSection } from '@/components/home/kilimanjaro-section';
import { ZanzibarSection } from '@/components/home/zanzibar-section';
import { RecommendedBySection } from '@/components/home/recommended-by-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { TeamSection } from '@/components/home/team-section';
import { FinalCtaSection } from '@/components/home/final-cta-section';

/**
 * HomePage Component
 * Optimized for high-end luxury storytelling and conversion.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* 1. Hero: Immersive First Impression */}
      <section aria-label="Hero">
        <HeroSection />
      </section>

      {/* 2. Brand Identity: Establishing the "Escape + Vision" philosophy */}
      <section aria-label="Brand Vision" className="py-12 md:py-20">
        <EscapeVisionIntro />
      </section>

      {/* 3. Offerings: Curated Product Journey */}
      <section aria-label="Top Destinations">
        <TopDestinationsSection />
      </section>

      <section aria-label="Kilimanjaro Expeditions">
        <KilimanjaroSection />
      </section>

      <section aria-label="Zanzibar Getaways">
        <ZanzibarSection />
      </section>

      {/* 4. Trust & Authority: Proving excellence after presenting products */}
      <section aria-label="About Us" className="bg-slate-50 py-16">
        <AboutSection />
      </section>
      
      <section aria-label="Why Choose Us" className="py-16">
        <WhyChooseUsSection />
      </section>

      {/* 5. Social Proof: Building confidence before the final ask */}
      <section aria-label="Recommendations and Trust" className="py-16">
        <RecommendedBySection />
      </section>

      <section aria-label="Client Testimonials" className="bg-slate-50 py-16">
        <TestimonialsSection />
      </section>

      {/* 6. Human Connection & Conversion */}
      <section aria-label="Our Team" className="py-16">
        <TeamSection />
      </section>

      <section aria-label="Final Call to Action">
        <FinalCtaSection />
      </section>
    </main>
  );
}