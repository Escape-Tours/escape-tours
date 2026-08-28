"use client";

import { useState } from "react"
import Image from "next/image"

import    from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float";
import  {BookingModal}  from "@/components/booking-modal"
import { Button } from "@/components/ui/button"

const rooms = [
  {
    name: "Single Room",
    price: 90,
    image: "/images/hotels/safari-camp-single.jpeg",
    description:
      "Comfortable single room designed for solo travelers seeking an authentic safari camp experience. Features rustic charm combined with modern amenities, comfortable bedding, and a private bathroom. Perfect for adventurers who want to immerse themselves in the natural beauty of Karatu while enjoying cozy accommodations.",
  },
  {
    name: "Double Room",
    price: 120,
    image: "/images/hotels/safari-camp-double.jpeg",
    description:
      "Spacious double room offering enhanced comfort and privacy in a traditional safari camp setting. Features rustic wooden four-poster bed with mosquito netting, premium furnishings, and upgraded amenities. Ideal for couples seeking an authentic camp atmosphere with modern conveniences and personalized service.",
  },
  {
    name: "Family Room",
    price: 170,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/familt%20room-vEBHqdILLj6AdYhzzFS5qjyApQSby1.webp",
    description:
      "Generous family room featuring twin beds with elegant mosquito netting, traditional floral decor, and authentic safari camp ambiance. Designed to accommodate families comfortably with ample space and traditional Tanzanian touches. Enjoy a cozy retreat perfect for creating lasting family memories in the heart of Karatu.",
  },
]

const environmentImages = [
  {
    src: "/images/hotels/safari-camp-restaurant.jpeg",
    alt: "Restaurant & Bar Area",
  },
  {
    src: "/images/hotels/safari-camp-terrace.jpeg",
    alt: "Outdoor Terrace",
  },
  {
    src: "/images/hotels/safari-camp-lounge.jpeg",
    alt: "Lounge & Dining",
  },
  {
    src: "/images/hotels/safari-camp-lounge2.jpeg",
    alt: "Relaxation Area",
  },
]

const roomCategories = rooms.map((room) => room.name)

const roomPrices = rooms.reduce(
  (acc, room) => {
    acc[room.name] = room.price
    return acc
  },
  {} as { [key: string]: number },
)

export default function SafariCampPage() {
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
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark">SAFARI CAMP - KARATU</h1>
          </div>
        </section>

        {/* Rooms Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="space-y-16">
            {rooms.map((room, index) => (
              <div
                key={room.name}
                className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}
              >
                <div className="w-full md:w-1/2 h-80 relative rounded-lg overflow-hidden">
                  <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                </div>

                {/* Room Details */}
                <div className="w-full md:w-1/2 space-y-4">
                  <h2 className="text-3xl font-black text-brand-dark">{room.name}</h2>
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

        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50">
          <h2 className="text-4xl font-black text-brand-dark mb-12 text-center">Camp Environment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {environmentImages.map((image, index) => (
              <div key={index} className="h-64 relative rounded-lg overflow-hidden">
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
        hotelName="Safari Camp - Karatu"
        roomCategories={roomCategories}
        defaultCategory={selectedRoom}
        roomPrices={roomPrices}
      />
    </div>
  )
}
