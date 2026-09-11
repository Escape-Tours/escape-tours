"use client";

import { useState } from "react"
import Image from "next/image"

import   from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float";
import  {BookingModal}  from "@/components/booking-modal"
import { Button } from "@/components/ui/button"

const rooms = [
  {
    name: "Family Room",
    price: 270,
    image: "/images/hotels/merera-family.jpg",
    description:
      "Spacious family room perfect for families or groups. Features multiple comfortable beds with traditional Tanzanian decor, en-suite bathroom, and modern amenities. Enjoy stunning views of the surrounding landscape while experiencing authentic village hospitality.",
  },
  {
    name: "Double Room",
    price: 191,
    image: "/images/hotels/merera-double.jpg",
    description:
      "Comfortable double room offering a perfect blend of traditional charm and modern comfort. Features cozy double beds, private bathroom, and tasteful decor inspired by local culture. Ideal for couples or friends seeking an authentic Tanzanian experience with all essential amenities.",
  },
  {
    name: "Single Room",
    price: 90,
    image: "/images/hotels/merera-single.jpg",
    description:
      "Bright and airy single room with panoramic mountain views through large windows. Features a comfortable double bed, traditional bedding with decorative runner, private facilities, and warm African touches. Perfect for solo travelers seeking quality accommodation in a peaceful village setting with stunning natural vistas.",
  },
]

const environmentImages = [
  {
    src: "/images/hotels/merera-dining.jpg",
    alt: "Dining Area",
  },
  {
    src: "/images/hotels/merera-restaurant.jpg",
    alt: "Restaurant",
  },
  {
    src: "/images/hotels/merera-exterior.jpg",
    alt: "Lodge Exterior",
  },
  {
    src: "/images/hotels/merera-lounge.jpg",
    alt: "Reception & Lounge",
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

export default function MereraVillageLodgePage() {
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
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark">MERERA VILLAGE LODGE</h1>
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
          <h2 className="text-4xl font-black text-brand-dark mb-12 text-center">Lodge Environment</h2>
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
        hotelName="Merera Village Lodge"
        roomCategories={roomCategories}
        defaultCategory={selectedRoom}
        roomPrices={roomPrices}
      />
    </div>
  )
}
