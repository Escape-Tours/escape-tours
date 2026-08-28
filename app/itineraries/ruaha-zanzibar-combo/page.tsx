
import {  } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Users, DollarSign, Check, X } from "lucide-react"

const PESAPAL_BOOKING_URL = "https://store.pesapal.com/escapetours"

export default function RuahaZanzibarComboPage() {
  return (
    <div className="min-h-screen">
     
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] w-full">
          <Image
            src="/images/ruaha.jpg"
            alt="Ruaha & Zanzibar Combo"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
              <Badge className="bg-brand-orange text-white mb-4">7 Days Safari & Beach</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                Southern Tanzania Safari (Ruaha) & Zanzibar Escape
              </h1>
              <p className="text-xl text-white/90 max-w-3xl">
                Experience the wild beauty of Ruaha National Park followed by tropical relaxation in Zanzibar
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
                  <p className="font-bold text-lg">$4,376 per person</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-brand-orange" />
                <div>
                  <p className="text-sm text-white/70">Duration</p>
                  <p className="font-bold text-lg">7 Days</p>
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
                Your complete journey from Ruaha's wilderness to Zanzibar's paradise beaches
              </p>
            </div>

            <div className="space-y-6">
              {/* Day 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-orange text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 1: Dar es Salaam - Ruaha National Park</h3>
                  <p className="text-sm text-white/90">M.R Hotels | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Depart Dar es Salaam early (approx. 5:00 AM) for a long but scenic 8-hour drive to Ruaha National
                    Park. Stop for lunch near Iringa and arrive at Ruaha in the late afternoon. Check-in, followed by
                    dinner between 7:00 PM and 8:30 PM.
                  </p>
                </div>
              </div>

              {/* Day 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-dark text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 2: Full Day Game Drive in Ruaha National Park</h3>
                  <p className="text-sm text-white/90">M.R Hotels | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    An early start (recommended 6:30 AM) is best for spotting predators. Enjoy a full-day game drive in
                    the park with packed breakfast and lunchboxes. Stop at picnic sites for breaks. Return to camp for
                    dinner between 7:00 PM and 8:30 PM.
                  </p>
                </div>
              </div>

              {/* Day 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-orange text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 3: Half Day Game Drive & Evening Drive in Ruaha</h3>
                  <p className="text-sm text-white/90">M.R Hotels | Full Board</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Start with a half-day game drive (around 6:30 AM with packed breakfast). Return to camp for a hot
                    lunch between 1:00 PM and 2:30 PM. Rest for two hours, then embark on an evening game drive until
                    sunset. Return for dinner between 7:00 PM and 8:00 PM.
                  </p>
                </div>
              </div>

              {/* Day 4 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-dark text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 4: Ruaha - Iringa - Dar es Salaam/Zanzibar</h3>
                  <p className="text-sm text-white/90">Crowne Plaza | Breakfast & Lunch</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Begin the day with an early morning game drive in Ruaha. Enjoy breakfast upon return to the camp,
                    then drive back to Dar es Salaam via Iringa with lunch boxes. Proceed to Zanzibar by fast ferry
                    (Azam Marine) or overnight in Dar es Salaam if the boat is missed.
                  </p>
                </div>
              </div>

              {/* Day 5 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-orange text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 5: Transfer to Zanzibar & Prison Island Tour</h3>
                  <p className="text-sm text-white/90">Park Hyatt | Lunch</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Travel by boat (Azam Marine) from Dar es Salaam to Zanzibar (approx. 8:00 AM to 10:45 AM). Transfer
                    to your Stone Town hotel and relax before lunch (around 12:00 PM). At 1:00 PM, take a private boat
                    to Prison Island for an afternoon of activities, including exploring the Giant Tortoises. Return to
                    the hotel around 5:00 PM. (Dinner not included on Zanzibar days).
                  </p>
                </div>
              </div>

              {/* Day 6 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-dark text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 6: Kizimkazi Dolphin Tour and Jozani Forest Reserve</h3>
                  <p className="text-sm text-white/90">Art Hotel | Breakfast & Lunch</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    Embark on a 10-hour outing. Join a motorboat tour from a coastal village for Dolphin-spotting and
                    snorkeling. Afterward, visit Jozani Forest Reserve, Zanzibar's only national park, to see the
                    endemic red colobus monkeys, hyrax, and other wildlife in the old-growth forest. (Dinner not
                    included on Zanzibar days).
                  </p>
                </div>
              </div>

              {/* Day 7 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-brand-orange text-white px-6 py-4">
                  <h3 className="text-xl font-bold">DAY 7: Reserved for Departure - Drop off in Zanzibar Airport</h3>
                  <p className="text-sm text-white/90">Departure | Breakfast</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">
                    After breakfast, an Escape Tours representative will transfer you to Zanzibar Airport for your
                    scheduled international flight out of Tanzania and Zanzibar Island. See you again!
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
                    <span className="text-gray-700">All internal transfers, including pick-up/drop-off</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Fast ferry ticket (Azam Marine) to Zanzibar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Accommodation as per itinerary (Standard to High-End)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Meals: Full Board (Days 1-3), Breakfast & Lunch (Days 4, 6)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">All park entry fees and Government VAT (18%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Zanzibar Tours: Stone Town, Prison Island, Dolphin Tour, Jozani Forest
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">4x4 safari vehicle with English-Speaking Driver-Guide</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Bottled mineral water while on safari</span>
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
                    <span className="text-gray-700">Dinner while in Zanzibar (Days 4-7)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Tips for crew (Recommended: $25/day guide, $15/day cook)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Post accommodation in Zanzibar</span>
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
            <h2 className="text-3xl md:text-4xl font-black mb-6">Ready to Experience Ruaha & Zanzibar?</h2>
            <p className="text-lg text-white/90 mb-8">
              Book this incredible 7-day safari and beach combination today. Contact us for availability and custom
              arrangements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white text-lg px-8 py-6 h-auto"
              >
                <a href={PESAPAL_BOOKING_URL} target="_blank" rel="noopener noreferrer">
                  Book This Tour
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
