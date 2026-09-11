import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const team = [
  {
    name: "Samson Masebu",
    title: "Founder & CEO",
    image: "/images/team/samson.png",
  },
  {
    name: "Charles Geofrey",
    title: "Tour Guide",
    image: "/images/team/charles.jpeg",
  },
  {
    name: "Hudson Mukasa",
    title: "Content Expert",
    image: "/images/team/hudson.png",
  },
]

export function TeamSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-4">Meet Our Team</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The passionate professionals dedicated to making your Tanzania adventure unforgettable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 border-4 border-brand-orange">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center" }}
                />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-1">{member.name}</h3>
              <p className="text-brand-orange font-semibold">{member.title}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild className="bg-brand-orange hover:bg-brand-orange/90 text-white">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
