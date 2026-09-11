"use client";

import { useState } from "react"
import Image from "next/image"

import    from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float";
import {BookingModal}  from "@/components/booking-modal"
import { Button } from "@/components/ui/button"

const rooms = [
  {
    name: "Triple Bed Room",
    priceRange: "Around $100",
    description:
      "Comfortable room featuring one triple bed, perfect for small families or groups of three. This well-appointed room offers modern amenities and a cozy atmosphere. Enjoy access to the beautiful pool area with its iconic elephant sculpture and lush gardens during your stay.",
    beds: "1 Triple bed",
    image: "/images/hotels/kudu-triple-room.jpeg",
  },
  {
    name: "Twin Bed Room",
    priceRange: "Around $100",
    description:
      "Spacious room with twin beds, ideal for friends traveling together or family members who prefer separate sleeping arrangements. Features comfortable furnishings and all essential amenities for a pleasant stay.",
    beds: "1 Twin bed (2 single beds)",
    image: "/images/hotels/kudu-twin-room.jpeg",
  },
  {
    name: "Single Bed Room",
    priceRange: "Around $100",
    description:
      "Cozy single room perfect for solo travelers seeking comfort and tranquility. Despite its compact size, this room is thoughtfully designed with all necessary amenities and provides a peaceful retreat after a day of safari adventures.",
    beds: "1 Single bed",
    image: "/images/hotels/kudu-single-room.jpeg",
  },
  {
    name: "Family Room",
    priceRange: "Around $100",
    description:
      "Exceptionally spacious family room accommodating larger groups with versatile sleeping arrangements. This well-appointed room offers ample space, modern amenities, and comfortable furnishings, making it perfect for families or groups traveling together.",
    beds: "Multiple beds configuration",
    image: "/images/hotels/kudu-family-room.jpeg",
  },
]

const environmentImages = [
  { src: "/images/hotels/kudu-lodge-karatu.webp", alt: "Kudu Lodge pool area with elephant sculpture" },
  { src: "/images/hotels/kudu-entrance.jpeg", alt: "Kudu Lodge entrance and lounge area" },
  { src: "/images/hotels/kudu-pool-1.jpeg", alt: "Kudu Lodge swimming pool" },
  { src: "/images/hotels/kudu-dining.jpeg", alt: "Kudu Lodge dining room" },
  { src: "/images/hotels/kudu-pool-2.jpeg", alt: "Kudu Lodge pool view" },
]

const roomCategories = rooms.map((room) => room.name)

export default function KuduLodgePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState("")

  const handleBookNow = (roomName: string) => {
    setSelectedRoom(roomName)
    setIsBookingOpen(true)
  }

  return (
    <div className="min-h-screen bg-white">
     
      <main>
        {/* Header */}
        <section className="bg-gray-100 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark">KUDU LODGE - KARATU</h1>
          </div>
        </section>

        {/* Rooms Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="space-y-16">
            {rooms.map((room, index) => (
              <div key={room.name} className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 h-80 relative rounded-lg overflow-hidden">
                  <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                </div>

                {/* Room Details */}
                <div className="w-full md:w-1/2 space-y-4">
                  <h2 className="text-3xl font-black text-brand-dark">{room.name}</h2>
                  <p className="text-lg font-semibold text-gray-700">{room.beds}</p>
                  <p className="text-3xl font-bold text-[#4a9eff]">
                    {room.priceRange} <span className="text-lg font-normal text-gray-600">/ night</span>
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
          <h2 className="text-4xl font-black text-brand-dark mb-12 text-center">Lodge Environment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {environmentImages.map((image, i) => (
              <div key={i} className="h-64 relative rounded-lg overflow-hidden">
                <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      </main>
      < />
      <WhatsAppFloat />
      <{BookingModal}
        isOpen={isBookingOpen}
        onCloseAction={() => setIsBookingOpen(false)}
        hotelName="Kudu Lodge - Karatu"
        roomCategories={roomCategories}
        defaultCategory={selectedRoom}
      />
    </div>
  )
}
