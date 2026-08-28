"use client"


import {  } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Users, DollarSign, Check, X } from "lucide-react"

const PESAPAL_BOOKING_URL = "https://store.pesapal.com/escapetours"

export default function SafariZanzibarComboPage() {
  const handleBookNow = () => {
    window.open(PESAPAL_BOOKING_URL, "_blank")
  }

  return (
    <div className="min-h-screen">
     
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] w-full">
          <Image
            src="/images/ngorongoro.jpg"
            alt="Tanzania Safari & Zanzibar Beach"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
              <Badge className="bg-brand-orange text-white mb-4">14 Days</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                Tanzania Safari & Zanzibar Beach Escape
              </h1>
              <p className="text-xl text-white/90 max-w-3xl">
                The ultimate Tanzania experience: thrilling wildlife safaris combined with relaxing tropical beach
                paradise
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
                    $8,159 <span className="text-lg font-normal">per person</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-brand-orange" />
                <div>
                  <p className="text-sm text-white/70">Duration</p>
                  <p className="text-xl font-bold">14 Days / 13 Nights</p>
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
                Experience the best of both worlds with this comprehensive 14-day adventure that combines Tanzania's
                most spectacular wildlife safaris with the tropical paradise of Zanzibar. Begin with thrilling game
                drives through the Serengeti and Ngorongoro Crater, then fly to Zanzibar for days of beach relaxation,
                cultural exploration, and island adventures.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                This perfectly balanced itinerary offers the excitement of tracking the Big Five, witnessing the Great
                Migration, and exploring volcanic landscapes, followed by the tranquility of pristine beaches, historic
                Stone Town, and aromatic spice plantations. It's the ultimate Tanzania experience for those who want it
                all.
              </p>
            </div>
          </div>
        </section>

        {/* Day by Day Itinerary - Key highlights shown */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-8">Day by Day Itinerary</h2>

            <div className="space-y-6">
              {[
                {
                  day: 1,
                  title: "Arriving in Moshi/Arusha, Tanzania",
                  accommodation: "Tulia Boutique",
                  meals: "Dinner",
                  description:
                    "Upon arrival at Kilimanjaro International Airport (JRO) or Arusha Airport, you will be met by our welcoming transfer driver and taken to your selected accommodation. Our operations team will meet you for an equipment check and a thorough briefing on your upcoming safari.",
                },
                {
                  day: 2,
                  title: "Tarangire National Park",
                  accommodation: "The Whisper Tarangire",
                  meals: "Full Board",
                  description:
                    "Head to Tarangire, famous for its massive baobab trees and high concentration of elephants. The park's permanent water supply draws a variety of wildlife, including lion, leopard, and cheetah. Enjoy a half-day game drive.",
                },
                {
                  day: 3,
                  title: "Lake Manyara National Park",
                  accommodation: "Hellen's Lodge",
                  meals: "Full Board",
                  description:
                    "Drive to Lake Manyara, nestled at the base of the Great Rift Valley escarpment. The park is renowned for its beauty and diverse game, including elephants, buffalo, wildebeest, giraffe, zebra, and the elusive tree-climbing lions.",
                },
                {
                  day: 4,
                  title: "Lake Natron Safari",
                  accommodation: "Hellen's Lodge",
                  meals: "Full Board",
                  description:
                    "Journey by 4x4 Cruiser to Lake Natron. Optional helicopter flight available (extra cost) to view flamingos, Ol Doinyo Lengai volcano, waterfalls, and the Ngorongoro & Embakai Craters from above.",
                },
                {
                  day: 5,
                  title: "Ngorongoro Crater Tour",
                  accommodation: "Hellen's Lodge",
                  meals: "Full Board",
                  description:
                    "Early morning, descend into the magnificent Ngorongoro Crater for a game drive. Home to a dense population of wildlife, expect to see the Big Five including the rare Black Rhino, lions, elephants, hippos, and flamingos.",
                },
                {
                  day: 6,
                  title: "Ngorongoro – Serengeti National Park",
                  accommodation: "Hippo Trails",
                  meals: "Full Board",
                  description:
                    "After breakfast, drive to the Serengeti. En route, visit Olduvai Gorge, the 'Cradle of Mankind,' an important archaeological site. Proceed to Serengeti National Park, focusing on areas relevant to the Great Wildebeest Migration.",
                },
                {
                  day: 7,
                  title: "Full Day in Serengeti National Park",
                  accommodation: "Hippo Trails",
                  meals: "Full Board",
                  description:
                    "Spend a full day on extensive game drives across the vast plains of the Serengeti, searching for predators and prey. Look out for lions, elephants, giraffes, zebras, and vast herds of migrating wildebeest.",
                },
                {
                  day: 8,
                  title: "Serengeti (Optional Hot Air Balloon Safari)",
                  accommodation: "Hippo Trails",
                  meals: "Full Board",
                  description:
                    "Another full day of game drives in the Serengeti. Optional Activity: Experience an unforgettable early morning Hot Air Balloon Safari over the plains at dawn (extra cost applies).",
                },
                {
                  day: 9,
                  title: "Fly Serengeti – Zanzibar",
                  accommodation: "Park Hyatt (Zanzibar)",
                  meals: "Breakfast",
                  description:
                    "Enjoy breakfast before being transferred to Seronera Airstrip for your scenic domestic flight to Zanzibar. Upon arrival, you will be met and transferred to your hotel in Stone Town for an overnight stay.",
                },
                {
                  day: 10,
                  title: "Relax on the Beaches of Zanzibar",
                  accommodation: "Mizingani Seafront",
                  meals: "Half Board",
                  description:
                    "Enjoy a relaxing day on Zanzibar's beautiful, endless beaches. Choose from a wide range of water sport activities like snorkeling, scuba diving, and boat trips.",
                },
                {
                  day: 11,
                  title: "Zanzibar Prison Island Tour",
                  accommodation: "Mizingani Seafront",
                  meals: "Half Board",
                  description:
                    "Take a trip to Prison Island (Changuu Island), which has a history as a former slave prison and quarantine station. Today, it is famous for its giant Aldabra tortoises.",
                },
                {
                  day: 12,
                  title: "Zanzibar Jozani Forest Tour",
                  accommodation: "Mizingani Seafront",
                  meals: "Half Board",
                  description:
                    "After breakfast, transfer to your beach resort. En route, visit Jozani Forest, the last natural habitat of the rare, endemic Red Colobus Monkey. Explore the fascinating Mangrove Ecosystem boardwalk with a local guide.",
                },
                {
                  day: 13,
                  title: "Stone Town Tour and Spice Tour",
                  accommodation: "Mizingani Seafront",
                  meals: "Full Board",
                  description:
                    "Stone Town Tour: Explore the historic heart of Zanzibar. Spice Tour: An educational and sensory tour providing in-depth information on organically grown spices, herbs, and their traditional uses. Enjoy a sumptuous lunch.",
                },
                {
                  day: 14,
                  title: "Departure - Zanzibar Airport",
                  accommodation: "Upon Request (Extra Cost)",
                  meals: "Breakfast",
                  description:
                    "Enjoy your final breakfast. Check out from the hotel and transfer to Abeid Amani Karume International Airport (ZNZ) for your scheduled flight back home.",
                },
              ].map((item, index) => (
                <div
                  key={item.day}
                  className={`bg-white rounded-lg p-6 shadow-sm border-l-4 ${index % 2 === 0 ? "border-brand-orange" : "border-brand-green"}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`${index % 2 === 0 ? "bg-brand-orange" : "bg-brand-green"} text-white rounded-full w-12 h-12 flex items-center justify-center font-black flex-shrink-0`}
                    >
                      {item.day}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-brand-dark mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Accommodation: {item.accommodation} | Meals: {item.meals}
                      </p>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
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
                    <span className="text-gray-700">Airport transfers (Pick-up and drop-off)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">One-way domestic flight from Serengeti to Zanzibar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Accommodation and meals as specified</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">All park entry fees and concession fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Government VAT (18%) on tour fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Private 4x4 safari vehicle with English-Speaking Driver-Guide</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Bottled mineral water in vehicle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Optional camping gear for camping safari</span>
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
                    <span className="text-gray-700">International and most domestic flights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Tanzania Visa ($50-$100 depending on nationality)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Meals not listed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Optional activities (Hot Air Balloon $599, Lake Natron Helicopter $9,000)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Tips for crew (Recommended: $25/day guide, $15/day cook)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Personal insurance and inoculations</span>
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
            <h2 className="text-3xl md:text-4xl font-black mb-6">Ready for the Ultimate Tanzania Adventure?</h2>
            <p className="text-lg text-white/90 mb-8">
              Book this incredible 14-day safari and beach combo for the perfect blend of adventure and relaxation
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
      < />
      <WhatsAppFloat />
    </div>
  )
}
