
import    from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {Image} from "next/image"
import { Calendar, DollarSign, Check, X, Mountain } from "lucide-react"

const PESAPAL_BOOKING_URL = "https://store.pesapal.com/escapetours"

export default function KilimanjaroMaranguPage() {
  return (
    <div className="min-h-screen">
     
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] w-full">
          <Image
            src="/images/marangu.jpg"
            alt="Kilimanjaro Marangu Route"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
              <Badge className="bg-brand-orange text-white mb-4">8 Days Mountain Trek</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                Mount Kilimanjaro Marangu Route Trek
              </h1>
              <p className="text-xl text-white/90 max-w-3xl">
                Climb Africa's highest peak via the Marangu Route with comfortable hut accommodation
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
                  <p className="font-bold text-lg">8 Days</p>
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
                Your complete journey to the Roof of Africa via the Marangu Route
              </p>
            </div>

            <div className="space-y-6">
              {/* Day 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-orange text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 1: PRE DAY - Arriving in Tanzania</h3>
                  <p className="text-sm text-white/90">A Hotel/Lodge in Arusha/Moshi | Dinner</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Upon arrival at Kilimanjaro International Airport (JRO) or Arusha Airport, you will be transferred
                    to your accommodation. Our operations team will meet you for an equipment check and a thorough
                    briefing on your trek.
                  </p>
                </div>
              </div>

              {/* Day 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-dark text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 2: Marangu Gate (1980m) – Mandara Hut (2700m)</h3>
                  <p className="text-sm text-white/90">Mandara Hut (2700m) | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Drive to Marangu Gate. After registration, begin your ascent through the rainforest. The Marangu
                    Route uses communal sleeping huts (6-8 bunks each) with solar-generated lighting. Dinner is prepared
                    by the chef upon arrival.
                  </p>
                </div>
              </div>

              {/* Day 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-orange text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 3: Mandara Hut (2700m) – Horombo Hut (3720m)</h3>
                  <p className="text-sm text-white/90">Horombo Hut (3720m) | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Begin your ascent out of the rainforest and into the heath/moorland. Pass the Maundi Crater (with an
                    option to climb to the rim for spectacular views). Spot exotic plants like giant lobelia. Reach
                    Horombo Hut after about 6 hours of hiking.
                  </p>
                </div>
              </div>

              {/* Day 4 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-dark text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 4: Horombo Hut (3720m) – Acclimatization Day</h3>
                  <p className="text-sm text-white/90">Horombo Hut (3720m) | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Spend the day at Horombo Hut allowing your body to acclimate to the altitude. You have the option of
                    taking a guided day hike to Mawenzi Hut (4600m) for further acclimatization, following the principle
                    of "climb high, sleep low."
                  </p>
                </div>
              </div>

              {/* Day 5 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-orange text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 5: Horombo Hut (3720m) – Kibo Hut (4700m)</h3>
                  <p className="text-sm text-white/90">Kibo Hut (4700m) | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Continue your ascent into the alpine desert habitat, reaching Kibo Hut, located in "The Saddle"
                    between the Mawenzi and Kibo peaks. An early dinner will be served so hikers can rest before
                    attempting the midnight summit. (No water is available at this camp).
                  </p>
                </div>
              </div>

              {/* Day 6 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-dark text-white px-6 py-4">
                  <h3 className="text-xl font-bold">
                    DAY 6: Kibo Hut (4700m) – Uhuru Peak (5895m) – Horombo Hut (3720m)
                  </h3>
                  <p className="text-sm text-white/90">Horombo Hut (3720m) | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    <strong>Midnight Summit Attempt:</strong> Begin your ascent to Gillman's Point (5681m) on the crater
                    rim. Continue on a snow-covered trail to Uhuru Peak (5895m), the highest point in Africa. Descend
                    back to Kibo Hut for lunch and a rest, then continue the long descent down to Horombo Hut for the
                    night.
                  </p>
                </div>
              </div>

              {/* Day 7 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-orange text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 7: Horombo Hut (3720m) – Marangu Gate (1980m) – Arusha</h3>
                  <p className="text-sm text-white/90">A Hotel/Lodge in Arusha/Moshi | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Enjoy a final breakfast before descending for approximately 6 hours back to Marangu Gate. Sign out
                    and receive your Certificate of Completion (Green for Gillman's Point, Gold for Uhuru Peak). Drive
                    back to your hotel in Arusha/Moshi for showers and celebration.
                  </p>
                </div>
              </div>

              {/* Day 8 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-dark text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 8: POST - Drop off at Arusha or JRO Airport</h3>
                  <p className="text-sm text-white/90">Upon request at extra cost | Breakfast</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    After breakfast, transfer to Arusha Airport or Kilimanjaro International Airport (JRO) for your
                    onward journey. (Extension tours like Zanzibar or Arusha/Moshi Day Trips can be arranged upon
                    request).
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
                    <span className="text-gray-700">Hut accommodation on the mountain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">2 nights pre & post-trek hotel in Moshi/Arusha (B&B)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Full Board meals on mountain (Days 2-7)</span>
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
                    <span className="text-gray-700">All park fees, rescue fees, hut fees, and 18% VAT</span>
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
                      Meals not listed (Breakfast & Lunch Day 1, Lunch & Dinner Day 8)
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
            <h2 className="text-3xl md:text-4xl font-black mb-6">Ready to Climb Kilimanjaro?</h2>
            <p className="text-lg text-white/90 mb-8">
              Book your Marangu Route trek today and stand on the Roof of Africa. Contact us for availability and custom
              arrangements.
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
      < />
      <WhatsAppFloat />
    </div>
  )
}
