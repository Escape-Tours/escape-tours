

// 1. Corrected Imports: Default exports (Navigation, , etc.) MUST NOT have curly braces

import  from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float";
// Named exports (Button, Link, Check) KEEP their curly braces
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

// 2. Data definitions are correctly placed at the top
const destinations = [
  {
    title: "The National Museum and House of Culture, Dar es Salaam",
    subtitle: "A Journey Through Tanzania's Grand History",
    image: "/images/national-museum.jpg",
    description: "Located in the bustling heart of Dar es Salaam...",
    historicalSignificance: "Originally opened in 1940 as a memorial to King George V...",
    highlights: ["The Hall of Man", "Rich ethnographic collection", "History & Politics exhibits", "The House of Culture"],
  },
  // ... (keep the rest of your destinations array as it was)
]

export default function CulturalSafarisPage() {
  return (
    <div className="min-h-screen">
     
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center bg-gradient-to-r from-brand-dark to-brand-green">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">Cultural Tours</h1>
            <p className="text-lg md:text-xl text-white/90">Journey into the Heart of East Africa's Rich Heritage</p>
          </div>
        </section>

        {/* Destinations Grid */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {destinations.map((destination, index) => (
                <div key={index} className="space-y-8">
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                    <div className={`relative h-96 rounded-2xl overflow-hidden bg-gray-200 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                      <img src={destination.image || "/placeholder.svg"} alt={destination.title} className="w-full h-full object-cover" />
                    </div>
                    <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                      <h3 className="text-3xl font-black text-brand-dark mb-2">{destination.title}</h3>
                      <p className="text-xl text-brand-green font-bold mb-4 italic">{destination.subtitle}</p>
                      <p className="text-gray-700 leading-relaxed mb-4">{destination.description}</p>
                      <Button asChild className="bg-brand-orange hover:bg-brand-orange/90 text-white">
                        <Link href="/packages">View Packages</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      < />
      <WhatsAppFloat />
    </div>
  )
}