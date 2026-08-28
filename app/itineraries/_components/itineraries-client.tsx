"use client"


import {  } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, DollarSign } from "lucide-react"

const PESAPAL_BOOKING_URL = "https://store.pesapal.com/escapetours"

const tours = [
  {
    id: "east-african-residents",
    title: "5-Day East African Residents Package: Ngorongoro, Serengeti & Manyara",
    shortTitle: "East African Residents Package",
    description:
      "Special package designed for East African residents to explore Tanzania's iconic northern circuit parks including Ngorongoro Crater, Serengeti, and Lake Manyara at special resident rates.",
    image: "/images/itineraries/ear-package.jpg",
    duration: "5 Days",
    price: "2,500",
    highlights: [
      "Ngorongoro Crater Floor Safari",
      "Serengeti National Park Game Drive",
      "Lake Manyara Wildlife Viewing",
      "Accommodation at Hellen's Lodge & Hippo Trails",
      "Special East African Resident Rates",
    ],
  },
  {
    id: "zanzibar-beach-escape",
    title: "10-Day Zanzibar Island & Beach Relaxation Escape",
    shortTitle: "Zanzibar Beach Escape",
    description:
      "Immerse yourself in the tropical paradise of Zanzibar with pristine beaches, historic Stone Town, spice tours, and unforgettable island experiences.",
    image: "/images/zanzibar-beach-paradise.jpg",
    duration: "10 Days",
    price: "6,500",
    highlights: [
      "Stone Town UNESCO Heritage Site",
      "Spice Farm Tours",
      "Prison Island & Giant Tortoises",
      "Dolphin Watching at Mnemba",
      "Jozani Forest Red Colobus Monkeys",
    ],
  },
  {
    id: "southern-tanzania-safari",
    title: "13-Day Southern Tanzania Safari: Mikumi, Ruaha & Nyerere",
    shortTitle: "Southern Tanzania Safari",
    description:
      "Explore Tanzania's wild and remote southern circuit with incredible wildlife encounters in Mikumi, Ruaha, and Nyerere National Parks.",
    image: "/images/ruaha.jpg",
    duration: "13 Days",
    price: "21,446",
    highlights: [
      "Ruaha National Park - Tanzania's Best-Kept Secret",
      "Boat Safari on Rufiji River",
      "Walking Safari in Nyerere",
      "Udzungwa Mountain Rainforest",
      "Mufindi Highlands Tea Estates",
    ],
  },
  {
    id: "northern-tanzania-safari",
    title: "11-Day Northern Tanzania Safari: Serengeti & Ngorongoro",
    shortTitle: "Northern Tanzania Safari",
    description:
      "Witness the legendary Great Migration, explore the Ngorongoro Crater, and experience authentic cultural encounters with the Hadzabe tribe.",
    image: "/images/serengeti.jpg",
    duration: "11 Days",
    price: "7,956",
    highlights: [
      "Great Wildebeest Migration",
      "Ngorongoro Crater - 7th Wonder",
      "Serengeti Big Five Safari",
      "Hadzabe Tribe Cultural Experience",
      "Lake Manyara Tree-Climbing Lions",
    ],
  },
  {
    id: "safari-zanzibar-combo",
    title: "14-Day Tanzania Safari & Zanzibar Beach Escape",
    shortTitle: "Safari & Beach Combo",
    description:
      "The ultimate Tanzania experience combining thrilling wildlife safaris in Serengeti and Ngorongoro with relaxing beach days in Zanzibar.",
    image: "/images/ngorongoro.jpg",
    duration: "14 Days",
    price: "8,159",
    highlights: [
      "Serengeti & Ngorongoro Safari",
      "Optional Hot Air Balloon Safari",
      "Lake Natron & Flamingos",
      "Zanzibar Beach Relaxation",
      "Stone Town & Spice Tours",
    ],
  },
  {
    id: "ruaha-zanzibar-combo",
    title: "7-Day Southern Tanzania Safari (Ruaha) & Zanzibar Escape",
    shortTitle: "Ruaha & Zanzibar Combo",
    description:
      "Experience the wild beauty of Ruaha National Park followed by tropical relaxation in Zanzibar with dolphin tours and forest exploration.",
    image: "/images/mikumi.jpg",
    duration: "7 Days",
    price: "4,376",
    highlights: [
      "Ruaha National Park Game Drives",
      "Prison Island Giant Tortoises",
      "Kizimkazi Dolphin Tour",
      "Jozani Forest Red Colobus Monkeys",
      "Stone Town Cultural Experience",
    ],
  },
  {
    id: "kilimanjaro-marangu",
    title: "8-Day Mount Kilimanjaro Marangu Route Trek",
    shortTitle: "Kilimanjaro Marangu Route",
    description:
      "Climb Africa's highest peak via the Marangu Route with comfortable hut accommodation. Known as the 'Coca-Cola Route' for its gradual ascent.",
    image: "/images/marangu.jpg",
    duration: "8 Days",
    price: "2,986",
    highlights: [
      "Hut Accommodation on Mountain",
      "Acclimatization Day at Horombo",
      "Summit Uhuru Peak (5,895m)",
      "Rainforest & Alpine Desert Zones",
      "Summit Certificate Included",
    ],
  },
  {
    id: "kilimanjaro-machame",
    title: "9-Day Mount Kilimanjaro Machame Route Trek",
    shortTitle: "Kilimanjaro Machame Route",
    description:
      "Conquer Kilimanjaro via the scenic Machame Route, known as the 'Whiskey Route'. Features stunning views and excellent acclimatization.",
    image: "/images/machame.jpg",
    duration: "9 Days",
    price: "2,986",
    highlights: [
      "Scenic Machame Route",
      "Great Barranco Wall Climb",
      "Summit Uhuru Peak (5,895m)",
      "Camping Under the Stars",
      "Professional Mountain Crew",
    ],
  },
  {
    id: "northern-circuit-safari",
    title: "8-Day Tanzania Northern Safari Circuit",
    shortTitle: "Northern Circuit Safari",
    description:
      "Explore Tanzania's iconic northern parks including Tarangire, Ngorongoro Crater, Serengeti, and the stunning Lake Natron with its flamingos.",
    image: "/images/tarangire.jpg",
    duration: "8 Days",
    price: "2,900",
    highlights: [
      "Tarangire Elephant Herds",
      "Ngorongoro Crater Floor Safari",
      "Serengeti Wildebeest Migration",
      "Lake Natron Flamingos",
      "Ngare Sero Waterfall Hike",
    ],
  },
]

