"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, MapPin, Users, Wifi, Coffee, Utensils } from "lucide-react";

// Use named imports (with brackets) for named exports
import  Navigation from "@/components/";
import    from "@/components/footer";
import WhatsAppFloat from "@/components/whatsapp-float";
import   {BookingModal} from "@/components/booking-modal";
import { Button } from "@/components/ui/button";

export default function NgorongoroOldeaniPage() {
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
           
            <main className="py-16">
                {/* Main content here */}
                <h1 className="text-4xl font-bold">Ngorongoro Oldeani Mountain Lodge</h1>
                <Button onClick={() => setIsBookingOpen(true)}>Book Now</Button>
            </main>
            < />
            <WhatsAppFloat />
            <{BookingModal}
                isOpen={isBookingOpen}
                onCloseAction={() => setIsBookingOpen(false)}
                hotelName="Ngorongoro Oldeani Mountain Lodge"
                roomCategories={["Standard Suite"]}
                defaultCategory="Standard Suite"
                roomPrices={{ "Standard Suite": 900 }}
            />
        </div>
    );
}