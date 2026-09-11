import { Shield, Users, Clock, Award } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Safety First",
    description: "Your safety is our top priority with experienced guides and well-maintained equipment",
  },
  {
    icon: Users,
    title: "Local Expertise",
    description: "Born and raised in Tanzania, we know the hidden gems and best wildlife spots",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock assistance to ensure your adventure goes smoothly",
  },
  {
    icon: Award,
    title: "Reliability",
    description: "Recognized for excellence in service and sustainable tourism practices",
  },
]

export function WhyChooseUsSection() {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-dark mb-4">Why Choose Us</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the difference with Tanzania's most trusted tour operator
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
