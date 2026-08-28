"use client"

import { useState } from "react"
import Image from "next/image"

import {  } from "@/components/footer"
import WhatsAppFloat from '../whatsapp-float';
import { {BookingModal} } from "@/components/booking-modal"
import { Button } from "@/components/ui/button"
import { Wifi, Coffee, UtensilsCrossed, Waves, Wind, Palmtree } from "lucide-react"

const rooms = [
  {
    name: "Sea View Challet",
    price: 130,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sea%20view%20chalet-XJDJdodjCkZOqFhZNgblxfOg0X4QJu.jpg",
    description:
      "Stunning oceanfront chalet with panoramic sea views and private balcony. Features a luxurious canopy bed, traditional Zanzibari carved furniture, and direct access to the beach. Wake up to the sound of waves and enjoy breathtaking sunrises from your room.",
  },
  {
    name: "Junior Suite",
    price: 120,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/junior-6mLYVZPg72aYxnJJ1lr9eFuyASAvnU.jpg",
    description:
      "Spacious suite featuring authentic Swahili architecture with traditional wooden beams and Moroccan-style lanterns. Enjoy a comfortable canopy bed, carved wooden furniture, and elegant decor that captures the essence of Zanzibar's rich cultural heritage.",
  },
  {
    name: "Deluxe Double Room",
    price: 110,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/deluxe%20double-hWiQVJgqFO327AJhUeRiAA4HVCQ1Ru.jpg",
    description:
      "Elegant room with twin beds adorned with vibrant orange runners and white canopy netting. Perfect for friends or family, this room combines comfort with traditional Zanzibari style. Enjoy modern amenities while immersed in island charm.",
  },
  {
    name: "Senior Garden View",
    price: 90,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/garden%20view-NtMG0BeTD8LgDIYMrOgk3SfM4J9FAl.jpg",
    description:
      "Comfortable room overlooking lush tropical gardens. Features a cozy canopy bed with mosquito netting, wooden furnishings, and terracotta tile flooring. Ideal for travelers seeking a peaceful retreat surrounded by nature's beauty.",
  },
]

const facilities = [
  { icon: Wifi, name: "Free WiFi" },
  { icon: Waves, name: "Beach Access" },
  { icon: UtensilsCrossed, name: "Restaurant" },
  { icon: Coffee, name: "Bar & Lounge" },
  { icon: Wind, name: "Air Conditioning" },
  { icon: Palmtree, name: "Tropical Gardens" },
]

const roomCategories = rooms.map((room) => room.name)

const roomPrices = rooms.reduce(
  (acc, room) => {
    acc[room.name] = room.price
    return acc
  },
  {} as { [key: string]: number },
)

export default function ZanzibarBeachResortPage() {
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
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark">ZANZIBAR BEACH RESORT</h1>
            <p className="text-xl text-gray-600 mt-4">Experience paradise on Zanzibar's pristine shores</p>
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

        {/* Facilities Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50">
          <h2 className="text-4xl font-black text-brand-dark mb-12 text-center">Resort Facilities</h2>
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
            <h2 className="text-4xl font-black text-brand-dark mb-6">About Zanzibar Beach Resort</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Nestled on the pristine beaches of Zanzibar, our resort offers the perfect blend of traditional Swahili
              hospitality and modern comfort. Surrounded by turquoise waters and swaying palm trees, each room is
              thoughtfully designed with authentic island charm. Enjoy fresh seafood cuisine, explore vibrant coral
              reefs, or simply relax on our white sand beach. Experience the magic of Zanzibar at our oceanfront
              paradise.
            </p>
          </div>
        </section>
      </main>
      < />
      <WhatsAppFloat />
      <{BookingModal}
        isOpen={isBookingOpen}
        onCloseAction={() => setIsBookingOpen(false)}
        hotelName="Zanzibar Beach Resort"
        roomCategories={roomCategories}
        defaultCategory={selectedRoom}
        roomPrices={roomPrices}
      />
    </div>
  )
}
