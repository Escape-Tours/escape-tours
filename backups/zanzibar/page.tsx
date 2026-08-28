"use client";

import Footer from "@/components/footer"; 
import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Clock, Check } from "lucide-react";
import { useItineraryStore } from "@/store/useItineraryStore";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

function AddToItineraryButton({ item }: { item: any }) {
  const { addItem } = useItineraryStore();
  const supabase = createClientComponentClient();

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        alert("Please log in to your User Hub first to start building your itinerary.");
        window.location.href = '/user-hub';
        return;
      }

      addItem(item);

      let { data: activeItinerary } = await supabase
        .from('itineraries')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('status', 'draft')
        .single();

      if (!activeItinerary) {
        const { data: newItinerary, error: createError } = await supabase
          .from('itineraries')
          .insert([
            {
              user_id: session.user.id,
              title: 'My Custom Expedition',
              status: 'draft',
              circuit: 'Zanzibar Circuit'
            }
          ])
          .select('id')
          .single();

        if (createError) throw createError;
        activeItinerary = newItinerary;
      }

      const { error: itemError } = await supabase
        .from('itinerary_items')
        .insert([
          {
            itinerary_id: activeItinerary.id,
            item_id: item.title.toLowerCase().replace(/\s+/g, '-'),
            item_type: 'tour',
            item_name: item.title
          }
        ]);

      if (itemError) {
        console.error("Supabase sync error:", itemError.message);
      } else {
        alert(`Success! "${item.title}" has been added to your User Hub itinerary.`);
      }

    } catch (err: any) {
      console.error("Error linking item to User Hub:", err.message);
    }
  };

  return (
    <Button 
      onClick={handleAdd}
      className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold"
    >
      Add to Itinerary
    </Button>
  );
}

const tours = [
  {
    title: "Stone Town Tour",
    duration: "Half Day",
    price: 238,
    image: "/images/stone-town.jpg",
    description:
      "Explore the historic UNESCO World Heritage Site of Stone Town, the cultural heart of Zanzibar. Wander through narrow winding streets, visit bustling spice markets and traditional bazaars, and admire the unique blend of Arab, Persian, Indian, and European architecture. Discover the Sultan's Palace, House of Wonders, and the Old Fort while learning about Zanzibar's fascinating history as a trading hub.",
    highlights: [
      "UNESCO World Heritage Site",
      "Spice markets and bazaars",
      "Historical architecture",
      "Sultan's Palace and House of Wonders",
    ],
  },
  {
    title: "Prison Island Tour",
    duration: "Half Day",
    price: 300,
    image: "/images/prison-island-tortoise.jpg",
    description:
      "Visit the famous Prison Island (Changuu Island) to meet the giant Aldabra tortoises, some over 100 years old. Explore the historical prison ruins that give the island its name, and enjoy excellent snorkeling opportunities in the crystal-clear waters surrounding the island. The coral reefs here are teeming with colorful tropical fish, making it a perfect spot for underwater exploration.",
    highlights: [
      "Giant Aldabra tortoises",
      "Historical prison ruins",
      "Snorkeling opportunities",
      "Beautiful coral reefs",
    ],
  },
  {
    title: "Spice Tour",
    duration: "Half Day",
    price: 220,
    image: "/images/spice-tour.jpg",
    description:
      "Experience the aromatic journey through Zanzibar's famous spice plantations. Known as the 'Spice Island,' Zanzibar produces cloves, nutmeg, cinnamon, and vanilla. Walk through lush plantations, learn about spice cultivation, enjoy fresh fruit tasting, and watch traditional cooking demonstrations. This sensory experience reveals why Zanzibar was once one of the world's most important spice producers.",
    highlights: [
      "Tropical spice plantations",
      "Fresh fruit tasting",
      "Traditional cooking demonstrations",
      "Learn about spice history and cultivation",
    ],
  },
  {
    title: "Nungwi Turtle Sanctuary",
    duration: "Half Day",
    price: 200,
    image: "/images/sea-turtle.jpg",
    description:
      "Visit the Mnarani Marine Turtles Conservation Pond in Nungwi, dedicated to protecting endangered sea turtles. Learn about marine conservation efforts, see baby turtles being raised for release, and even have the opportunity to swim with these gentle creatures in a natural lagoon. The sanctuary also features beautiful Nungwi beach, perfect for relaxation after your turtle encounter.",
    highlights: [
      "Sea turtle conservation",
      "Marine education programs",
      "Beautiful Nungwi beach",
      "Swimming with turtles",
    ],
  },
  {
    title: "The Rock Restaurant",
    duration: "Evening",
    price: 200,
    image: "/images/rock-restaurant.jpg",
    description:
      "Experience dining at one of the world's most unique restaurants, perched on a rock in the Indian Ocean. The Rock Restaurant offers fresh seafood and stunning ocean views in an unforgettable setting. Accessible by foot during low tide or by boat during high tide, this iconic Zanzibar landmark provides a romantic atmosphere perfect for special occasions or memorable meals.",
    highlights: [
      "Unique rock location in the ocean",
      "Fresh seafood specialties",
      "Stunning 360-degree ocean views",
      "Romantic atmosphere",
    ],
  },
  {
    title: "Nakupenda Beach",
    duration: "Full Day",
    price: 340,
    image: "/images/nakupenda-beach.jpg",
    description:
      "Escape to Nakupenda sandbank, a pristine white sand paradise that appears during low tide in the middle of the turquoise Indian Ocean. Enjoy swimming in crystal-clear waters, snorkeling among colorful fish, and a delicious seafood barbecue lunch prepared on the beach. This full-day excursion offers the ultimate tropical island experience with stunning views and complete relaxation.",
    highlights: [
      "Pristine sandbank paradise",
      "Crystal clear turquoise waters",
      "Fresh seafood barbecue",
      "Excellent snorkeling",
    ],
  },
  {
    title: "Sunset Dhow Cruise",
    duration: "Evening",
    price: 200,
    image: "/images/sunset-dhow-cruise.jpg",
    description:
      "Sail into the sunset aboard a traditional wooden dhow, the iconic sailing vessel of East Africa. Glide across calm waters as the sun paints the sky in brilliant oranges and pinks, creating a magical atmosphere. Enjoy refreshments on board while experiencing the romance and tranquility of the Indian Ocean. This peaceful cruise is the perfect way to end a day in paradise.",
    highlights: [
      "Traditional dhow sailing experience",
      "Spectacular sunset views",
      "Romantic and peaceful atmosphere",
      "Refreshments included",
    ],
  },
];

