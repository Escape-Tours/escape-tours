"use client";


import   from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float";
import  {BookingModal}  from "@/components/booking-modal"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bath, Bed, Coffee, MapPin, Phone, Star, Utensils, Wifi, BuildingIcon as SwimmingPool } from "lucide-react"
import { useState } from "react"

const rooms = [
  {
    name: "Standard Room",
    price: 120,
    image: "/images/hotels/mm-zanzibar-standard.jpg",
    features: ["Queen Bed", "Private Bathroom", "Air Conditioning", "WiFi"],
  },
  {
    name: "Deluxe Room",
    price: 150,
    image: "/images/hotels/mm-zanzibar-deluxe.jpg",
    features: ["King Bed", "Premium Bathroom", "Air Conditioning", "WiFi", "Mini Bar"],
  },
  {
    name: "Suite",
    price: 200,
    image: "/images/hotels/mm-zanzibar-suite.jpg",
    features: ["King Bed", "Living Area", "Luxury Bathroom", "Air Conditioning", "WiFi", "Mini Bar", "Balcony"],
  },
]

export default function MMHotelZanzibarPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<string>("Standard Room")

  const handleBookRoom = (roomName: string) => {
    setSelectedRoom(roomName)
    setIsBookingOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
     
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] w-full">
          <Image
            src="/images/hotels/mm-zanzibar-card.jpg"
            alt="M&M Hotel Zanzibar"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={20} className="fill-[#f4d03f] text-[#f4d03f]" />
                ))}
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-4">M&M Hotel Zanzibar</h1>
              <div className="flex items-center gap-2 text-lg">
                <MapPin size={20} />
                <span>Zanzibar, Tanzania</span>
              </div>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-black text-brand-dark mb-6">Welcome to Paradise</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                M&M Hotel Zanzibar offers a tranquil beachside retreat with modern amenities and warm Zanzibari
                hospitality. Located on the stunning shores of Zanzibar, our hotel features beautifully appointed rooms,
                a refreshing swimming pool, and an exceptional restaurant serving local and international cuisine.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Whether you're seeking relaxation by the pool, enjoying fresh seafood at our beachside restaurant, or
                exploring the rich culture of Zanzibar, M&M Hotel provides the perfect base for your island getaway.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our attentive staff is dedicated to making your stay memorable with personalized service and attention
                to detail. Experience the magic of Zanzibar at M&M Hotel.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image src="/images/hotels/mm-zanzibar-pool-1.jpg" alt="Hotel Pool" fill className="object-cover" />
              </div>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image src="/images/hotels/mm-zanzibar-bar.jpg" alt="Hotel Bar" fill className="object-cover" />
              </div>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src="/images/hotels/mm-zanzibar-cocktails.jpg"
                  alt="Hotel Cocktails"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src="/images/hotels/mm-zanzibar-bathroom.jpg"
                  alt="Hotel Bathroom"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-black text-brand-dark mb-8 text-center">Hotel Amenities</h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-hover hover:shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <SwimmingPool className="h-10 w-10 text-brand-tan mb-3" />
                  <h3 className="font-bold text-brand-dark">Swimming Pool</h3>
                </CardContent>
              </Card>
              div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-hover hover:shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Utensils className="h-10 w-10 text-brand-tan mb-3" />
                  <h3 className="font-bold text-brand-dark">Restaurant & Bar</h3>
                </CardContent>
              </Card>
              div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-hover hover:shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Wifi className="h-10 w-10 text-brand-tan mb-3" />
                  <h3 className="font-bold text-brand-dark">Free WiFi</h3>
                </CardContent>
              </Card>
              div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-hover hover:shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Coffee className="h-10 w-10 text-brand-tan mb-3" />
                  <h3 className="font-bold text-brand-dark">Beach Access</h3>
                </CardContent>
              </Card>
              div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-hover hover:shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <MapPin className="h-10 w-10 text-brand-tan mb-3" />
                  <h3 className="font-bold text-brand-dark">Prime Location</h3>
                </CardContent>
              </Card>
              div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-hover hover:shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Bath className="h-10 w-10 text-brand-tan mb-3" />
                  <h3 className="font-bold text-brand-dark">Modern Bathrooms</h3>
                </CardContent>
              </Card>
              div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-hover hover:shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Phone className="h-10 w-10 text-brand-tan mb-3" />
                  <h3 className="font-bold text-brand-dark">24/7 Reception</h3>
                </CardContent>
              </Card>
              div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-hover hover:shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Bed className="h-10 w-10 text-brand-tan mb-3" />
                  <h3 className="font-bold text-brand-dark">Comfortable Rooms</h3>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Rooms & Rates */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-brand-dark mb-8 text-center">Rooms & Rates</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <Card key={room.name} className="overflow-hidden">
                <div className="relative h-64 w-full">
                  <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-brand-dark mb-2">{room.name}</h3>
                  <p className="text-3xl font-black text-brand-tan mb-4">
                    ${room.price}
                    <span className="text-sm font-normal text-gray-600"> / night</span>
                  </p>
                  <ul className="space-y-2 mb-6">
                    {room.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-gray-700">
                        <div className="h-1.5 w-1.5 rounded-full bg-brand-tan" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full bg-[#f4d03f] hover:bg-[#f4d03f]/90 text-black font-bold"
                    onClick={() => handleBookRoom(room.name)}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-dark to-brand-tan text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to Experience Paradise?</h2>
            <p className="text-lg mb-8 text-white/90">
              Book your stay at M&M Hotel Zanzibar and enjoy world-class service in a tropical setting.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" onClick={() => setIsBookingOpen(true)}>
                Book Your Stay
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white text-white hover:bg-white/20"
                asChild
              >
                <Link href="/hotels">View All Hotels</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      < />
      <WhatsAppFloat />
      <{BookingModal}
        isOpen={isBookingOpen}
        onCloseAction={() => setIsBookingOpen(false)}
        hotelName="M&M Hotel Zanzibar"
        roomCategories={["Standard Room", "Deluxe Room", "Suite"]}
        defaultCategory={selectedRoom}
        roomPrices={{
          "Standard Room": 120,
          "Deluxe Room": 150,
          Suite: 200,
        }}
      />
    </div>
  )
}
