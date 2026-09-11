"use client";

import { useState } from "react"
import  Image from "next/image"

import    from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float";
import  {BookingModal}  from "@/components/booking-modal"
import { Button } from "@/components/ui/button"

const rooms = [
  {
    name: "Double Room",
    price: 318,
    image: "/images/hotels/mikumi-double-room.jpeg",
    description:
      "Elegant double room featuring modern African design with comfortable king-size bed. Perfectly situated to wake up to the sounds of the African bush. The room includes air conditioning, en-suite bathroom with hot shower, complimentary WiFi, and a private balcony overlooking the wilderness. Ideal for couples seeking an intimate safari experience in the heart of Mikumi National Park.",
  },
  {
    name: "Twin Room",
    price: 496,
    image: "/images/hotels/mikumi-twin-room.jpeg",
    description:
      "Spacious twin room with two comfortable beds, perfect for friends or family traveling together. Features contemporary design blended with traditional African elements. Includes en-suite bathroom, air conditioning, mini-bar, and stunning views of Mikumi National Park. The room provides a comfortable base for your safari adventures with modern amenities and warm hospitality.",
  },
]

const environmentImages = [
  { src: "/images/hotels/mikumi-env-1.jpeg", alt: "Wildlife at watering hole in Mikumi" },
  { src: "/images/hotels/mikumi-env-2.jpeg", alt: "Luxurious lounge and lobby area" },
  { src: "/images/hotels/mikumi-env-3.jpeg", alt: "Pool and sandy beach area" },
  { src: "/images/hotels/mikumi-env-4.jpeg", alt: "Lodge entrance with stone pillars" },
]

const roomCategories = rooms.map((room) => room.name)

export default function MikumiWildlifeLoungePage() {
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
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark">MIKUMI WILDLIFE LOUNGE</h1>
            <p className="text-xl text-gray-600 mt-2">Mikumi National Park, Tanzania</p>
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
                  <Image
                    src={room.image || "/placeholder.svg"}
                    alt={`${room.name} at Mikumi Wildlife Lounge`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
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

        {/* Environment Gallery Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50">
          <h2 className="text-4xl font-black text-brand-dark mb-12 text-center">Lodge Environment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {environmentImages.map((image, i) => (
              <div key={i} className="h-64 relative rounded-lg overflow-hidden">
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
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
        hotelName="Mikumi Wildlife Lounge"
        roomCategories={roomCategories}
        defaultCategory={selectedRoom}
      />
    </div>
  )
}
