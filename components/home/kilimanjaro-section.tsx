import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp } from "lucide-react"
import Image from "next/image"

const routes = [
  {
    title: "Machame Route",
    duration: "6-7 Days",
    difficulty: "Moderate to Challenging",
    successRate: "85%",
    image: "/images/machame.jpg",
    highlights: ["Scenic and diverse landscapes", "Good acclimatization profile", "Challenging but rewarding"],
  },
  {
    title: "Marangu Route",
    duration: "5-6 Days",
    difficulty: "Moderate",
    successRate: "75%",
    image: "/images/marangu.jpg",
    highlights: ["Hut accommodation (no camping)", "Gradual, steady ascent", "Good for beginners"],
  },
  {
    title: "Rongai Route",
    duration: "6-7 Days",
    difficulty: "Moderate",
    successRate: "80%",
    image: "/images/rongai.jpg",
    highlights: ["Less crowded", "Gradual ascent", "Good wildlife viewing"],
  },
]

export function KilimanjaroSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-dark mb-4">Climb Mount Kilimanjaro</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conquer Africa's highest peak at 5,895m - The Roof of Africa awaits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {routes.map((route, index) => (
            <div
              key={index}
              className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
            >
              <div className="relative h-64 bg-gray-200 overflow-hidden">
                <Image src={route.image || "/placeholder.svg"} alt={route.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-brand-dark mb-4">{route.title}</h3>

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

                <div className="mb-4">
                  <p className="text-sm font-semibold text-brand-dark mb-2">Highlights:</p>
                  <ul className="space-y-1">
                    {route.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-brand-orange mt-1">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button asChild className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white">
                  <Link href="/kilimanjaro">Choose {route.title.split(" ")[0]}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
