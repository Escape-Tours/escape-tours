"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, Check } from 'lucide-react'
import { KilimanjaroBookingModal } from "@/components/kilimanjaro-booking-modal"

interface Route {
  title: string
  subtitle: string
  image: string
  duration: string
  difficulty: string
  successRate: string
  price: number
  description: string
  highlights: string[]
}

interface KilimanjaroRoutesClientProps {
  routes: Route[]
}

export function KilimanjaroRoutesClient({ routes }: KilimanjaroRoutesClientProps) {
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<{ name: string; price: number } | null>(null)

  const handleBookRoute = (routeName: string, routePrice: number) => {
    setSelectedRoute({ name: routeName, price: routePrice })
    setBookingModalOpen(true)
  }

  return (
    <>
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-4">Choose Your Route</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each route offers unique experiences and challenges - select the one that matches your goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {routes.map((route, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                {/* Image Container */}
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  <img src={route.image || "/placeholder.svg"} alt={route.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-brand-orange text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                    ${route.price.toLocaleString()}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-black text-brand-dark mb-1">{route.title}</h3>
                  <p className="text-brand-orange font-semibold mb-4 italic">{route.subtitle}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-brand-orange" />
                      <span className="text-sm text-gray-700">
                        <span className="font-semibold">Duration:</span> {route.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-brand-orange" />
                      <span className="text-sm text-gray-700">
                        <span className="font-semibold">Difficulty:</span> {route.difficulty}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold">Success Rate:</span>{" "}
                      <span className="text-brand-green font-bold">{route.successRate}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{route.description}</p>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-brand-dark mb-2">Highlights:</p>
                    <ul className="space-y-1">
                      {route.highlights.map((highlight, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <Check size={16} className="text-brand-green mt-0.5 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => handleBookRoute(route.title, route.price)}
                    className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white"
                  >
                    Book {route.title.split(" ")[0]}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedRoute && (
        <KilimanjaroBookingModal
          open={bookingModalOpen}
          onOpenChange={setBookingModalOpen}
          routeName={selectedRoute.name}
          routePrice={selectedRoute.price}
        />
      )}
    </>
  )
}
