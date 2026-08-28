

import    from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check } from "lucide-react"
const destinations = [
  {
    title: "Ruaha National Park",
    image: "/images/ruaha.jpg",
    description:
      "Tanzania's largest national park, remote and wild with pristine wilderness. Ruaha is famous for large elephant populations and exceptional predator sightings including lions, leopards, and cheetahs. The park's rugged landscape and the Great Ruaha River create dramatic scenery and excellent game viewing, especially during the dry season when animals concentrate around water sources.",
    highlights: [
      "Tanzania's largest park",
      "Remote wilderness experience",
      "Exceptional predator sightings",
      "Large elephant populations",
    ],
  },
  {
    title: "Nyerere National Park (Selous)",
    image: "/images/nyerere.jpg",
    description:
      "One of Africa's largest protected areas and a UNESCO World Heritage Site. Nyerere offers unique boat safaris, walking safaris, and traditional game drives in pristine wilderness. The Rufiji River system creates a network of channels and lakes that attract incredible wildlife diversity, making this one of Tanzania's most scenic and varied safari destinations.",
    highlights: [
      "Boat and walking safaris",
      "UNESCO World Heritage Site",
      "Diverse wildlife and landscapes",
      "Africa's largest protected area",
    ],
  },
  {
    title: "Saadani National Park",
    image: "/images/saadani-national-park.jpg",
    description:
      "The only wildlife sanctuary in Tanzania bordering the sea, where the bush meets the beach. Saadani offers a unique combination of traditional safari experiences with Indian Ocean coastline relaxation. Watch elephants stroll along pristine beaches, enjoy boat safaris on the Wami River spotting hippos and crocodiles, and experience both wildlife and beach paradise in one destination.",
    highlights: [
      "Only park where bush meets beach",
      "Elephants on the beach",
      "Boat safaris on Wami River",
      "Unique coastal safari experience",
    ],
  },
  {
    title: "Mikumi National Park",
    image: "/images/mikumi.jpg",
    description:
      "Easily accessible park with reliable wildlife viewing, located along the main highway between Dar es Salaam and Iringa. Part of the greater Selous ecosystem, Mikumi offers abundant plains game including elephants, giraffes, zebras, and wildebeest. The Mkata Floodplain provides excellent game viewing with beautiful mountain backdrops.",
    highlights: [
      "Easy access from Dar es Salaam",
      "Reliable wildlife sightings",
      "Beautiful landscapes",
      "Part of Selous ecosystem",
    ],
  },
  {
    title: "Udzungwa Mountains National Park",
    image: "/images/udzungwa-southern.jpg",
    description:
      "A biodiversity hotspot with endemic primate species found nowhere else on Earth. Udzungwa offers hiking through pristine montane forests to spectacular waterfalls, including the impressive 170-meter Sanje Falls. The park is a paradise for hikers and nature lovers, with unique flora and fauna including several endemic bird species.",
    highlights: [
      "Unique primate species",
      "Hiking and waterfalls",
      "Biodiversity hotspot",
      "Endemic species sanctuary",
    ],
  },
]

export default function SouthernCircuitPage() {
  return (
    <div className="min-h-screen">
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center bg-gradient-to-r from-brand-dark to-brand-green">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">Southern Circuit Safaris</h1>
            <p className="text-lg md:text-xl text-white/90">Tanzania's Wild and Remote Wilderness</p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-6">Discover Untamed Wilderness</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              The Southern Circuit offers a more remote and exclusive safari experience, with vast wilderness areas and
              fewer tourists. These parks provide authentic African bush experiences with diverse landscapes ranging
              from miombo woodlands to riverine forests.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              From boat safaris on the Rufiji River to hiking in the Udzungwa Mountains, the Southern Circuit showcases
              Tanzania's incredible diversity. Experience wildlife encounters in pristine settings where nature remains
              largely undisturbed.
            </p>
          </div>
        </section>

        {/* Destinations Grid */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {destinations.map((destination, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image */}
                  <div
                    className={`relative h-96 rounded-2xl overflow-hidden bg-gray-200 ${
                      index % 2 === 1 ? "lg:order-2" : ""
                    }`}
                  >
                    <img
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <h3 className="text-3xl font-black text-brand-dark mb-4">{destination.title}</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">{destination.description}</p>

                    {/* Highlights */}
                    <div className="space-y-2 mb-6">
                      {destination.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check size={20} className="text-brand-green mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>

                    <Button asChild className="bg-brand-orange hover:bg-brand-orange/90 text-white">
                      <Link href="/packages">View Packages</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-brand-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6">Ready for Your Southern Circuit Adventure?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Explore Tanzania's remote wilderness with exclusive safari experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white">
                <Link href="/packages">View Packages</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-brand-dark bg-transparent"
              >
                <Link href="/contact">Contact Us</Link>
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