export function ItinerariesClient() {
  const handleBookNow = () => {
    window.open(PESAPAL_BOOKING_URL, "_blank")
  }

  return (
    <div className="min-h-screen">
     
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center bg-gradient-to-r from-brand-dark to-brand-green">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">Safari Packages</h1>
            <p className="text-lg md:text-xl text-white/90">Carefully crafted adventures across Tanzania</p>
          </div>
        </section>

        {/* Tour Cards Section */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-4">Our Featured Packages</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Discover our handpicked safari and beach experiences, each designed to showcase the very best of
                Tanzania
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tours.map((tour) => (
                <Card key={tour.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-64 w-full">
                    <Image src={tour.image || "/placeholder.svg"} alt={tour.shortTitle} fill className="object-cover" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-brand-orange text-white text-sm px-3 py-1">From ${tour.price}</Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-2xl font-black text-brand-dark mb-2">{tour.shortTitle}</CardTitle>
                    <CardDescription className="text-base text-gray-600">{tour.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>From ${tour.price} pp</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-brand-dark text-sm">Package Highlights:</h4>
                      <ul className="space-y-1">
                        {tour.highlights.slice(0, 3).map((highlight, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-brand-orange flex-shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-3">
                    <Button asChild className="flex-1 bg-brand-dark hover:bg-brand-dark/90 text-white">
                      <Link href={`/packages/${tour.id}`}>View Package</Link>
                    </Button>
                    <Button
                      onClick={handleBookNow}
                      className="flex-1 bg-brand-orange hover:bg-brand-orange/90 text-white"
                    >
                      Book Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Custom Itinerary CTA */}
        <section className="py-16 md:py-20 bg-brand-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6">Need a Custom Package?</h2>
            <p className="text-lg text-white/90 mb-8">
              Don't see exactly what you're looking for? We specialize in creating personalized packages tailored to
              your dreams, budget, and schedule.
            </p>
            <Button onClick={handleBookNow} className="bg-brand-orange hover:bg-brand-orange/90 text-white px-6">
              Plan Your Custom Safari
            </Button>
          </div>
        </section>
      </main>
      < />
      <WhatsAppFloat />
    </div>
  )
}
