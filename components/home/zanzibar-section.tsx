import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import Image from "next/image"

const tours = [
  {
    title: "Stone Town Tour",
    duration: "Half Day",
    image: "/images/stone-town.jpg",
    description:
      "Explore the historic UNESCO World Heritage Site with its spice markets, bazaars, and ancient architecture.",
  },
  {
    title: "Spice Tour",
    duration: "Half Day",
    image: "/images/spice-tour.jpg",
    description:
      "Experience aromatic spice plantations with fresh fruit tasting and traditional cooking demonstrations.",
  },
  {
    title: "Prison Island Tour",
    duration: "Half Day",
    image: "/images/prison-island-tortoise.jpg",
    description:
      "Visit giant Aldabra tortoises, explore historical ruins, and enjoy snorkeling in crystal clear waters.",
  },
]

export function ZanzibarSection() {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-dark mb-4">Zanzibar Island Paradise</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the magic where pristine beaches meet rich cultural heritage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour, index) => (
            <div
              key={index}
              className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64 bg-gray-200 overflow-hidden">
                <Image src={tour.image || "/placeholder.svg"} alt={tour.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={16} className="text-brand-orange" />
                  <span className="text-sm font-semibold text-brand-orange">{tour.duration}</span>
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">{tour.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{tour.description}</p>
                <Button asChild className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white">
                  <Link href="/packages">View Package</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
