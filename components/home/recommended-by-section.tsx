import Image from "next/image"

const logos = [
  {
    name: "Tanzania Tourist Board",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tanzania-tourist-board-NrZOQxuulh6HBTIpJwLJMlBQRUzH2b.jpg",
  },
  {
    name: "Google Reviews",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/google-reviews-logo-FwQXeCYohpP20v8DclggchAgedEq4x.png",
  },
  {
    name: "SafariGo",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-removebg-preview-Pj48aYRfcZvNxphmJy0RzTFKy1Xeko.png",
  },
  {
    name: "APTA",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/association_for_the_promotion_of_tourism_to_africa_small-e1605455307548-KJJGEdjWLU8jwR531dKlvqAQjShTwA.jpg",
  },
  {
    name: "Get Your Guide",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/get-your-guide-old6003.logowik.com-removebg-preview-mNfItKFEgZJffTh279fZRFCnxZ0X3E.png",
  },
  {
    name: "TripAdvisor",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tripadvisor-logo-vector-png-trip-advisor-logo-png-720-p2BSnLSFZsNgxpfcxqVfUiEQ5yDolV.webp",
  },
  {
    name: "Trustpilot",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Trustpilot4-removebg-preview-uXRXzPrajQsJBYzEiDvgzhXBsyqxed.png",
  },
]

export function RecommendedBySection() {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-4">Recommended By</h2>
          <p className="text-lg text-gray-600">Trusted by leading travel platforms and organizations</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-8 items-center justify-items-center">
          {logos.map((logo, index) => (
            <div key={index} className="hover:scale-110 transition-transform duration-300">
              <Image
                src={logo.src || "/placeholder.svg"}
                alt={logo.name}
                width={120}
                height={60}
                className="object-contain h-16 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
