"use client"

import  Footer  from "@/components/footer"
import  WhatsAppFloat  from "@/components/whatsapp-float"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Users, DollarSign, Check, X } from "lucide-react"

const PESAPAL_BOOKING_URL = "https://store.pesapal.com/escapetours"

export default function ZanzibarBeachEscapePage() {
  const handleBookNow = () => {
    window.open(PESAPAL_BOOKING_URL, "_blank")
  }

  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] w-full">
          <Image
            src="/images/zanzibar-beach-paradise.jpg"
            alt="Zanzibar Beach"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
              <Badge className="bg-brand-orange text-white mb-4">10 Days</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                Zanzibar Island & Beach Relaxation Escape
              </h1>
              <p className="text-xl text-white/90 max-w-3xl">
                Immerse yourself in the tropical paradise of Zanzibar with pristine beaches, historic Stone Town, and
                unforgettable island experiences
              </p>
            </div>
          </div>
        </section>

        {/* Price & Quick Info */}
        <section className="bg-brand-dark text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-brand-orange" />
                <div>
                  <p className="text-sm text-white/70">Price from</p>
                  <p className="text-3xl font-black">
                    $6,500 <span className="text-lg font-normal">per person</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-brand-orange" />
                <div>
                  <p className="text-sm text-white/70">Duration</p>
                  <p className="text-xl font-bold">10 Days / 9 Nights</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-brand-orange" />
                <div>
                  <p className="text-sm text-white/70">Group Size</p>
                  <p className="text-xl font-bold">Flexible</p>
                </div>
              </div>
              <Button onClick={handleBookNow} size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white">
                Book This Tour
              </Button>
            </div>
          </div>
        </section>

        {/* Tour Overview */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-8">Tour Overview</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed">
                Experience the magic of Zanzibar with this comprehensive 10-day island escape. From the historic streets
                of Stone Town to the pristine beaches of Nungwi, from aromatic spice plantations to swimming with
                dolphins and sea turtles, this itinerary offers the perfect blend of culture, adventure, and relaxation.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Discover why Zanzibar is called the "Spice Island," explore UNESCO World Heritage sites, encounter giant
                tortoises on Prison Island, and unwind on some of Africa's most beautiful beaches. This tour is designed
                for travelers seeking both cultural immersion and tropical paradise.
              </p>
            </div>
          </div>
        </section>

        {/* Day by Day Itinerary */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-8">Day by Day Itinerary</h2>

            <div className="space-y-6">
              {/* Day 1 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-brand-orange">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-orange text-white rounded-full w-12 h-12 flex items-center justify-center font-black flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-brand-dark mb-2">Arriving in Zanzibar</h3>
                    <p className="text-sm text-gray-600 mb-3">Accommodation: Maru Maru Hotel | Meals: Dinner</p>
                    <p className="text-gray-700">
                      Drop off at Julius Nyerere International Airport (DAR) for your flight to Zanzibar. Upon arrival
                      at Zanzibar Airport (ZNZ), you will be transferred to your selected hotel for dinner and
                      overnight.
                    </p>
                  </div>
                </div>
              </div>

              {/* Day 2 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-brand-green">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-green text-white rounded-full w-12 h-12 flex items-center justify-center font-black flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-brand-dark mb-2">Zanzibar Stone Town Tour</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Accommodation: Park Hyatt | Meals: Full Board
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Morning:</strong> Arrive in Stone Town, admire the famed Zanzibari doors, and enjoy a
                      traditional lunch (e.g., at 6 Degrees South).
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Afternoon:</strong> Take a walking tour to historic sites like the Old Fort and Christ
                      Church Cathedral.
                    </p>
                    <p className="text-gray-700">
                      <strong>Evening:</strong> Enjoy dinner at the magical Tea House Restaurant, arriving early to
                      watch the sunset over Stone Town.
                    </p>
                  </div>
                </div>
              </div>

              {/* Day 3 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-brand-orange">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-orange text-white rounded-full w-12 h-12 flex items-center justify-center font-black flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-brand-dark mb-2">Zanzibar Spice Tour</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Accommodation: Park Hyatt | Meals: Full Board
                    </p>
                    <p className="text-gray-700">
                      Embark on a special Spice Tour providing in-depth information about spices, organically grown
                      herbs, and their traditional uses in medicine and cooking. After the educational tour, enjoy a
                      sumptuous lunch at a local eatery where you can sample the spices and fruits.
                    </p>
                  </div>
                </div>
              </div>

              {/* Day 4 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-brand-green">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-green text-white rounded-full w-12 h-12 flex items-center justify-center font-black flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-brand-dark mb-2">Jambiani Beach & The Rock Restaurant</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Accommodation: Ycona Luxury Resort | Meals: Full Board
                    </p>
                    <p className="text-gray-700">
                      Head to Jambiani Beach for leisure—swim in the aqua waters, learn to play bao, or take a cooking
                      class (optional). Later, drive 20 minutes to The Rock Restaurant in Michamvi, a tiny, iconic
                      restaurant perched on a rock in the Indian Ocean, for an unforgettable lunch experience.
                    </p>
                  </div>
                </div>
              </div>

              {/* Day 5 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-brand-orange">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-orange text-white rounded-full w-12 h-12 flex items-center justify-center font-black flex-shrink-0">
                    5
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-brand-dark mb-2">Nungwi Beach Leisure</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Accommodation: Essque Zalu | Meals: Full Board
                    </p>
                    <p className="text-gray-700">
                      Travel to the northern tip of the island, Nungwi Beach. Spend the day relaxing, snorkeling, or
                      engaging in water activities like kayaking and paddleboarding. Explore local markets and enjoy
                      fresh seafood at one of the beachfront restaurants.
                    </p>
                  </div>
                </div>
              </div>

              {/* Day 6 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-brand-green">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-green text-white rounded-full w-12 h-12 flex items-center justify-center font-black flex-shrink-0">
                    6
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-brand-dark mb-2">
                      Dolphin Watching, Turtle Aquarium & Sunset Cruise
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Accommodation: Essque Zalu | Meals: Full Board
                    </p>
                    <p className="text-gray-700">
                      Start with an early morning boat trip to Mnemba Island for dolphin watching and swimming with
                      dolphins. Enjoy tropical fruit on the boat. Have lunch on the island, then visit the Baraka
                      Aquarium in Nungwi to swim with turtles. Conclude the day with a sunset cruise at Kendwa before
                      returning to the hotel.
                    </p>
                  </div>
                </div>
              </div>

              {/* Day 7 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-brand-orange">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-orange text-white rounded-full w-12 h-12 flex items-center justify-center font-black flex-shrink-0">
                    7
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-brand-dark mb-2">Jozani Forest Tour</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Accommodation: Essque Zalu | Meals: Full Board
                    </p>
                    <p className="text-gray-700">
                      After breakfast, drive to your beach resort. En route, stop at Jozani Forest, the last habitat of
                      the rare endemic Red Colobus Monkey. Stroll through the park with a local guide and explore the
                      fascinating Mangrove Ecosystem boardwalk.
                    </p>
                  </div>
                </div>
              </div>

              {/* Day 8 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-brand-green">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-green text-white rounded-full w-12 h-12 flex items-center justify-center font-black flex-shrink-0">
                    8
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-brand-dark mb-2">Prison Island & Sandbank Picnic</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Accommodation: Essque Zalu | Meals: Full Board
                    </p>
                    <p className="text-gray-700">
                      Take a boat trip to Prison Island (Changuu Island) to visit the giant tortoises. This is followed
                      by a serene picnic lunch on a secluded sandbank, offering beautiful scenic views and peaceful
                      surroundings. Return to the main island for a relaxing evening.
                    </p>
                  </div>
                </div>
              </div>

              {/* Day 9 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-brand-orange">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-orange text-white rounded-full w-12 h-12 flex items-center justify-center font-black flex-shrink-0">
                    9
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-brand-dark mb-2">Relaxation at the Resort</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Accommodation: Essque Zalu | Meals: Full Board
                    </p>
                    <p className="text-gray-700 mb-3">
                      Spend your last full day at your resort. This is a dedicated relaxation day—lounge by the pool or
                      beach, indulge in a spa treatment, or arrange a private beach dinner to celebrate your trip.
                    </p>
                    <p className="text-gray-700 font-semibold">Included: Snorkeling, Scuba diving, Massage & Spa</p>
                  </div>
                </div>
              </div>

              {/* Day 10 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-brand-green">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-green text-white rounded-full w-12 h-12 flex items-center justify-center font-black flex-shrink-0">
                    10
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-brand-dark mb-2">Departure - Zanzibar Airport</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Accommodation: Upon request at extra cost | Meals: Breakfast & Lunch
                    </p>
                    <p className="text-gray-700">
                      After breakfast, you will be transferred to Zanzibar Airport (ZNZ) for your international flight
                      out of Tanzania and Zanzibar Island. Bid a fond farewell to the Spice Island.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing & Inclusions */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* What's Included */}
              <div className="bg-green-50 rounded-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-600 rounded-full p-2">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-brand-dark">What's Included</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Pick up and drop off at Zanzibar Airport (ZNZ)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Accommodation and meals as specified (Full Board Days 2-9)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      All Zanzibar tours and activities (Prison Island, Spice Tour, Jozani Forest, Dolphin Watch, Sunset
                      Cruise)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">All park entry fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Ground transportation with English-Speaking Driver-Guide</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Traditional Zanzibar Dhow sailing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Government tax (18% VAT) and service charges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Bottled mineral water in vehicle</span>
                  </li>
                </ul>
              </div>

              {/* What's Not Included */}
              <div className="bg-red-50 rounded-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-red-600 rounded-full p-2">
                    <X className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-brand-dark">What's Not Included</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">International and domestic flights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Tanzania Visa ($50-$100 depending on nationality)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Meals not listed (Breakfast & Lunch Day 1, Dinner Day 10)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Optional activities and diving/swimming gear</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Tips for crew (Recommended: $25/day guide, $15/day cook)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Personal insurance (Travel, Medical, Baggage)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Beverages, laundry, souvenirs, and personal expenses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Holiday surcharges ($40/day Christmas/New Year, $35 Easter)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-brand-orange text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6">Ready to Experience Zanzibar?</h2>
            <p className="text-lg text-white/90 mb-8">
              Book this incredible 10-day island escape and create memories that will last a lifetime
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={handleBookNow} size="lg" className="bg-white text-brand-orange hover:bg-gray-100">
                Book This Tour
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/packages">View All Packages</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}