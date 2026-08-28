"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { BookingModal } from '@/components/booking-modal';

export function BookingTrigger({ hotel }: { hotel: any }) {
    const [isOpen, setIsOpen] = useState(false);

    const sanitizedData = useMemo(() => {
        if (!hotel) return null;
        return {
            price: typeof hotel.price_per_night === 'string'
                ? parseFloat(hotel.price_per_night)
                : (hotel.price_per_night || 0),
            categories: Array.isArray(hotel.room_categories)
                ? hotel.room_categories
                : ["Standard"]
        };
    }, [hotel]);

    if (!hotel) {
        return (
            <Button disabled className="w-full h-12" variant="outline">
                Loading...
            </Button>
        );
    }

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                aria-label={`Book stay at ${hotel.name}`}
            >
                Book This Stay
            </Button>

            <BookingModal
                isOpen={isOpen}
                onCloseAction={() => setIsOpen(false)}
                hotelName={hotel.name || "Stay"}
                roomCategories={sanitizedData?.categories ?? ["Standard"]}
                pricePerNight={sanitizedData?.price ?? 0}
            />
        </>
    );
}   