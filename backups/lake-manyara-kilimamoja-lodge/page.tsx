"use client"

import { useState } from "react"

import    from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float";
import {BookingModal} from "@/components/booking-modal"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const rooms = [
  {
    name: "Deluxe Double Room",
    price: 740,
    bedding: "1 large double bed",
    description:
      "Indulge in luxury at our Deluxe Double Room overlooking the stunning Lake Manyara. This elegantly designed room features a large double bed with an exquisite tufted leather headboard, plush bedding, and tasteful decor. Floor-to-ceiling windows provide breathtaking views of the surrounding landscape. Relax in the comfortable seating area with a white armchair, or enjoy the modern amenities and spacious layout. Perfect for couples seeking comfort and sophistication in one of Tanzania's most beautiful locations.",
    image: "/images/hotels/kilimamoja-deluxe.jpg",
  },
]

const facilities = [
  {
    name: "Game Viewing",
    description:
      "Explore the diverse wildlife of Lake Manyara National Park with guided game drives. Witness tree-climbing lions, large elephant herds, flamingos, and over 400 bird species in this unique ecosystem.",
  },
  {
    name: "Fine Dining",
    description:
      "Experience exceptional cuisine at our restaurant featuring locally sourced ingredients and international flavors. Enjoy meals with panoramic views of Lake Manyara and the Great Rift Valley escarpment.",
  },
  {
    name: "Spa & Wellness",
    description:
      "Unwind at our spa with rejuvenating treatments inspired by local traditions. Relax with massages, beauty treatments, and wellness therapies after your safari adventures.",
  },
]

const roomCategories = rooms.map((room) => room.name)

export default function LakeManyaraKilimamojaPage() {
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
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark">LAKE MANYARA KILIMAMOJA LODGE</h1>
            <p className="text-xl text-gray-700 mt-4">Luxury Lodge with Spectacular Lake Views</p>
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
        hotelName="Lake Manyara Kilimamoja Lodge"
        roomCategories={roomCategories}
        defaultCategory={selectedRoom}
      />
    </div>
  )
}
