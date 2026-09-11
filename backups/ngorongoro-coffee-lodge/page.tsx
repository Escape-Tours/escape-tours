"use client";

import { useState } from "react"

import    from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float";
import {BookingModal}  from "@/components/booking-modal"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const rooms = [
  {
    name: "Standard Room",
    price: 150,
    description:
      "Comfortable standard room featuring 2 beds, perfect for friends or family members traveling together. Designed with elegant furnishings and modern amenities, this room offers a peaceful retreat surrounded by coffee plantations. Enjoy beautiful views, en-suite bathroom, and warm hospitality in this charming lodge setting.",
    beds: "2 beds",
    image: "/images/hotels/coffee-lodge-standard.jpg",
  },
  {
    name: "Family Room (Interconnected)",
    price: 200,
    description:
      "Spacious interconnected family room featuring 3 beds, ideal for families seeking privacy and togetherness. This thoughtfully designed accommodation offers separate sleeping areas while maintaining connectivity. Perfect for parents with children, providing comfort, space, and modern amenities. Enjoy the serene coffee plantation surroundings and exceptional service.",
    beds: "3 beds (interconnected)",
    image: "/images/hotels/coffee-lodge-family.jpg",
  },
]

const environmentImages = [
  { src: "/images/hotels/coffee-lodge-exterior.jpeg", alt: "Lodge exterior with manicured lawns" },
  { src: "/images/hotels/coffee-lodge-grounds.jpeg", alt: "Landscaped grounds with mountain views" },
  { src: "/images/hotels/coffee-lodge-building.jpeg", alt: "Main building with arched architecture" },
  { src: "/images/hotels/coffee-lodge-pool.jpeg", alt: "Swimming pool with mountain backdrop" },
]

const roomCategories = rooms.map((room) => room.name)

export default function NgorongoroCoffeeLodgePage() {
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
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark">NGORONGORO COFFEE LODGE</h1>
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
          <h2 className="text-4xl font-black text-brand-dark mb-12 text-center">Lodge Environment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {environmentImages.map((img, i) => (
              <div key={i} className="h-80 relative rounded-lg overflow-hidden">
                <Image src={img.src || "/placeholder.svg"} alt={img.alt} fill className="object-cover" />
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
        hotelName="Ngorongoro Coffee Lodge"
        roomCategories={roomCategories}
        defaultCategory={selectedRoom}
      />
    </div>
  )
}
