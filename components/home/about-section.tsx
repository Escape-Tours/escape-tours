import Image from "next/image"

export function AboutSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-dark mb-6 text-balance">
              Discover Tanzania's Hidden Treasures
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Escape Tours is a leading Tanzanian adventure company specializing in creating extraordinary experiences
                across Tanzania's most breathtaking landscapes. With a decade of expertise in the field, we craft
                authentic safari expeditions, challenging mountain climbs, and immersive cultural encounters.
              </p>
              <p>
                Our passionate team of local guides and adventure specialists prioritizes your safety, comfort, and
                complete satisfaction at every step. From the vast Serengeti plains to the peak of Africa's highest
                mountain, we transform Tanzania's incredible beauty into your personal adventure story.
              </p>
              <p>
                We offer complete travel solutions including knowledgeable guides, reliable transportation, seamless
                airport transfers, hotel arrangements, and custom-designed itineraries that match your interests and
                budget. Your journey, crafted your way.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-brand-orange mb-2">10+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-brand-orange mb-2">1000+</div>
                <div className="text-sm text-gray-600">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-brand-orange mb-2">20+</div>
                <div className="text-sm text-gray-600">Destinations</div>
              </div>
            </div>
          </div>

          {/* Image Container */}
          <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden">
            <Image
              src="/images/about-homepage.jpg"
              alt="Safari experience with Escape Tours"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
