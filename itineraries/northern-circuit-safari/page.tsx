
import    from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {Image} from "next/image"
import { Calendar, Users, DollarSign, Check, X } from "lucide-react"

const PESAPAL_BOOKING_URL = "https://store.pesapal.com/escapetours"

export default function NorthernCircuitSafariPage() {
  return (
    <div className="min-h-screen">
     
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] w-full">
          <Image
            src="/images/tarangire.jpg"
            alt="Northern Circuit Safari"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
              <Badge className="bg-brand-orange text-white mb-4">8 Days Safari</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                Tanzania Northern Safari Circuit
              </h1>
              <p className="text-xl text-white/90 max-w-3xl">
                Explore Tarangire, Ngorongoro Crater, Serengeti, and Lake Natron
              </p>
            </div>
          </div>
        </section>

        {/* Quick Info Bar */}
        <section className="bg-brand-dark text-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center md:justify-around gap-6 md:gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-brand-orange" />
                <div>
                  <p className="text-sm text-white/70">From</p>
                  <p className="font-bold text-lg">$2,900 per person</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-brand-orange" />
                <div>
                  <p className="text-sm text-white/70">Duration</p>
                  <p className="font-bold text-lg">8 Days</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-brand-orange" />
                <div>
                  <p className="text-sm text-white/70">Group Size</p>
                  <p className="font-bold text-lg">2-8 People</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Itinerary Section */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-4">Day by Day Itinerary</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Your complete journey through Tanzania's iconic northern parks
              </p>
            </div>

            <div className="space-y-6">
              {/* Day 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-orange text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 1: PRE DAY - Arriving in Tanzania</h3>
                  <p className="text-sm text-white/90">A Hotel/Lodge in Arusha | Dinner</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Upon arrival at Kilimanjaro International Airport (JRO) or Arusha Airport, you will be met and
                    transferred to your accommodation in Arusha. Our operations team will meet you for an equipment
                    check and a thorough briefing for your safari.
                  </p>
                </div>
              </div>

              {/* Day 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-dark text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 2: Game drive in Tarangire National Park</h3>
                  <p className="text-sm text-white/90">A Lodge/Tented Camp in/near Tarangire | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Depart from Arusha for Tarangire National Park. Enjoy scenic views of Mount Meru and unspoiled
                    sceneries during the drive. Enjoy safari drives within this picturesque park before heading to your
                    lodge/tented camp for dinner and overnight.
                  </p>
                </div>
              </div>

              {/* Day 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-orange text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 3: Game drive in Lake Manyara National Park</h3>
                  <p className="text-sm text-white/90">A Lodge/Tented Camp in/near Manyara | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    After breakfast, drive with picnic lunch boxes to Lake Manyara National Park. Enjoy a game drive
                    before and after lunch, taking in the beautiful panorama of the lake, known for its diverse and
                    colorful bird species.
                  </p>
                </div>
              </div>

              {/* Day 4 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-dark text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 4: Ngorongoro Crater Tour</h3>
                  <p className="text-sm text-white/90">A Lodge/Tented Camp in Serengeti | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Enjoy a full day of safari drives inside the magnificent Ngorongoro Crater in a private vehicle.
                    Picnic lunch boxes will be provided on the crater floor. In the late afternoon, return to your
                    lodge/tented camp for relaxation and dinner.
                  </p>
                </div>
              </div>

              {/* Day 5 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-orange text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 5: Transfer to Serengeti National Park via Olduvai Gorge</h3>
                  <p className="text-sm text-white/90">A Lodge/Tented Camp in Serengeti | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    After breakfast, drive with picnic lunch boxes to Serengeti National Park. En route, stop at Olduvai
                    Gorge, known as "The Cradle of Mankind," an archaeological site where early human fossils were
                    discovered. Enjoy safari drives as you head toward your accommodation, looking for the Wildebeest
                    Migration.
                  </p>
                </div>
              </div>

              {/* Day 6 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-dark text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 6: Game drive in Serengeti National Park</h3>
                  <p className="text-sm text-white/90">A Lodge/Tented Camp in Serengeti | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Experience a full day in the Serengeti. Wake up early for a morning game drive to catch lions and
                    other predators during their morning hunt. After lunch, embark on an afternoon game drive. Overnight
                    stay on a full board basis.
                  </p>
                </div>
              </div>

              {/* Day 7 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-orange text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 7: Serengeti - Lake Natron Area</h3>
                  <p className="text-sm text-white/90">A Lodge/Tented Camp in Karatu/Natron | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    After breakfast, enjoy a final morning game drive in the Serengeti before departing for the
                    Karatu/Lake Natron area. The drive offers changing landscapes. Arrive at your accommodation in the
                    late afternoon/evening for dinner and overnight.
                  </p>
                </div>
              </div>

              {/* Day 8 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-dark text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 8: Lake Natron Activity - Arusha</h3>
                  <p className="text-sm text-white/90">Upon request at extra cost | Breakfast & Lunch</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Drive to the Lake Natron area. The drive is long but picturesque, offering views of local Maasai
                    tribesmen and wildlife. Upon arrival (likely after lunch), a guide will take you on a walking tour
                    to the Ngare Sero Waterfall. Afterwards, drive back to Arusha where your tour ends.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inclusions/Exclusions Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Included */}
              <div className="bg-green-50 rounded-lg p-8">
                <h3 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-2">
                  <Check className="h-6 w-6 text-green-600" />
                  What's Included
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Pick up and drop off at JRO or Arusha Airport</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Accommodation and meals as per itinerary</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Meals: Dinner Day 1, Full Board Days 2-7, Breakfast & Lunch Day 8
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Game drives and all park entry fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">18% Government VAT on tour fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Private 4x4 safari vehicle with English-Speaking Driver-Guide</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Bottled mineral water in vehicle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Optional camping gear for camping safari</span>
                  </li>
                </ul>
              </div>

              {/* Excluded */}
              <div className="bg-red-50 rounded-lg p-8">
                <h3 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-2">
                  <X className="h-6 w-6 text-red-600" />
                  What's Not Included
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">International and domestic flights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Tanzania Visa ($50-$100 depending on nationality)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Meals not listed (Breakfast & Lunch Day 1, Dinner Day 8)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Optional activities (e.g., Hot Air Balloon Safaris)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Post accommodation in Arusha (can be arranged)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Tips for crew (Recommended: $25/day guide, $15/day cook)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Personal insurance and medical expenses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Laundry, souvenirs, telephone, and beverages</span>
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t border-red-200">
                  <h4 className="font-bold text-brand-dark mb-3">Holiday Surcharges:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Christmas/New Year: +$40 per person per day (Dec 24-26, 31, Jan 1)</li>
                    <li>• Easter: +$35 per person (April 3-6)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-brand-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6">Ready to Explore the Northern Circuit?</h2>
            <p className="text-lg text-white/90 mb-8">
              Book this incredible 8-day safari through Tanzania's most iconic parks. Contact us for availability and
              custom arrangements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white text-lg px-8 py-6 h-auto"
              >
                <a href={PESAPAL_BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  Book This Safari
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white text-brand-dark hover:bg-gray-100 text-lg px-8 py-6 h-auto"
              >
                <Link href="/packages">View All Packages</Link>
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
