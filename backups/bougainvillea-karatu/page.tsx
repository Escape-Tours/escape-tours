'use client';

import { useState } from "react";
import { Image } from "next/image";

import  from "@/components/footer";
import WhatsAppFloat from "@/components/whatsapp-float";
import   {BookingModal} from "@/components/booking-modal";
import { Button } from "@/components/ui/button";

const rooms = [
    {
        name: "Family Room",
        price: 100,
        description:
            "Spacious family room featuring 1 king-size bed with an interconnected twin bed on the other side, perfect for families traveling together. This thoughtfully designed accommodation offers privacy and comfort for parents and children. Includes modern amenities, en-suite bathroom, and beautiful views of the surrounding gardens and pool area.",
        beds: "1 King-size bed + Interconnected twin bed",
        image: "/images/hotels/bougainvillea-room.jpeg",
    },
];

const environmentImages = [
    {
        src: "/images/hotels/bougainvillea-pool.jpeg",
        alt: "Swimming pool with sun loungers and garden views",
    },
    {
        src: "/images/hotels/bougainvillea-garden.jpeg",
        alt: "Beautiful flower gardens with colorful blooms",
    },
    {
        src: "/images/hotels/bougainvillea-dining.jpeg",
        alt: "Ngorongoro Dining restaurant interior",
    },
    {
        src: "/images/hotels/bougainvillea-pool2.jpeg",
        alt: "Large swimming pool with cottages in background",
    },
];

const roomCategories = rooms.map((room) => room.name);

export default function BougainvilleaPage() {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState("");

    const handleBookNow = (roomName: string) => {
        setSelectedRoom(roomName);
        setIsBookingOpen(true);
    };

    return (
        <div className="min-h-screen bg-white">
            
            <main>
                {/* Header */}
                <section className="bg-gray-100 py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-black text-brand-dark">BOUGAINVILLEA - KARATU</h1>
                    </div>
                </section>

                {/* Rooms Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="space-y-16">
                        {rooms.map((room) => (
                            <div key={room.name} className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="w-full md:w-1/2 h-80 relative rounded-lg overflow-hidden">
                                    <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                                </div>

                                {/* Room Details */}
                                <div className="w-full md:w-1/2 space-y-4">
                                    <h2 className="text-3xl font-black text-brand-dark">{room.name}</h2>
                                    <p className="text-lg font-semibold text-gray-700">{room.beds}</p>
                                    <p className="text-3xl font-bold text-[#4a9eff]">
                                        ${room.price} <span className="text-lg font-normal text-gray-600">/ night</span>
                                    </p>
                                    <p className="text-gray-700 leading-relaxed">{room.description}</p>
                                    <Button
                                        onClick={() => handleBookNow(room.name)}
                                        className="bg-[#f4d03f] hover:bg-[#f4d03f]/90 text-black font-bold px-8 py-6 rounded-full text-lg"
                                    >
                                        Book Now!
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Environment Gallery Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50">
                    <h2 className="text-4xl font-black text-brand-dark mb-12 text-center">Property Environment</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {environmentImages.map((image, i) => (
                            <div key={i} className="h-80 relative rounded-lg overflow-hidden">
                                <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            < />
            <WhatsAppFloat />
            {BookingModal}
                isOpen={isBookingOpen}
                onCloseAction={() => setIsBookingOpen(false)}
                hotelName="Bougainvillea - Karatu"
                roomCategories={roomCategories}
                defaultCategory={selectedRoom}
            />
        </div>
    );
}