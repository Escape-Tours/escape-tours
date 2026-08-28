

import {Image} from "next/image"


import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Utensils, Check } from "lucide-react"

const PESAPAL_BOOKING_URL = "https://store.pesapal.com/escapetours"

export default function EastAfricanResidentsPage() {
  const handleBookNow = () => {
    window.open(PESAPAL_BOOKING_URL, "_blank")
  }

  return (
    <div className="min-h-screen bg-white">
     
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] w-full">
          <Image
            src="/images/itineraries/ear-package.jpg"
            alt="East African Residents Safari Package"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                East African Residents Package
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-6">Ngorongoro, Serengeti & Manyara Safari</p>
              <div className="flex flex-wrap gap-4 justify-center text-white/90 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  <span>5 Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={20} />
                  <span>Northern Circuit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={20} />
                  <span>All Ages</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Price Banner */}
        <section className="bg-brand-orange py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-white text-3xl md:text-4xl font-black">
              From $2,500 <span className="text-xl font-normal">per person</span>
            </p>
            <p className="text-white/90 mt-2">Special rates for East African residents</p>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-6">Safari Overview</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              This exclusive package is designed specifically for East African residents who want to experience
              Tanzania's most iconic wildlife destinations at special resident rates. Journey through the legendary
              Ngorongoro Crater, explore the vast Serengeti plains, and discover the diverse wildlife of Lake Manyara
              National Park.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Stay at comfortable lodges including Hellen's Lodge, Hippo Trails, and Marera Village Lodge, each offering
              authentic Tanzanian hospitality and stunning views of the surrounding landscapes.
            </p>
          </div>
        </section>

        {/* Itinerary Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-12 text-center">Day by Day Itinerary</h2>

            <div className="space-y-8">
              {/* Day 1 */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-orange text-white font-black text-xl w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-brand-dark mb-2">Arrival at Hellen's Lodge</h3>
                    <p className="text-gray-700 mb-4">
                      Arrive at Hellen's Lodge in Karatu, your comfortable base for the first part of your safari
                      adventure. Settle into your room, enjoy the lodge facilities, and prepare for the exciting days
                      ahead. Evening briefing about the safari and dinner at the lodge.
                    </p>
                    <div className="flex items-center gap-2 text-brand-orange">
                      <Utensils size={18} />
                      <span className="text-sm font-semibold">Dinner Included</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day 2 */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-orange text-white font-black text-xl w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-brand-dark mb-2">Ngorongoro Crater Game Drive</h3>
                    <p className="text-gray-700 mb-4">
                      <strong>Morning:</strong> Early breakfast at Hellen's Lodge followed by departure to Ngorongoro
                      Crater, one of Africa's most spectacular wildlife destinations. Descend 600 meters into the crater
                      floor for a full day game drive in this UNESCO World Heritage Site. Spot the Big Five and witness
                      the incredible concentration of wildlife in this natural amphitheater. Picnic lunch on the crater
                      floor.
                    </p>
                    <p className="text-gray-700 mb-4">
                      <strong>Evening:</strong> Ascend from the crater and return to Hellen's Lodge for dinner and
                      overnight stay.
                    </p>
                    <div className="flex items-center gap-2 text-brand-orange">
                      <Utensils size={18} />
                      <span className="text-sm font-semibold">All Meals Included</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day 3 */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-orange text-white font-black text-xl w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-brand-dark mb-2">Serengeti National Park</h3>
                    <p className="text-gray-700 mb-4">
                      <strong>Morning:</strong> After breakfast, depart for the legendary Serengeti National Park. Enjoy
                      game viewing en route through the Ngorongoro Conservation Area. Enter the Serengeti and continue
                      with afternoon game drive in search of the Great Migration (seasonal) and resident wildlife
                      including lions, leopards, cheetahs, and elephants.
                    </p>
                    <p className="text-gray-700 mb-4">
                      <strong>Evening:</strong> Arrive at Hippo Trails camp for check-in, dinner, and overnight stay
                      under the African stars.
                    </p>
                    <div className="flex items-center gap-2 text-brand-orange">
                      <Utensils size={18} />
                      <span className="text-sm font-semibold">All Meals Included</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day 4 */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-orange text-white font-black text-xl w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-brand-dark mb-2">Manyara Transition</h3>
                    <p className="text-gray-700 mb-4">
                      <strong>Morning:</strong> Early breakfast and departure from Hippo Trails. Journey towards Lake
                      Manyara with game viewing en route.
                    </p>
                    <p className="text-gray-700 mb-4">
                      <strong>Afternoon:</strong> Arrive at Marera Village Lodge in Karatu. Check-in, relax, and enjoy
                      the lodge amenities. Evening at leisure to rest after the journey.
                    </p>
                    <div className="flex items-center gap-2 text-brand-orange">
                      <Utensils size={18} />
                      <span className="text-sm font-semibold">All Meals Included</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day 5 */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-orange text-white font-black text-xl w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    5
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-brand-dark mb-2">Lake Manyara & Departure</h3>
                    <p className="text-gray-700 mb-4">
                      <strong>Morning:</strong> Final breakfast at Marera Village Lodge. Depart for Lake Manyara
                      National Park for a morning game drive. Famous for its tree-climbing lions, large elephant herds,
                      and flamingos along the lake shore, Manyara offers diverse habitats from groundwater forest to
                      acacia woodland and the alkaline lake itself.
                    </p>
                    <p className="text-gray-700 mb-4">
                      <strong>Afternoon:</strong> After the game drive and picnic lunch, depart from Lake Manyara and
                      drive back to Arusha or your onward destination, marking the end of your memorable East African
                      safari adventure.
                    </p>
                    <div className="flex items-center gap-2 text-brand-orange">
                      <Utensils size={18} />
                      <span className="text-sm font-semibold">Breakfast & Lunch Included</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inclusions Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Included */}
            <div>
              <h3 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-2">
                <Check className="text-brand-green" size={28} />
                What's Included
              </h3>
              <ul className="space-y-3">
                {[
                  "4 nights accommodation (Hellen's Lodge, Hippo Trails, Marera)",
                  "All meals as specified in itinerary",
                  "Professional safari guide",
                  "4x4 safari vehicle with pop-up roof",
                  "Park fees for Ngorongoro, Serengeti, and Manyara",
                  "Crater service fees",
                  "Game drives as per itinerary",
                  "Bottled water during game drives",
                  "Government taxes and VAT",
                  "Special East African resident rates",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check size={20} className="text-brand-green mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Included */}
            <div>
              <h3 className="text-2xl font-black text-brand-dark mb-6">Not Included</h3>
              <ul className="space-y-3">
                {[
                  "International flights",
                  "Travel insurance",
                  "Visa fees",
                  "Personal expenses and tips",
                  "Alcoholic beverages",
                  "Optional activities not mentioned",
                  "Laundry services",
                  "Phone calls and WiFi charges",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-gray-400 mt-1">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-brand-dark text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6">Book Your East African Residents Safari</h2>
            <p className="text-lg text-white/90 mb-8">
              Special rates exclusively for East African residents. Experience Tanzania's iconic wildlife destinations.
            </p>
            <Button
              onClick={handleBookNow}
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8"
            >
              Book This Tour
            </Button>
          </div>
        </section>
      </main>
      
      <WhatsAppFloat />
    </div>
  )
}