export default function ZanzibarPage() {
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center bg-gradient-to-r from-blue-900 to-teal-700">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4">Zanzibar</h1>
            <p className="text-lg md:text-2xl text-white/90">The Spice Island Paradise</p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-6">
              Where Pristine Beaches Meet Rich Cultural Heritage
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Zanzibar is a tropical paradise off the coast of Tanzania, famous for its pristine white-sand beaches,
              crystal-clear turquoise waters, and rich cultural history. This enchanting archipelago offers the perfect
              blend of relaxation and adventure, from exploring the historic Stone Town to diving in coral reefs.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Known as the 'Spice Island,' Zanzibar has been a trading hub for centuries, creating a unique fusion of
              African, Arab, Indian, and European influences. Today, it remains one of East Africa's most captivating
              destinations, offering unforgettable experiences for every type of traveler.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              The best time to visit Zanzibar is during the dry seasons from June to October and December to February,
              when the weather is perfect for beach activities and water sports. However, Zanzibar's tropical climate
              makes it a year-round destination.
            </p>
          </div>
        </section>

        {/* Tours Grid */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-4">Zanzibar Experiences</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the magic of Zanzibar with our curated tours and experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.map((tour, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative h-64 bg-gray-200 overflow-hidden">
                      <Image src={tour.image || "/placeholder.svg"} alt={tour.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {tour.price && (
                        <div className="absolute top-4 right-4 bg-brand-orange text-white px-4 py-2 rounded-full font-bold">
                          ${tour.price}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock size={16} className="text-brand-orange" />
                        <span className="text-sm font-semibold text-brand-orange">{tour.duration}</span>
                      </div>
                      <h3 className="text-xl font-bold text-brand-dark mb-3">{tour.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{tour.description}</p>

                      {/* Highlights */}
                      <div className="space-y-1 mb-4">
                        {tour.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check size={16} className="text-brand-green mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-gray-600">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Add to Itinerary Button */}
                  <div className="p-6 pt-0">
                    <AddToItineraryButton item={tour} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Beach Paradise Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-gray-200">
                <Image
                  src="/images/zanzibar-beach-paradise.jpg"
                  alt="Paradise Beaches in Zanzibar"
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-6">Paradise Beaches Await</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Zanzibar's beaches are legendary, featuring powdery white sand and warm, crystal-clear waters perfect
                  for swimming, snorkeling, and diving. From the lively beaches of Nungwi and Kendwa in the north to the
                  tranquil shores of Paje and Jambiani in the east, each beach offers its own unique charm.
                </p>

                <h3 className="text-xl font-bold text-brand-dark mb-4">Beach Activities</h3>
                <ul className="space-y-2 mb-6">
                  {[
                    "Snorkeling and diving in coral reefs",
                    "Kitesurfing and water sports",
                    "Dolphin watching tours",
                    "Beach relaxation and sunbathing",
                    "Sunset cruises on traditional dhows",
                    "Fresh seafood dining by the ocean",
                  ].map((activity, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check size={20} className="text-brand-green mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{activity}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild className="bg-brand-orange hover:bg-brand-orange/90 text-white">
                  <Link href="/packages">View Packages</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-brand-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6">Ready to Experience Zanzibar Magic?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Let us create your perfect island paradise getaway with customized tours and experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white">
                <Link href="/packages">View Packages</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-brand-dark bg-transparent"
              >
                <Link href="/contact">Get Quote</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}