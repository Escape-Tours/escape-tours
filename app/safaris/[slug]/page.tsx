import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ShieldCheck, MapPin, Home, Utensils, Sparkles, Clock, Users } from 'lucide-react';
import WhatsAppFloat from '@/components/whatsapp-float';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface PageProps {
  params: Promise<{ slug: string }>;
}

const PARK_DETAILS: Record<string, {
  subtitle: string;
  accommodationType: string;
  accommodationName: string;
  justification: string[];
  itinerary: { day: number; title: string; description: string; mealPlan: string }[];
}> = {
  'serengeti-migration-safari': {
    subtitle: "The Ultimate 4-Day Great Migration Expedition",
    accommodationType: "Luxury Tented Camp & Migration Lodge",
    accommodationName: "Serengeti Serena Safari Lodge / Four Seasons Safari Lodge",
    justification: [
      "Optimized 4-day routing to account for the substantial transit distance from Arusha into the heart of the Serengeti plains.",
      "Covers high park concession fees ($70-$100+ per person/night) and extended wilderness permits required for deep-park access.",
      "Includes professional bush-pilot class guiding, custom 4x4 Land Cruiser with pop-up roof, and unlimited mileage game drives."
    ],
    itinerary: [
      {
        day: 1,
        title: "Arusha to Serengeti National Park via Ngorongoro Highlands",
        description: "Depart early from Arusha with picnic lunch boxes. Drive through the scenic Ngorongoro Conservation Area down into the endless plains of the Serengeti, enjoying game viewing en route to your luxury camp.",
        mealPlan: "Lunch, Dinner"
      },
      {
        day: 2,
        title: "Full Day Great Migration & Mara River Tracking",
        description: "Spend a full day exploring the legendary Serengeti plains. Follow massive herds of wildebeest and zebras accompanied by opportunistic predators like lions, cheetahs, and leopards.",
        mealPlan: "Breakfast, Lunch, Dinner"
      },
      {
        day: 3,
        title: "Central & Western Serengeti Predator Tracking",
        description: "Venture deep into prime predator territories. Morning and afternoon game drives focus on river tributaries and kopjes where resident prides and migratory herds converge.",
        mealPlan: "Breakfast, Lunch, Dinner"
      },
      {
        day: 4,
        title: "Sunrise Game Drive & Return Journey to Arusha",
        description: "Witness a breathtaking African sunrise over the savannah with an early morning game drive. Return for breakfast, pack your gear, and enjoy final game viewing as you head toward the exit gate.",
        mealPlan: "Breakfast, Lunch"
      }
    ]
  },
  'ngorongoro-crater-safari': {
    subtitle: "Africa's Eden & Caldera Wonder",
    accommodationType: "High-Altitude Crater Rim Luxury Lodge",
    accommodationName: "Ngorongoro Serena Safari Lodge / Ngorongoro Crater Lodge",
    justification: [
      "Directly perched on the crater rim with panoramic views 600 meters above the caldera floor, eliminating long morning commutes.",
      "Includes specialized Ngorongoro Crater conservation and crater service fees, granting exclusive access to the densest wildlife sanctuary on Earth.",
      "Private 4x4 descent vehicle equipped with professional wildlife tracking gear and oxygen support."
    ],
    itinerary: [
      {
        day: 1,
        title: "Arusha to Ngorongoro Crater Rim",
        description: "Scenic drive from Arusha passing through pastoral Maasai land. Arrive at your luxury lodge perched on the crater rim in time for a breathtaking sunset over the caldera.",
        mealPlan: "Lunch, Dinner"
      },
      {
        day: 2,
        title: "Full Day Crater Floor Game Drive (Big Five Haven)",
        description: "Descend 600 meters down the steep crater walls into a breathtaking natural amphitheater. Spot the rare black rhino, elephants, lions, and flamingos around Lake Magadi.",
        mealPlan: "Breakfast, Picnic Lunch, Dinner"
      },
      {
        day: 3,
        title: "Cultural Maasai Boma Visit & Return to Arusha",
        description: "Enjoy a leisurely morning breakfast overlooking the mist-clearing crater. Visit a traditional Maasai Boma on your way back to Arusha for drop-off.",
        mealPlan: "Breakfast, Lunch"
      }
    ]
  },
  'lake-manyara-safari': {
    subtitle: "Groundwater Forests & Tree-Climbing Lions",
    accommodationType: "Tented Forest Lodge / Luxury Eco-Camp",
    accommodationName: "Lake Manyara Tree Lodge / Manyara Secret",
    justification: [
      "Immersive forest and lake ecosystem experience featuring world-famous tree-climbing lions in a compact, rich biosphere.",
      "Private guided night game drive experience (rarely permitted in other standard national parks).",
      "High-end boutique eco-lodge accommodation integrated seamlessly into the mahogany forest canopy."
    ],
    itinerary: [
      {
        day: 1,
        title: "Arusha to Lake Manyara – Canopy & Groundwater Forest Drive",
        description: "Drive southwest from Arusha to Lake Manyara National Park. Enter a lush groundwater forest populated by playful blue monkeys, baboons, and massive elephant herds.",
        mealPlan: "Lunch, Dinner"
      },
      {
        day: 2,
        title: "Flamingo Lake Shore Exploration & Night Game Drive",
        description: "Explore the alkaline lake shore glittering with thousands of pink flamingos and spot the legendary tree-climbing lions draped over acacia branches. Experience an exclusive night game drive after dusk.",
        mealPlan: "Breakfast, Lunch, Dinner"
      }
    ]
  },
  'tarangire-safari': {
    subtitle: "Land of Giants & Ancient Baobabs",
    accommodationType: "Luxury Wilderness Tented Camp",
    accommodationName: "Tarangire Sopa Lodge / Oliver's Camp",
    justification: [
      "Prime location along the Tarangire River system, acting as the crucial dry-season focal point for thousands of migrating elephants.",
      "Unmatched photographic landscapes featuring iconic, towering multi-thousand-year-old baobab trees.",
      "Specialized walking safari permitted within buffer zones accompanied by an armed park ranger."
    ],
    itinerary: [
      {
        day: 1,
        title: "Arusha to Tarangire National Park",
        description: "Head south across rolling Maasai steppe dotted with iconic baobab trees. Enter Tarangire for an afternoon game drive tracking colossal elephant herds along the riverbanks.",
        mealPlan: "Lunch, Dinner"
      },
      {
        day: 2,
        title: "Full Day River Basin & Baobab Valley Exploration",
        description: "Full day tracking predators like lions and leopards stalking herbivores converging on the remaining water pools. Enjoy a bush lunch under the shade of an acacia tree.",
        mealPlan: "Breakfast, Picnic Lunch, Dinner"
      },
      {
        day: 3,
        title: "Morning Walking Safari & Departure",
        description: "Embark on an educational morning walking safari accompanied by an armed ranger to observe animal tracks and smaller endemic species, followed by transfer back to Arusha.",
        mealPlan: "Breakfast, Lunch"
      }
    ]
  },
  'arusha-national-park-safari': {
    subtitle: "Mount Meru Views & Canoe Safaris",
    accommodationType: "Mountain Lodge & Forest Retreat",
    accommodationName: "Hatari Lodge / Arusha Coffee Lodge",
    justification: [
      "Combines traditional 4x4 game viewing with rare canoe safaris on Momella Lakes and guided walking safaris.",
      "Stunning backdrop of the imposing Mount Meru ash cone and montane rainforests.",
      "Boutique luxury accommodation with rich cinematic history overlooking lush coffee plantations or wildlife corridors."
    ],
    itinerary: [
      {
        day: 1,
        title: "Arusha to Arusha National Park – Forest & Momella Lakes",
        description: "Short morning drive from Arusha city to the park gates. Begin a game drive through montane forests, spotting black-and-white colobus monkeys and herds of giraffes and buffaloes.",
        mealPlan: "Lunch, Dinner"
      },
      {
        day: 2,
        title: "Canoe Safari on Momella Lakes & Waterfall Hike",
        description: "Enjoy a tranquil guided canoe safari on Momella Lakes surrounded by waterbucks, hippos, and flamingos, followed by a hike to Tululusia Waterfall and departure.",
        mealPlan: "Breakfast, Lunch"
      }
    ]
  }
};

