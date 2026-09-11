
import    from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Image } from "next/image"
import { Check } from "lucide-react"

const destinations = [
  {
    title: "Serengeti National Park",
    image: "/images/serengeti.jpg",
    description:
      "Home to the spectacular Great Migration where 2 million wildebeest traverse endless plains. The Serengeti hosts incredible wildlife diversity including all Big Five animals. Experience the most iconic African wilderness with vast savannas stretching to the horizon, predator-prey interactions, and some of the best game viewing on the continent.",
    highlights: [
      "Home to the Great Migration",
      "Endless plains teeming with Big Five",
      "Iconic African wilderness experience",
      "World-class predator sightings",
    ],
  },
  {
    title: "Ngorongoro Crater",
    image: "/images/ngorongoro.jpg",
    description:
      "The world's largest inactive volcanic caldera supporting 25,000 large animals year-round. This UNESCO World Heritage Site offers virtually guaranteed Big Five sightings in a unique ecosystem. Often called 'Africa's Eden,' the crater floor provides one of the highest concentrations of wildlife anywhere on Earth, all contained within the dramatic walls of this ancient volcano.",
    highlights: [
      '"Africa\'s Eden" - highest concentration of wildlife',
      "Unique crater ecosystem",
      "Guaranteed wildlife viewing",
      "UNESCO World Heritage Site",
    ],
  },
  {
    title: "Lake Manyara National Park",
    image: "/images/manyara.jpg",
    description:
      "Renowned for unique tree-climbing lions and massive flocks of pink flamingos. Lake Manyara offers incredible diversity with groundwater forests, acacia woodlands, and the alkaline lake itself. Despite its compact size, the park hosts an impressive variety of habitats and wildlife, making it a photographer's paradise with stunning landscapes and diverse species.",
    highlights: [
      "Pink flamingo spectacles",
      "Tree-climbing lions",
      "Diverse ecosystems in compact area",
      "Excellent bird watching",
    ],
  },
  {
    title: "Tarangire National Park",
    image: "/images/tarangire.jpg",
    description:
      "Famous for massive elephant herds and iconic baobab trees dotting the landscape. During the dry season (June-October), Tarangire attracts enormous wildlife concentrations as animals gather around the Tarangire River. The park offers a more intimate safari experience with fewer crowds and spectacular scenery dominated by ancient baobabs.",
    highlights: [
      "Massive elephant herds",
      "Ancient baobab trees",
      "Seasonal wildlife concentrations",
      "Less crowded than Serengeti",
    ],
  },
  {
    title: "Arusha National Park",
    image: "/images/arusha-national-park.jpg",
    description:
      "Small but diverse park dominated by the majestic Mount Meru, Tanzania's second-highest peak. Arusha National Park offers unique walking safaris and canoeing adventures on Momella Lakes. The park's varied landscapes include montane forests, crater lakes, and open savanna, providing habitat for colobus monkeys, giraffes, and numerous bird species.",
    highlights: [
      "Walking safaris and canoeing",
      "Mount Meru backdrop",
      "Close to Arusha city",
      "Diverse landscapes and habitats",
    ],
  },
]

export default function NorthernCircuitPage() {
  return (
    <div className="min-h-screen">
     
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center bg-gradient-to-r from-brand-dark to-brand-green">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">Northern Circuit Safaris</h1>
            <p className="text-lg md:text-xl text-white/90">Tanzania's Wildlife Crown Jewels</p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-6">The Crown Jewel of African Safaris</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              The Northern Circuit is Tanzania's most spectacular wildlife destination, home to the world-famous
              Serengeti and Ngorongoro Crater. This region offers unparalleled game viewing opportunities with the
              highest concentration of wildlife in Africa.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              From the Great Migration to guaranteed Big Five sightings, the Northern Circuit delivers the ultimate
              safari experience. These parks are considered the crown jewels of African wildlife destinations, offering
              landscapes and wildlife encounters that will stay with you forever.
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
                  <div className={`relative h-96 rounded-2xl overflow-hidden ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                    <Image
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.title}
                      fill
                      className="object-cover"
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
            <h2 className="text-3xl md:text-4xl font-black mb-6">Ready for Your Northern Circuit Adventure?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Experience the best wildlife viewing in Africa with our expert guides
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
