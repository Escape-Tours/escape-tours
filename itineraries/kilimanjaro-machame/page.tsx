
import  Footer  from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {Image} from "next/image"
import { Calendar, DollarSign, Check, X, Mountain } from "lucide-react"

const PESAPAL_BOOKING_URL = "https://store.pesapal.com/escapetours"

export default function KilimanjaroMachamePage() {
  return (
    <div className="min-h-screen">
     
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] w-full">
          <Image
            src="/images/machame.jpg"
            alt="Kilimanjaro Machame Route"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
              <Badge className="bg-brand-orange text-white mb-4">9 Days Mountain Trek</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                Mount Kilimanjaro Machame Route Trek
              </h1>
              <p className="text-xl text-white/90 max-w-3xl">
                Conquer Kilimanjaro via the scenic Machame Route - the "Whiskey Route"
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
                  <p className="font-bold text-lg">$2,986 per person</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-brand-orange" />
                <div>
                  <p className="text-sm text-white/70">Duration</p>
                  <p className="font-bold text-lg">9 Days</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mountain className="h-5 w-5 text-brand-orange" />
                <div>
                  <p className="text-sm text-white/70">Summit</p>
                  <p className="font-bold text-lg">5,895m (Uhuru Peak)</p>
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
                Your complete journey to the Roof of Africa via the Machame Route
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
                    transferred to your accommodation. Relax in the afternoon. Our operations team will meet you for an
                    equipment check and a thorough trek briefing.
                  </p>
                </div>
              </div>

              {/* Day 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-dark text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 2: Machame Gate (1490m) – Machame Camp (2980m)</h3>
                  <p className="text-sm text-white/90">Machame Camp (2980m) | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Drive to Machame Village and on to the Gate. After registering, begin your ascent through the lush
                    rainforest. This is a continuous uphill trek, taking approximately 5-7 hours, where you'll reach
                    Machame Camp in the evening.
                  </p>
                </div>
              </div>

              {/* Day 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-orange text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 3: Machame Camp (2980m) – Shira Camp (3840m)</h3>
                  <p className="text-sm text-white/90">Shira Camp (3840m) | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Start your ascent, leaving the rainforest and entering the heath and moorland zone. The path crosses
                    streams and a rocky ridge onto the Shira Plateau. Enjoy evening snacks and dinner. Be prepared for a
                    cold night.
                  </p>
                </div>
              </div>

              {/* Day 4 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-dark text-white px-6 py-4">
                  <h3 className="text-xl font-bold">
                    DAY 4: Shira (3840m) – Lava Tower (4630m) – Barranco Camp (3950m)
                  </h3>
                  <p className="text-sm text-white/90">Barranco Camp (3950m) | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Leave the moorland, entering the semi-desert and rocky landscape. After about 5 hours, reach the
                    Lava Tower (4630m) for lunch. The afternoon descent to Barranco Campsite (3950m) is crucial for
                    acclimatization, allowing your body to adjust to high altitude.
                  </p>
                </div>
              </div>

              {/* Day 5 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-orange text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 5: Barranco Camp (3950m) – Karanga Camp (4235m)</h3>
                  <p className="text-sm text-white/90">Karanga Camp (4235m) | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Conquer the Great Barranco Wall (a Class 2 scramble, easier than it looks). At the top, view the
                    Heim Glacier and find yourself above the clouds. The trail then winds up and down in the Karanga
                    Valley—an ideal day for acclimatization.
                  </p>
                </div>
              </div>

              {/* Day 6 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-dark text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 6: Karanga Camp (4235m) – Barafu Camp (4600m)</h3>
                  <p className="text-sm text-white/90">Barafu Camp (4600m) | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Leave Karanga Camp, intersecting with the Mweka Route (descent trail). Reach Barafu Camp, the final
                    water stop before the summit. Barafu is an exposed camp on a rocky ridge. Prepare your gear and try
                    to get to sleep by 7:00 PM for the summit attempt.
                  </p>
                </div>
              </div>

              {/* Day 7 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-orange text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 7: Barafu (4600m) – Uhuru Peak (5895m) – Mweka (3100m)</h3>
                  <p className="text-sm text-white/90">Mweka Camp (3100m) | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    <strong>Midnight Summit Attempt:</strong> Begin ascending to Stella Point (5685m) for sunrise.
                    Continue for 2 more hours on a snow-covered trail to Uhuru Peak (5895m), the roof of Africa! Descend
                    back to Barafu for a short rest and hot lunch, then continue descending to Mweka Hut (3100m).
                  </p>
                </div>
              </div>

              {/* Day 8 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-dark text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 8: Mweka camp (3100m) – Mweka Gate (1980m) – Arusha</h3>
                  <p className="text-sm text-white/90">A Hotel/Lodge in Arusha | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Descend for three hours to Mweka Gate. Receive your well-deserved Green (Stella Point) or Gold
                    (Uhuru Peak) Certificate of Completion. After a hot lunch in Mweka village, drive back to your hotel
                    in Arusha for a long-awaited hot shower and rest.
                  </p>
                </div>
              </div>

              {/* Day 9 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-orange text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 9: Drop off at Arusha or JRO Airport</h3>
                  <p className="text-sm text-white/90">Upon request at extra cost | Breakfast</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    After breakfast, transfer to Arusha Airport or Kilimanjaro International Airport (JRO) for your
                    onward flight (e.g., to Zanzibar, Dar es Salaam, or home country). (Extension tours available upon
                    request at time of booking).
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
                    <span className="text-gray-700">2 nights pre & post-trek hotel in Moshi/Arusha (B&B)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Full Board meals throughout trek (Days 2-8)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Airport transfers (JRO/Arusha)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Professional mountain guides, cooks, and porters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Camping equipment (tents, sleeping mattress, camping furniture)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Filtered water throughout the trek</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">All park fees, rescue fees, camping fees, and 18% VAT</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Emergency oxygen and first aid kit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Porters to carry up to 15kg of personal gear</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Kilimanjaro summit certificate</span>
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
                    <span className="text-gray-700">
                      Meals not listed (Breakfast & Lunch Day 1, Lunch & Dinner Day 9)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <strong>Mandatory crew tips:</strong> $25/day guide, $15/day cook, $15/day per porter
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Optional rentals: Mountain gear, sleeping bag, portable toilet ($100 extra)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Personal insurance and medical expenses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Laundry, souvenirs, and beverages</span>
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
            <h2 className="text-3xl md:text-4xl font-black mb-6">Ready to Climb the Machame Route?</h2>
            <p className="text-lg text-white/90 mb-8">
              Book your Machame Route trek today and experience the most scenic path to the summit. Contact us for
              availability and custom arrangements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white text-lg px-8 py-6 h-auto"
              >
                <a href={PESAPAL_BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  Book This Trek
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
      
      <WhatsAppFloat />
    </div>
  )
}
