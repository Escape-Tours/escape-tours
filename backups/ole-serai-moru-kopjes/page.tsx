"use client";

import { useState } from "react"

import   from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float";
import  {BookingModal}  from "@/components/booking-modal"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const rooms = [
  {
    name: "Luxury Tent Room",
    price: 900,
    bedding: "1 extra-large double bed",
    description:
      "Experience authentic safari luxury in our spacious tent accommodation. This beautifully appointed tent features an extra-large double bed, elegant furnishings, and modern amenities while maintaining the authentic bush atmosphere. Enjoy stunning views of the surrounding wilderness from your private veranda. Perfect for couples seeking an intimate safari experience with comfort and style in the heart of the Serengeti.",
    image: "/images/hotels/ole-serai-tent.jpg",
  },
]

const facilities = [
  {
    name: "Game Drives",
    description:
      "Expert-guided safari drives through the Serengeti, offering spectacular wildlife viewing opportunities. Our experienced guides ensure you witness the best of Tanzania's incredible fauna in their natural habitat.",
  },
  {
    name: "Restaurant & Bar",
    description:
      "Savor delicious meals prepared with fresh, local ingredients while enjoying panoramic views of the wilderness. Our bar offers a selection of fine wines and cocktails perfect for sundowners.",
  },
  {
    name: "Swimming Pool",
    description:
      "Relax by our infinity pool overlooking the vast Serengeti plains. The perfect place to unwind after an exciting day of game viewing, with stunning sunset views.",
  },
]

const roomCategories = rooms.map((room) => room.name)

export default function OleSeraiMoruKopjesPage() {
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
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark">OLE SERAI MORU KOPJES</h1>
            <p className="text-xl text-gray-700 mt-4">Luxury Safari Lodge in the Serengeti</p>
          </div>
        </section>

        {/* Rooms Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="space-y-16">
            {rooms.map((room) => (
              <div key={room.name} className="flex flex-col md:flex-row gap-8 items-start">
                {/* Room Image */}
                <div className="w-full md:w-1/2">
                  <div className="relative h-96 rounded-lg overflow-hidden">
                    <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                  </div>
                </div>

                {/* Room Details */}
                <div className="w-full md:w-1/2 space-y-4">
                  <h2 className="text-3xl font-black text-brand-dark">{room.name}</h2>
                  <p className="text-lg text-gray-600 font-medium">{room.bedding}</p>
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
          <h2 className="text-4xl font-black text-brand-dark mb-12 text-center">Facilities & Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {facilities.map((facility) => (
              <div key={facility.name} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-brand-dark mb-4">{facility.name}</h3>
                <p className="text-gray-700 leading-relaxed">{facility.description}</p>
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
        hotelName="Ole Serai Moru Kopjes"
        roomCategories={roomCategories}
        defaultCategory={selectedRoom}
      />
    </div>
  )
}
