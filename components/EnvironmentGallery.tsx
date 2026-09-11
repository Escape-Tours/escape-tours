'use client';

import Image from 'next/image';

export default function EnvironmentGallery({ data }: { data?: { images: string[] } }) {
    if (!data?.images || data.images.length === 0) return null;

    return (
        <section className="py-12 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Lodge Environment</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.images.map((src, index) => (
                    <div key={index} className="relative aspect-video overflow-hidden rounded-xl shadow-sm">
                        <Image
                            src={src}
                            alt={`Environment ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}