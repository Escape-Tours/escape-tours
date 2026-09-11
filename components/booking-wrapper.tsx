"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/booking-modal";
import { Loader2 } from "lucide-react";

interface BookingWrapperProps {
  hotelName: string;
  category: string;
  hotel: any;
  defaultTierId: string;
}

type Tier = "INTERNATIONAL" | "RESIDENT" | "CITIZEN";

export function BookingWrapper({ 
  hotelName, 
  category, 
  hotel, 
  defaultTierId 
}: BookingWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  
  // Track active pricing tier so the modal can sync and calculate totals correctly
  const [activeTier, setActiveTier] = useState<Tier>((defaultTierId as Tier) || "INTERNATIONAL");

  const handleOpen = useCallback(() => {
    setIsPreparing(true);
    setTimeout(() => {
      setIsPreparing(false);
      setIsOpen(true);
    }, 300);
  }, []);

  return (
    <>
      <Button 
        size="lg" 
        onClick={handleOpen}
        disabled={isPreparing}
        aria-label={`Book ${category} at ${hotelName}`}
        className="bg-black hover:bg-gray-800 text-white transition-all duration-300 transform active:scale-95"
      >
        {isPreparing ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Book Now"
        )}
      </Button>

      {isOpen && (
        <BookingModal 
          isOpen={isOpen} 
          onCloseAction={() => setIsOpen(false)} 
          hotel={hotel}
          hotelName={hotelName}
          defaultCategory={category}
          activeTier={activeTier}
          setTier={setActiveTier}
        />
      )}
    </>
  );
}