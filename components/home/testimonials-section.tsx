"use client"

import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    name: "Elizabeth Mwenda",
    location: "Tanzania",
    rating: 5,
    text: "Escape Tours delivered an incredible safari experience! Our guide was exceptional, the wildlife viewing was spectacular, and every detail was perfectly arranged. Truly unforgettable!",
  },
  {
    name: "James Trafford",
    location: "United Kingdom",
    rating: 5,
    text: "From start to finish, Escape Tours exceeded all expectations. The Kilimanjaro trek was challenging but rewarding, and the team's expertise made all the difference. Highly recommend!",
  },
  {
    name: "Lars Nielsen",
    location: "Denmark",
    rating: 5,
    text: "Outstanding service and attention to detail. The Serengeti safari was breathtaking, and our guide's knowledge of wildlife was impressive. Escape Tours made our African dream come true!",
  },
  {
    name: "Wei Chen",
    location: "China",
    rating: 5,
    text: "Professional, reliable, and passionate about what they do. The cultural tours were enlightening, and the beach escape in Zanzibar was pure paradise. Thank you Escape Tours!",
  },
  {
    name: "Marcus Rodriguez",
    location: "Texas, USA",
    rating: 5,
    text: "Best decision we made was booking with Escape Tours. The Ngorongoro Crater was mind-blowing, and the entire journey was seamless. These folks know Tanzania inside and out!",
  },
  {
    name: "Isabella Romano",
    location: "France",
    rating: 5,
    text: "Exceptional experience from beginning to end. The itinerary was perfectly paced, accommodations were wonderful, and our guide's passion for conservation was inspiring. Will definitely return!",
  },
]

export function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400
      const newScrollLeft =
        direction === "left" ? scrollRef.current.scrollLeft - scrollAmount : scrollRef.current.scrollLeft + scrollAmount

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-dark mb-4">What Our Clients Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences from adventurers who explored Tanzania with us
          </p>
        </div>

        <div className="relative">
          {/* Left Navigation Button */}
          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Testimonials Carousel */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 md:w-96 bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow snap-start"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-brand-orange text-brand-orange" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{testimonial.text}"</p>

                {/* Customer Info */}
                <div>
                  <p className="font-bold text-brand-dark">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Navigation Button */}
          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