export default async function SafariDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const { data: safari, error } = await supabase
    .from('safari_packages')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !safari) {
    notFound();
  }

  const details = PARK_DETAILS[slug] || {
    subtitle: "Tanzania Wildlife Expedition",
    accommodationType: "Luxury Safari Lodge & Tented Camp",
    accommodationName: "Partner Luxury Sanctuary",
    justification: [
      "All-inclusive park fees, concession permits, and professional 4x4 vehicle deployment.",
      "Dedicated expert driver-guide with extensive regional wildlife knowledge.",
      "Premium comfort accommodations designed for immersive wilderness experiences."
    ],
    itinerary: [
      { day: 1, title: "Arrival & Park Transfer", description: "Morning pickup and direct transfer to the park with game viewing en route.", mealPlan: "Lunch, Dinner" },
      { day: 2, title: "Full Day Game Drive", description: "Full day wildlife tracking across prime observation points.", mealPlan: "Breakfast, Lunch, Dinner" },
      { day: 3, title: "Sunrise Safari & Departure", description: "Early morning sunrise game drive followed by return transfer.", mealPlan: "Breakfast, Lunch" }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/packages" className="hover:text-orange-600 transition-colors">Packages</Link>
          <span>/</span>
          <span className="text-slate-900 truncate max-w-[250px]">{safari.title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white py-20 mt-4 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <div className="w-full lg:w-1/2 rounded-[2rem] overflow-hidden shadow-2xl relative h-[420px] border border-white/10 group">
            <Image
              src={safari.image_url || `/images/serengeti.jpg`}
              alt={safari.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <Badge className="bg-orange-600 text-white px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full shadow-lg shadow-orange-600/20">
              <Sparkles className="w-3.5 h-3.5 inline mr-1.5" /> {details.subtitle}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
              {safari.title}
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed font-light">
              {safari.description}
            </p>
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Price</p>
                <p className="text-2xl font-black text-orange-500 mt-1">${safari.price}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Duration</p>
                <p className="text-lg font-bold text-white mt-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-500" /> {safari.duration || `${details.itinerary.length} Days`}
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Group Size</p>
                <p className="text-lg font-bold text-white mt-1 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-orange-500" /> 2–8 People
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Bar */}
      <section className="bg-white border-b border-slate-200/80 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-around gap-6 text-slate-800">
          <div className="flex items-center gap-3 font-semibold text-sm">
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm">
              <Check className="h-4 w-4" />
            </div>
            <span>Professional Driver-Guide</span>
          </div>
          <div className="flex items-center gap-3 font-semibold text-sm">
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm">
              <Check className="h-4 w-4" />
            </div>
            <span>Custom 4x4 Safari Land Cruiser</span>
          </div>
          <div className="flex items-center gap-3 font-semibold text-sm">
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm">
              <Check className="h-4 w-4" />
            </div>
            <span>Park Entry & Concession Fees Included</span>
          </div>
        </div>
      </section>

      {/* Main Content & Itinerary Breakdown */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            
            {/* Accommodation & Investment Justification Box */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Accommodation & Investment Value</h2>
                  <p className="text-sm text-slate-500">Transparent breakdown of your safari investment</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-amber-50/50 border border-orange-100/80 p-6 rounded-2xl space-y-3 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider font-extrabold text-orange-600 bg-orange-100/80 px-3 py-1 rounded-full">
                    Selected Accommodation Tier
                  </span>
                  <span className="text-xs font-semibold text-slate-500 italic">Partner Sanctuary</span>
                </div>
                <p className="text-lg font-bold text-slate-900">{details.accommodationType}</p>
                <p className="text-sm text-slate-700 font-medium">Featured Properties: {details.accommodationName}</p>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-sm uppercase tracking-wider font-extrabold text-slate-400">Why This Price is Fully Justified</h3>
                <div className="space-y-3">
                  {details.justification.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/80">
                      <ShieldCheck className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm leading-relaxed font-medium">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Park-Specific Day-by-Day Itinerary */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Day-by-Day Itinerary Breakdown</h2>
                  <p className="text-sm text-slate-500">Custom tailored route schedule</p>
                </div>
              </div>
              
              <div className="space-y-8 border-l-2 border-orange-500/30 pl-6 ml-3 relative">
                {details.itinerary.map((dayItem) => (
                  <div key={dayItem.day} className="relative space-y-3 group">
                    <div className="absolute -left-[35px] top-0 bg-orange-600 text-white rounded-full h-7 w-7 flex items-center justify-center text-xs font-black shadow-md shadow-orange-600/30 ring-4 ring-white">
                      {dayItem.day}
                    </div>
                    <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100 hover:border-orange-200 transition-colors space-y-3">
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Day {dayItem.day}: {dayItem.title}</h3>
                      <p className="text-slate-600 leading-relaxed text-sm font-normal">
                        {dayItem.description}
                      </p>
                      <div className="inline-flex items-center gap-2 text-xs font-bold bg-white text-slate-700 px-3.5 py-1.5 rounded-full border border-slate-200/60 shadow-xs">
                        <Utensils className="h-3.5 w-3.5 text-orange-600" /> Meal Plan: <span className="text-orange-600">{dayItem.mealPlan}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Dynamic Secure Checkout Sidebar Box */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sticky top-6 space-y-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Live Secure Checkout</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Lock in your reservation now. The exact package total is dynamically captured for instant processing.
                </p>
              </div>
              
              <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center justify-between shadow-inner">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">Total Due</span>
                  <span className="text-xs text-slate-400">All taxes & fees included</span>
                </div>
                <span className="text-3xl font-black text-orange-500">${safari.price}</span>
              </div>

              <form action="/api/checkout/pesapal" method="POST">
                <input type="hidden" name="itemTitle" value={safari.title} />
                <input type="hidden" name="amount" value={safari.price} />
                <input type="hidden" name="slug" value={safari.slug} />
                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 text-base h-auto rounded-2xl shadow-xl shadow-orange-600/20 transition-all hover:scale-[1.02]"
                >
                  Book & Pay (${safari.price})
                </Button>
              </form>
              
              <div className="border-t border-slate-100 pt-4 text-center">
                <p className="text-xs text-slate-400 font-medium">
                  Secured via Pesapal API. Instant mobile money & card processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppFloat />
    </div>
  );
}