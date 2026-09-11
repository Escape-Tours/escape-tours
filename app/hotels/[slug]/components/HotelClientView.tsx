"use client";

// Instead of the alias, try this relative path:
import { BookingTrigger } from "../../../../components/BookingTrigger";
import { VideoTrigger } from '@/components/VideoTrigger';

export default function HotelClientView({ hotel }: { hotel: any }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Hotel",
        "name": hotel.name,
        "description": hotel.description,
        "address": { "@type": "PostalAddress", "addressLocality": hotel.location },
        "priceRange": "$$"
    };

    return (
        <main className="max-w-7xl mx-auto px-4 py-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{hotel.name}</h1>
                {hotel.video_url && <VideoTrigger videoUrl={hotel.video_url} />}
            </div>

            <div className="grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8">
                    {hotel.image && (
                        <img src={hotel.image} className="w-full h-auto rounded-3xl object-cover shadow-lg" alt={hotel.name} />
                    )}

                    <div className="prose prose-lg max-w-none text-gray-700">
                        <p>{hotel.description}</p>
                    </div>

                    <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h2 className="text-2xl font-bold mb-6">Guest Reviews</h2>
                        <div className="space-y-6">
                            {hotel.reviews?.length > 0 ? (
                                hotel.reviews.map((review: any, i: number) => (
                                    <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold">{review.user_name}</span>
                                            <span className="text-yellow-500 text-sm">{'★'.repeat(review.rating)}</span>
                                        </div>
                                        <p className="text-gray-600 italic">"{review.comment}"</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">No reviews yet.</p>
                            )}
                        </div>
                    </section>
                </div>

                <aside className="md:col-span-1">
                    <div className="sticky top-28 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
                        <div className="mb-6">
                            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Starting from</span>
                            <h3 className="text-3xl font-black">${hotel.price_per_night} / night</h3>
                        </div>
                        <BookingTrigger hotel={hotel} />
                    </div>
                </aside>
            </div>
        </main>
    );
}