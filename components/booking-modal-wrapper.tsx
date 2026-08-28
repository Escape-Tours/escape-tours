"use client";
import { useState } from "react";
import { BookingModal } from "./booking-modal";
import { Button } from "@/components/ui/button";

// Assuming these types are available in your project
// If you don't have them defined, replace 'any' with your actual types
interface HotelData {
  id: string;
  name: string;
}

export default function BookingModalWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  // Expanded mock data to ensure compatibility with your calculator logic
  const mockHotel = { 
    id: "lodge-001", 
    name: "Tanzania Safari Lodge",
    room_prices: { 
      "Luxury Tent": { low: 375, high: 450 },
      "Suite": { low: 500, high: 600 }
    },
    parkFees: { INTERNATIONAL: 50, RESIDENT: 20, CITIZEN: 10 } // Required by calculateBookingDetails
  };
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Book Now</Button>
      <BookingModal
        isOpen={isOpen}
        onCloseAction={() => setIsOpen(false)}
        hotel={mockHotel}
      defaultTierId="INTERNATIONAL"// Assuming this is defined somewhere in your codebase
        bookingType="hotel"
    
      />
    </>
  );
}