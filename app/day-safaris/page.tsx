

import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Clock, MapPin } from "lucide-react"

export const metadata = {
  title: "Day Safaris & Excursions in Tanzania | Escape Tours",
  description:
    "Discover Tanzania's best day trips including Materuni Waterfalls, Chemka Hot Springs, Lake Duluti, and Kilimanjaro day hikes. Perfect adventures for any schedule.",
}

const dayTrips = [
  {
    id: "materuni-waterfalls",
    title: "Materuni Waterfalls & Coffee Tour",
    location: "Arusha/Moshi",
    duration: "Full Day",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/materuni-vPuMND81o4NEA7A0SCZipTJtofzRwJ.jpg",
    description:
      "Explore the lush foothills of Mount Kilimanjaro with a visit to the authentic Chagga village of Materuni. Hike through scenic farmlands and rainforests to the magnificent Materuni Waterfalls, then enjoy a hands-on Chagga Coffee Tour where you learn the entire coffee process from bean to cup.",
    highlights: [
      "Stunning waterfall with swimming opportunity",
      "Traditional coffee-making experience",
      "Cultural immersion with Chagga people",
      "Local lunch included",
    ],
  },
  {
    id: "rundugai-hot-springs",
    title: "Rundugai (Chemka) Hot Springs",
    location: "Near Moshi",
    duration: "Half Day",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rundugai-tree-roots-k8SzxBRpaUn75hcvZ4FRee03ChAwd2.jpg",
    description:
      "Escape to a hidden oasis in the Tanzanian bush. A 2-hour adventurous off-road drive leads you to stunning natural pools of crystal-clear, warm turquoise water sourced from underground springs. Surrounded by towering fig trees, it's perfect for swimming, relaxing, or swinging from a rope into the deeper pool.",
    highlights: [
      "Crystal-clear turquoise hot springs",
      "Natural fish spa experience",
      "Rope swing into the pool",
      "Shaded picnic spots",
    ],
  },
  {
    id: "lake-duluti",
    title: "Lake Duluti Crater Lake",
    location: "Near Arusha",
    duration: "Half Day",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/duluti-1JfMaFxzB2IFobOfkZEmMonOmlfuNQ.jpg",
    description:
      "A tranquil volcanic crater lake just a short drive from Arusha city center, framed by thick forest reserve. Enjoy canoeing or kayaking across calm emerald waters with excellent birdwatching opportunities. The surrounding forest trails are perfect for guided nature walks to spot Blue Monkeys and over 130 bird species.",
    highlights: ["Canoeing and kayaking", "130+ bird species", "Guided nature walks", "Blue Monkey sightings"],
  },
  {
    id: "pugu-hills",
    title: "Pugu Hills Nature Forest Reserve",
    location: "Dar es Salaam",
    duration: "Full Day",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pugu_Hill_Nature_Forest_with_Lake_Minaki_2-h0lktJuL7JsrBCnxEAtQ8VFtmUrCLT.jpg",
    description:
      "Located just 20 km southwest of Dar es Salaam, this biodiverse coastal forest is home to endemic plant species and diverse wildlife including colobus monkeys. Enjoy guided hiking to viewpoints like Msolo Hill Peak with stunning views, plus birdwatching and canoeing on Minaki Dam.",
    highlights: [
      "Msolo Hill Peak viewpoint",
      "Colobus monkey sightings",
      "Canoeing on Minaki Dam",
      "Endemic plant species",
    ],
  },
  {
    id: "themi-falls",
    title: "Themi Falls Leisure Park",
    location: "Arusha",
    duration: "Half Day",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/themi%20falls-e9XTb52kaNjE5iLx1Lgv6cieGCZKef.jpg",
    description:
      "Situated in the scenic countryside near Olgilai village, this park combines natural beauty with recreational facilities. Enjoy a leisurely hike to the picturesque Themi Waterfalls, explore beautiful gardens, and experience guided cultural walks through the village. Perfect for families seeking a relaxing day trip.",
    highlights: [
      "Scenic waterfall hike",
      "Cultural village experience",
      "Beautiful gardens",
      "Family-friendly activities",
    ],
  },
  {
    id: "kilimanjaro-day-hike",
    title: "Kilimanjaro Day Hike",
    location: "Marangu Gate",
    duration: "Full Day",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Marangu%20Gates-Z06KUUyvLREqE88yqZQ4EiEgaJpEZn.jpg",
    description:
      "Experience Africa's highest peak without a multi-day trek. Starting from Marangu Gate, trek through lush rainforest to Mandara Hut (2,700m). Encounter towering eucalyptus trees, colorful birds, and black-and-white colobus monkeys. A detour to Maundi Crater rim offers stunning panoramic views of northern Tanzania.",
    highlights: [
      "Trek to 2,700m elevation",
      "Lush rainforest experience",
      "Colobus monkey sightings",
      "Panoramic mountain views",
    ],
  },
]

export default function DaySafarisPage() {
  return (
    <div className="min-h-screen">
     
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center bg-gradient-to-r from-brand-dark to-brand-green">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">Day Safaris & Excursions</h1>
            <p className="text-lg md:text-xl text-white/90">Unforgettable adventures perfect for any schedule</p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-6">Experience Tanzania in a Day</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our carefully curated day trips offer the perfect blend of adventure, culture, and natural beauty. Whether
              you're short on time or looking to complement your safari with unique experiences, these excursions
              showcase the best of Tanzania's diverse landscapes and rich heritage.
            </p>
          </div>
        </section>

        {/* Day Trips Grid */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dayTrips.map((trip) => (
                <Card key={trip.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-64 w-full">
                    <Image src={trip.image || "/placeholder.svg"} alt={trip.title} fill className="object-cover" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{trip.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{trip.duration}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-brand-dark mb-3">{trip.title}</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed line-clamp-4">{trip.description}</p>
                    <div className="mb-6">
                      <h4 className="font-bold text-brand-dark mb-2 text-sm">Highlights:</h4>
                      <ul className="space-y-1">
                        {trip.highlights.slice(0, 3).map((highlight, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="text-brand-orange mr-2">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button asChild className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold">
                      <Link href="/packages">View Packages</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-brand-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6">Ready for Your Adventure?</h2>
            <p className="text-lg text-white/90 mb-8">
              Contact us to customize your perfect day trip experience or combine multiple excursions for an
              unforgettable journey
            </p>
            <Button asChild className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold">
              <Link href="/packages">View Packages</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <WhatsAppFloat />
    </div>
  )
}
