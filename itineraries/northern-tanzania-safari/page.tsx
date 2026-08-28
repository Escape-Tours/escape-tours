


import   from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {Image} from "next/image"
import { Calendar, Users, DollarSign, Check, X } from "lucide-react"

const PESAPAL_BOOKING_URL = "https://store.pesapal.com/escapetours"

export default function NorthernTanzaniaSafariPage() {
  const handleBookNow = () => {
    window.open(PESAPAL_BOOKING_URL, "_blank")
  }

  return (
    <div className="min-h-screen">
     
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] w-full">
          <Image
            src="/images/serengeti.jpg"
            alt="Northern Tanzania Safari - Great Migration"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
              <Badge className="bg-brand-orange text-white mb-4">11 Days</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                Northern Tanzania Safari: Serengeti & Ngorongoro
              </h1>
              <p className="text-xl text-white/90 max-w-3xl">
                Witness the legendary Great Migration and explore Africa's most iconic wildlife destinations
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
                    $7,956 <span className="text-lg font-normal">per person</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-brand-orange" />
                <div>
                  <p className="text-sm text-white/70">Duration</p>
                  <p className="text-xl font-bold">11 Days / 10 Nights</p>
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
                Experience the ultimate Tanzania safari adventure through the legendary northern circuit. This 11-day
                journey takes you to the world-famous Serengeti National Park to witness the Great Migration, descend
                into the spectacular Ngorongoro Crater—one of Africa's Seven Wonders—and encounter authentic Tanzanian
                culture with the Hadzabe tribe.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Track massive herds of wildebeest and zebra across endless plains, search for the Big Five in diverse
                ecosystems, and immerse yourself in landscapes that have captivated explorers for centuries. This
                comprehensive safari combines thrilling wildlife encounters with cultural experiences for an
                unforgettable African adventure.
              </p>
            </div>
          </div>
        </section>

        {/* Day by Day Itinerary - Abbreviated for space */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-8">Day by Day Itinerary</h2>

            <div className="space-y-6">
              {[
                {
                  day: 1,
                  title: "Arrival in Arusha",
                  accommodation: "Hellen's Lodge",
                  meals: "Lunch & Dinner",
                  description:
                    "You will be met by an Escape Tours representative at the airport (JRO or Arusha Airport) and transferred to your accommodation in Arusha to relax and prepare for the exciting adventures ahead.",
                },
                {
                  day: 2,
                  title: "Tarangire National Park",
                  accommodation: "Hellen's Lodge",
                  meals: "Full Board",
                  description:
                    "After breakfast, depart for a full-day game drive in Tarangire National Park. Explore its diverse landscapes, dotted with giant baobab trees. The Tarangire River attracts an abundance of wildlife, including elephant, lion, leopard, and a variety of colorful birds.",
                },
                {
                  day: 3,
                  title: "Tarangire to Serengeti National Park",
                  accommodation: "Hippo Trails",
                  meals: "Full Board",
                  description:
                    "Set out for the world-renowned Serengeti National Park, driving up through the highlands and past the spectacular Ngorongoro Crater. Spread out before you is the vast Serengeti, home to over three million large animals and the legendary Great Migration.",
                },
                {
                  day: 4,
                  title: "Serengeti National Park Central",
                  accommodation: "Hippo Trails",
                  meals: "Full Board",
                  description:
                    "Spend a full day on a game drive in the Serengeti, focusing on areas known for high wildlife concentration. Our guide will track the herds, whose location is determined by rainfall and the season.",
                },
                {
                  day: 5,
                  title: "Serengeti: Following the Migration",
                  accommodation: "Hippo Trails",
                  meals: "Full Board",
                  description:
                    "Rumble across the Serengeti's vast plains in search of the Great Migration. Depending on the time of year, this may take you to the remote North near the Kenyan border or the Southern Ndutu Region.",
                },
                {
                  day: 6,
                  title: "Serengeti: Exploring Landscapes",
                  accommodation: "Hippo Trails",
                  meals: "Full Board",
                  description:
                    "Enjoy a hearty breakfast before another full day of game drives, exploring the Serengeti's vast plains, incredible landscapes, and abundant wildlife. Continue to traverse the park in search of the migration.",
                },
                {
                  day: 7,
                  title: "Serengeti: The Big Five",
                  accommodation: "Hippo Trails",
                  meals: "Full Board",
                  description:
                    "Enjoy one final game drive in the Serengeti. Today, focus on spotting the 'Big Five' – lion, elephant, buffalo, rhino, and leopard, alongside other diverse species.",
                },
                {
                  day: 8,
                  title: "Ngorongoro Crater",
                  accommodation: "Bougainvillea",
                  meals: "Full Board",
                  description:
                    "Very early in the morning, descend into the Ngorongoro Crater floor for a day of spectacular wildlife viewing in one of the Seven Wonders of Africa. Enjoy a delectable picnic lunch near the hippo lake.",
                },
                {
                  day: 9,
                  title: "Lake Manyara National Park",
                  accommodation: "Hellen's Lodge",
                  meals: "Full Board",
                  description:
                    "Drive to Lake Manyara National Park. The shallow soda lake is home to thousands of flamingos (season permitting) and over 500 other bird species. Look for elephants and the famous tree-climbing lions.",
                },
                {
                  day: 10,
                  title: "Cultural Experience: The Hadzabe Tribe",
                  accommodation: "Hellen's Lodge",
                  meals: "Full Board",
                  description:
                    "Wake up early to drive to the Hadzabe area to meet this nomadic tribe, one of the last true hunter-gatherer communities in Africa. You will join them for an explanation of their culture and participate in their daily activities.",
                },
                {
                  day: 11,
                  title: "Departure",
                  accommodation: "Hellen's Lodge",
                  meals: "Breakfast",
                  description:
                    "After breakfast, check out from the hotel and enjoy a transfer to Arusha Airport for your scheduled flight back home. End of safari.",
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
                    <span className="text-gray-700">Pick up and drop off at Kilimanjaro (JRO) or Arusha Airport</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Accommodation and meals as specified (Full Board Days 2-10)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Game drives and all park entry fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">18% VAT and service charges</span>
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
                    <span className="text-gray-700">Meals not listed (Breakfast Day 1, Lunch/Dinner Day 11)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Optional Serengeti Hot Air Balloon Ride ($599 per person)</span>
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
            <h2 className="text-3xl md:text-4xl font-black mb-6">Ready to Witness the Great Migration?</h2>
            <p className="text-lg text-white/90 mb-8">
              Book this incredible 11-day northern circuit safari and experience Africa's most iconic wildlife spectacle
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
