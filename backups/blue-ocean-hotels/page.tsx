'use client';

import { useState } from "react"
// CORRECT: No curly braces for default exports

import  from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float";
// CORRECT: Curly braces for named exports
import  {BookingModal}  from "@/components/booking-modal"
import { Button } from "@/components/ui/button"
import Image from "next/image"

// 1. DATA DEFINITIONS MUST BE HERE (Outside the function, but at the top)
const rooms = [
  { 
    name: "Family Room", 
    price: 100, 
    description: "Spacious family room...", 
    image: "/images/hotels/bougainvillea-room.jpeg" 
  },
]

const roomCategories = rooms.map((room) => room.name)

// 2. COMPONENT DEFINITION MUST BE HERE
export default function BlueOceanHotelsPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState("")

  return (
    <div className="min-h-screen bg-white">
     
      <main>
        {/* Your JSX */}
        {rooms.map((room) => (
          <div key={room.name}>{room.name}</div>
        ))}
      </main>
      < />
      <WhatsAppFloat />
      <{BookingModal}
        isOpen={isBookingOpen}
        onCloseAction={() => setIsBookingOpen(false)}
        hotelName="Blue Ocean Hotels"
        roomCategories={roomCategories}
        defaultCategory={selectedRoom}
      />
    </div>
  )
}