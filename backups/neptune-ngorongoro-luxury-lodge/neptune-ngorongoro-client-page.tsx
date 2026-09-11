"use client"


import    from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float";
import  {BookingModal}  from "@/components/booking-modal"
import Image from "next/image"
import { Star, MapPin, Users, Wifi, Coffee, Utensils } from "lucide-react"
import { useState } from "react"

export function NeptuneNgorongoroClientPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
     
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] w-full">
          <Image
            src="/images/hotels/neptune-card.jpg"
            alt="Neptune Ngorongoro Luxury Lodge"
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-balance">
                Neptune Ngorongoro Luxury Lodge
              </h1>
              <div className="flex items-center gap-2 text-lg">
                <MapPin size={20} />
                <span>Karatu, Tanzania - Ngorongoro Crater Highlands</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div>
                <h2 className="text-3xl font-bold text-brand-dark mb-4">About Neptune Ngorongoro Luxury Lodge</h2>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Experience world-class service at Neptune Ngorongoro Luxury Lodge. Situated in the Karatu district,
                    surrounded by the highlands of Tanzania and the world heritage site, the Ngorongoro Crater, this
                    luxurious retreat offers an unforgettable safari experience.
                  </p>
                  <p>
                    The lodge features a swimming pool with sundeck and a spa, providing the perfect setting to relax
                    after a day of adventure. Each luxury suite features a spacious viewing terrace and an open
                    fireplace, with a living room complete with sofa and dining area.
                  </p>
                  <p>
                    The Acacia Restaurant features a formal dining room with an outdoor terrace, serving buffet meals
                    with à la carte options. Special dining experiences at the pool or in the bush can also be arranged
                    for a truly memorable evening.
                  </p>
                  <p>
                    Game drives and guided nature walks into the reserve take place daily. Guests can also arrange to
                    visit a Masai Village to experience traditional dancing and music, immersing themselves in the rich
                    local culture.
                  </p>
                  <p>
                    Wi-Fi is available in the public areas of the lodge. The Arusha Airport is 160 km away from the
                    lodge.
                  </p>
                  <p className="font-semibold text-brand-dark">
                    All-inclusive rates exclude Ngorongoro Crater entry and game drive fees.
                  </p>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-3xl font-bold text-brand-dark mb-6">Amenities</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: Wifi, label: "Free Wi-Fi in Public Areas" },
                    { icon: Utensils, label: "Acacia Restaurant" },
                    { icon: Coffee, label: "Bar & Lounge" },
                    { icon: Users, label: "Swimming Pool & Sundeck" },
                    { icon: MapPin, label: "Spa Services" },
                    { icon: Users, label: "Game Drives" },
                    { icon: MapPin, label: "Guided Nature Walks" },
                    { icon: Users, label: "Cultural Village Visits" },
                  ].map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                      <amenity.icon className="text-brand-tan" size={24} />
                      <span className="text-gray-700">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div>
                <h2 className="text-3xl font-bold text-brand-dark mb-6">Gallery</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { src: "/images/hotels/neptune-env-1.jpg", alt: "Lodge exterior with thatched roofs" },
                    { src: "/images/hotels/neptune-env-2.jpg", alt: "Spa treatment" },
                    { src: "/images/hotels/neptune-env-3.jpg", alt: "Viewing deck with panoramic views" },
                    { src: "/images/hotels/neptune-env-4.jpg", alt: "Wildlife in the area" },
                  ].map((image, index) => (
                    <div key={index} className="relative h-64 rounded-lg overflow-hidden shadow-md">
                      <Image
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-lg shadow-lg p-6 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-brand-dark mb-2">Luxury Suite</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-brand-tan">$1,417</span>
                    <span className="text-gray-600">per night</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">All-inclusive rate (excludes crater fees)</p>
                </div>

                {/* Suite Image */}
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/images/hotels/neptune-suite.jpg"
                    alt="Neptune Luxury Suite"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Suite Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-brand-dark">Suite Features:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-tan mt-1">•</span>
                      <span>Spacious viewing terrace with crater views</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-tan mt-1">•</span>
                      <span>Open fireplace for cozy evenings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-tan mt-1">•</span>
                      <span>Living room with sofa and dining area</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-tan mt-1">•</span>
                      <span>Luxury bedding and en-suite bathroom</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-tan mt-1">•</span>
                      <span>All-inclusive meals and beverages</span>
                    </li>
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="block w-full bg-[#f4d03f] hover:bg-[#f4d03f]/90 text-black font-bold py-4 px-6 rounded-lg text-center transition-colors text-lg"
                >
                  Book Now
                </button>

                <p className="text-xs text-gray-500 text-center">Contact us for availability and special packages</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      < />
      <WhatsAppFloat />
      <{BookingModal}
        isOpen={isBookingOpen}
        onCloseAction={() => setIsBookingOpen(false)}
        hotelName="Neptune Ngorongoro Luxury Lodge"
        roomCategories={["Luxury Suite"]}
        defaultCategory="Luxury Suite"
        roomPrices={{ "Luxury Suite": 1417 }}
      />
    </div>
  )
}

export default NeptuneNgorongoroClientPage
