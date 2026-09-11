import WhatsAppFloat from "@/components/whatsapp-float";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Check, Mountain, Calendar, Info, Clock, ShieldCheck } from "lucide-react";

export default function LushotoPage() {
  const price = 450; // Dynamic pricing example

  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        {/* Hero Section */}
        <section className="relative h-[70vh] w-full flex items-center justify-center">
          <Image src="/images/lushoto-mountains.jpg" alt="Lushoto" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-white">
            <h1 className="text-5xl md:text-7xl font-black mb-6">Lushoto Expedition</h1>
            <p className="text-xl md:text-2xl font-light mb-8">Usambara Mountains: Above the Clouds</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#d97706] hover:bg-[#b45309] text-white text-lg px-8 py-6">
                Book This Trek (${price})
              </Button>
            </div>
          </div>
        </section>

        {/* Specs Bar */}
        <section className="max-w-6xl mx-auto -mt-16 relative z-20 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl shadow-xl">
            {[
              { icon: <Clock />, label: "Duration", value: "3-4 Days" },
              { icon: <Mountain />, label: "Difficulty", value: "Moderate" },
              { icon: <Calendar />, label: "Best Time", value: "Jun - Oct" },
              { icon: <ShieldCheck />, label: "Group Size", value: "1-12 Pax" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-[#d97706]">{item.icon}</div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">{item.label}</p>
                  <p className="font-bold text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-8">
            <h2 className="text-4xl font-black text-gray-900">Why Choose This Trek?</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Lushoto isn't just a destination; it's a sensory immersion. Walk through ancient Amani forests, 
              witness the sunrise from Irente Viewpoint, and engage with the rich heritage of the Sambaa people.
            </p>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold mb-6">Trek Highlights</h3>
              <ul className="grid sm:grid-cols-2 gap-4">
                {["Irente Biodiversity Reserve", "Magamba Forest Trek", "Cultural Village Homestays", "Viewpoints (1800m+)"].map((h) => (
                  <li key={h} className="flex items-center gap-3"><Check className="text-green-600" /> {h}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar / Fun Facts */}
          <div className="space-y-6">
            <div className="bg-[#1e293b] text-white p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Info /> Fun Fact</h3>
              <p className="text-blue-200 italic">"The Usambara Mountains are known as the 'Galapagos of Africa' due to their extreme level of biodiversity and unique species found nowhere else on earth."</p>
            </div>
            
            <div className="border border-gray-200 p-8 rounded-2xl">
              <h3 className="font-bold mb-4">Requirements</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Comfortable hiking boots</li>
                <li>• Light rain jacket (Mountain climate)</li>
                <li>• Moderate fitness level</li>
                <li>• Respectful attire for villages</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      
      <WhatsAppFloat />
    </div>
  )
}