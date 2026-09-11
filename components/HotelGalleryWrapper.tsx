'use client';
import { Suspense } from 'react';
import HotelGallery from '@/components/HotelGallery';
import { SkeletonCard } from '@/components/SkeletonCard';

export default function HotelGalleryWrapper({ initialHotels }: { initialHotels: any[] }) {
  return (
    <Suspense fallback={<GallerySkeleton />}>
      <HotelGallery initialHotels={initialHotels} />
    </Suspense>
  );
}

// A dedicated skeleton grid for the gallery
function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}