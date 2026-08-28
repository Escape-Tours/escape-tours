import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const destinations = [
  {
    title: "Serengeti National Park",
    subtitle: "Witness the Great Migration",
    description:
      "Home to the spectacular Great Migration where millions of wildebeest traverse endless plains. Experience Africa's most iconic wildlife destination.",
    image: "/images/serengeti.jpg",
  },
  {
    title: "Ngorongoro Crater",
    subtitle: "UNESCO World Heritage Site",
    description:
      "The world's largest inactive volcanic caldera supporting 25,000 large animals. Virtually guaranteed Big Five sightings in this natural wonder.",
    image: "/images/ngorongoro.jpg",
  },
  {
    title: "Lake Manyara National Park",
    subtitle: "Famous tree-climbing lions",
    description:
      "Renowned for unique tree-climbing lions and massive flocks of pink flamingos. Incredible diversity in a compact area with groundwater forests.",
    image: "/images/manyara.jpg",
  },
]

export function TopDestinationsSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-dark mb-4">Top Destinations</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore Tanzania's most spectacular wildlife destinations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <div
              key={index}
              className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-64 bg-gray-200 overflow-hidden">
                <Image
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-brand-dark mb-2">{destination.title}</h3>
                <p className="text-brand-orange font-semibold mb-3">{destination.subtitle}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{destination.description}</p>
                <Button asChild className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white">
                  <Link href="/northern-circuit">Explore {destination.title.split(" ")[0]}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
