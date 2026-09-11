
import    from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Image } from "next/image"
import { Calendar, TrendingUp, Check, Mountain } from "lucide-react"

export default function MtMeruPage() {
  return (
    <div className="min-h-screen">
     
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-500">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <Mountain size={64} className="text-white mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4">Climb Mount Meru</h1>
            <p className="text-lg md:text-2xl text-white/90 mb-2">Tanzania's Second Highest Peak</p>
            <p className="text-xl md:text-3xl text-white font-bold">4,566m / 14,980ft</p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-6 text-center">
              The Perfect Kilimanjaro Warm-Up
            </h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Mount Meru, standing at 4,566 meters (14,980 feet), is Tanzania's second-highest peak and offers an
                excellent acclimatization trek before attempting Kilimanjaro. Located in Arusha National Park, this
                spectacular volcanic mountain provides stunning views of its famous neighbor, Mount Kilimanjaro.
              </p>
              <p>
                The climb takes 3-4 days and passes through diverse vegetation zones, from montane forest to moorland
                and alpine desert. Wildlife viewing opportunities are excellent in the lower elevations, with chances to
                see buffalo, giraffes, and various primates. An armed ranger accompanies all climbs for safety.
              </p>
              <p>
                The summit, Socialist Peak, offers spectacular crater views and unforgettable sunrise vistas over
                Kilimanjaro. Mount Meru is less crowded than Kilimanjaro, providing a more intimate mountain experience
                while still offering significant altitude and challenge.
              </p>
            </div>

            {/* Route Details */}
            <div className="mt-12 bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-black text-brand-dark mb-6">Momella Route</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={20} className="text-brand-orange" />
                    <span className="font-semibold text-brand-dark">Duration</span>
                  </div>
                  <p className="text-gray-700">3-4 days</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={20} className="text-brand-orange" />
                    <span className="font-semibold text-brand-dark">Difficulty</span>
                  </div>
                  <p className="text-gray-700">Moderate to Challenging</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mountain size={20} className="text-brand-orange" />
                    <span className="font-semibold text-brand-dark">Success Rate</span>
                  </div>
                  <p className="text-brand-green font-bold">90%</p>
                </div>
              </div>

              <h4 className="font-bold text-brand-dark mb-3">Highlights:</h4>
              <ul className="space-y-2">
                {[
                  "Passes through diverse vegetation zones",
                  "Wildlife viewing opportunities",
                  "Spectacular crater views",
                  "Stunning views of Kilimanjaro",
                  "Less crowded than Kilimanjaro",
                  "Armed ranger accompaniment",
                ].map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check size={20} className="text-brand-green mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Image Section */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <Image
                  src="/images/mt-meru-crater.jpg"
                  alt="Mount Meru volcanic crater with dramatic landscape"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <Image
                  src="/images/mt-meru-landscape.jpg"
                  alt="Mount Meru with lush vegetation in foreground"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-brand-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6">Ready to Climb Mount Meru?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Perfect preparation for Kilimanjaro or a spectacular trek in its own right
            </p>
            <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white">
              <Link href="/packages">View Packages</Link>
            </Button>
          </div>
        </section>
      </main>
      < />
      <WhatsAppFloat />
    </div>
  )
}
