"use client"


import {  } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Users, DollarSign, Check, X } from "lucide-react"

const PESAPAL_BOOKING_URL = "https://store.pesapal.com/escapetours"

export default function SouthernTanzaniaSafariPage() {
  const handleBookNow = () => {
    window.open(PESAPAL_BOOKING_URL, "_blank")
  }

  return (
    <div className="min-h-screen">
     
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] w-full">
          <Image
            src="/images/ruaha.jpg"
            alt="Southern Tanzania Safari"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
              <Badge className="bg-brand-orange text-white mb-4">13 Days</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                Southern Tanzania Safari: Mikumi, Ruaha & Nyerere
              </h1>
              <p className="text-xl text-white/90 max-w-3xl">
                Explore Tanzania's wild and remote southern circuit with incredible wildlife encounters in three
                spectacular national parks
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
                    $21,446 <span className="text-lg font-normal">per person</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-brand-orange" />
                <div>
                  <p className="text-sm text-white/70">Duration</p>
                  <p className="text-xl font-bold">13 Days / 12 Nights</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-brand-orange" />
                <div>
                  <p className="text-sm text-white/70">Group Size</p>
                  <p className="text-xl font-bold">Private Safari</p>
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
                Venture off the beaten path to discover Tanzania's spectacular southern circuit. This 13-day safari
                takes you through Mikumi, Ruaha, and Nyerere (formerly Selous) National Parks—three of Tanzania's most
                pristine and remote wilderness areas. Experience authentic "wild Africa" with fewer tourists and
                abundant wildlife.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                From traditional game drives to thrilling boat safaris on the Rufiji River and adventurous walking
                safaris, this comprehensive tour offers diverse ways to experience Tanzania's incredible biodiversity.
                Encounter massive elephant herds, rare African wild dogs, and an impressive concentration of predators
                in landscapes ranging from baobab-dotted plains to lush rainforests.
              </p>
            </div>
          </div>
        </section>

        {/* Day by Day Itinerary */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-8">Day by Day Itinerary</h2>

            <div className="space-y-6">
              {[
                {
                  day: 1,
                  title: "Arrival in Tanzania",
                  accommodation: "Crowne Plaza (Dar)",
                  meals: "Half Board",
                  description:
                    "Upon arrival at Julius Nyerere International Airport (DAR), you will be met by your Escape Tours driver for a transfer to your hotel in Dar es Salaam. (Lunch & Dinner Included)",
                },
                {
                  day: 2,
                  title: "Dar es Salaam – Mikumi National Park",
                  accommodation: "Mikumi Wildlife Lodge",
                  meals: "Full Board",
                  description:
                    "Pick up from your Dar es Salaam hotel and drive to Mikumi National Park. Arrive in the early afternoon, check-in, have lunch, and then set off for a late afternoon safari drive to get your first glimpse of Mikumi's wildlife.",
                },
                {
                  day: 3,
                  title: "Mikumi & Udzungwa Mountain National Park",
                  accommodation: "Mikumi Wildlife Lodge",
                  meals: "Full Board",
                  description:
                    "After breakfast, drive with packed lunch to Udzungwa Mountain National Park. Enjoy a guided walk in this unique park, famous for its rare plants and endemic primates like the Iringa Red Colobus. Walk through the lush rainforest, relax by waterfalls, and enjoy spectacular views. Return to Mikumi in the late afternoon.",
                },
                {
                  day: 4,
                  title: "Mikumi National Park – Ruaha National Park",
                  accommodation: "Jabali Ridge",
                  meals: "Full Board",
                  description:
                    "After breakfast, depart with a packed lunch for Ruaha National Park. The drive is a long but fascinating 7-hour journey, offering an immersive experience of the Tanzanian countryside before arriving at your lodge/tented camp.",
                },
                {
                  day: 5,
                  title: "Full Day in Ruaha National Park",
                  accommodation: "Jabali Ridge",
                  meals: "Full Board",
                  description:
                    "Spend the first of two full days on safari drives within Ruaha National Park, often referred to as one of Tanzania's best-kept secrets. Its remoteness provides an authentic 'wild Africa' safari impression. Enjoy packed lunches during the day.",
                },
                {
                  day: 6,
                  title: "Full Day in Ruaha National Park",
                  accommodation: "Jabali Ridge",
                  meals: "Full Board",
                  description:
                    "Your second full day of game drives in the vast wilderness of Ruaha. This park is known for its rugged landscape and large concentration of elephants and predators. Return to your lodge/tented camp in the evenings.",
                },
                {
                  day: 7,
                  title: "Ruaha National Park – Mufindi Highlands",
                  accommodation: "Mufindi Highlands Lodge",
                  meals: "Full Board",
                  description:
                    "After breakfast, drive to the Mufindi Highlands, arriving in time for lunch. This area offers a refreshing change of scenery, surrounded by tea estates, montane forest, lakes, and rivers. Choose from activities like walks, fishing, golf, or horseback riding.",
                },
                {
                  day: 8,
                  title: "Full Day in Mufindi Highlands",
                  accommodation: "Mufindi Highlands Lodge",
                  meals: "Full Board",
                  description:
                    "A full day to relax after your safari rigors or participate in the lodge's offered activities. Enjoy the cool climate, stunning scenery, or simply unwind.",
                },
                {
                  day: 9,
                  title: "Mufindi Highlands – Morogoro",
                  accommodation: "Flomi Hotel",
                  meals: "Full Board",
                  description:
                    "After breakfast, drive north towards Dar es Salaam to the town of Morogoro with a packed lunch. Enjoy the local town life and stay overnight at a lodge.",
                },
                {
                  day: 10,
                  title: "Morogoro – Selous/Nyerere National Park",
                  accommodation: "Roho ya Selous",
                  meals: "Full Board",
                  description:
                    "After breakfast, drive with a packed lunch to the vast Selous Game Reserve / Nyerere National Park. The journey is approximately 7 hours through truly wild and untouched areas of Tanzania. Arrive and check in to your accommodation.",
                },
                {
                  day: 11,
                  title: "Full Day in Selous/Nyerere National Park",
                  accommodation: "Roho ya Selous",
                  meals: "Full Board",
                  description:
                    "Start with a full day of traditional safari drives. In the afternoon, enjoy a thrilling boat safari on the mighty Rufiji River, where you will glide past hippos, crocodiles, and abundant birdlife.",
                },
                {
                  day: 12,
                  title: "Full Day in Selous/Nyerere National Park",
                  accommodation: "Roho ya Selous",
                  meals: "Full Board",
                  description:
                    "Wake up early for an adventurous walking safari led by a professional guide and an armed ranger. This offers a unique perspective to learn about the reserve's small details, flora, and fauna. Return for lunch and an afternoon of relaxation.",
                },
                {
                  day: 13,
                  title: "Selous – Dar es Salaam",
                  accommodation: "Crowne Plaza (Dar)",
                  meals: "Breakfast & Lunch",
                  description:
                    "After breakfast, drive back to Dar es Salaam with a packed lunch. Arrive in the early afternoon for drop-off at your hotel or Julius Nyerere International Airport (DAR) for your onward journey.",
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
                    <span className="text-gray-700">
                      Airport transfers (Pick-up and drop-off at Julius Nyerere Airport)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Accommodation and meals as specified (Full Board Days 2-12)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">All game drives, concession fees, and park entry fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Government tax (18% VAT) and service charges</span>
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
                    <span className="text-gray-700">International and domestic flights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Tanzania Visa ($50-$100 depending on nationality)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Meals not listed (Breakfast Day 1, Dinner Day 13)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Accommodation in Dar es Salaam (can be arranged)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Optional activities and excursions</span>
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
            <h2 className="text-3xl md:text-4xl font-black mb-6">Ready for an Authentic Safari Adventure?</h2>
            <p className="text-lg text-white/90 mb-8">
              Book this incredible 13-day southern circuit safari and discover Tanzania's hidden wilderness gems
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
