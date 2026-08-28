"use client";

import { useState } from "react"
import Image from "next/image"

import    from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float";
import  {BookingModal}  from "@/components/booking-modal"
import { Button } from "@/components/ui/button"
import { Wifi, Coffee, UtensilsCrossed, Wind, Flame, Star } from "lucide-react"

const rooms = [
  {
    name: "Ole Serai Luxury Camp",
    bedType: "1 extra-large double bed",
    price: 1100,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ole%20Serai%20Luxury%20Camp-TLSfgBx0fhFTO8ERgXamzph6WAN8ZQ.jpg",
    description:
      "Immerse yourself in authentic safari luxury at Ole Serai Turner Springs. Our spacious tented camp features elegant furnishings, a comfortable extra-large double bed, and stunning savanna views. Experience the perfect blend of wilderness adventure and refined comfort with modern amenities in a classic safari setting.",
  },
]

const facilities = [
  { icon: Wifi, name: "Free WiFi" },
  { icon: UtensilsCrossed, name: "Restaurant" },
  { icon: Coffee, name: "Bar Service" },
  { icon: Wind, name: "Ventilation" },
  { icon: Flame, name: "Campfire" },
  { icon: Star, name: "Stargazing" },
]

const roomCategories = rooms.map((room) => room.name)

const roomPrices = rooms.reduce(
  (acc, room) => {
    acc[room.name] = room.price
    return acc
  },
  {} as { [key: string]: number },
)

export default function OleSeraliTurnerSpringsPage() {
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
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark">
              OLE SERALI LUXURY CAMPS - TURNER SPRINGS
            </h1>
            <p className="text-xl text-gray-600 mt-4">Authentic Safari Experience in the Heart of the Serengeti</p>
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
                  <p className="text-lg text-gray-600">{room.bedType}</p>
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

        {/* Facilities Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50">
          <h2 className="text-4xl font-black text-brand-dark mb-12 text-center">Camp Facilities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {facilities.map((facility, index) => {
              const Icon = facility.icon
              return (
                <div key={index} className="flex flex-col items-center text-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-[#4a9eff] flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{facility.name}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-black text-brand-dark mb-6">About Ole Serali Turner Springs</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Located in the pristine wilderness of Turner Springs, Ole Serali Luxury Camps offers an unforgettable
              safari experience. Our luxury tented camp combines the romance of traditional safari camping with modern
              comforts. Wake up to the sounds of nature, enjoy game drives across the savanna, and relax under
              star-filled African skies. Experience authentic wilderness luxury where adventure meets comfort.
            </p>
          </div>
        </section>
      </main>
      < />
      <WhatsAppFloat />
      <{BookingModal}
        isOpen={isBookingOpen}
        onCloseAction={() => setIsBookingOpen(false)}
        hotelName="Ole Serali Luxury Camps - Turner Springs"
        roomCategories={roomCategories}
        defaultCategory={selectedRoom}
        roomPrices={roomPrices}
      />
    </div>
  )
}
