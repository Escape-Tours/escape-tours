"use client"
import { Button } from "@/components/ui/button"

export default function BookButton({ url }: { url: string }) {
  return (
    <Button onClick={() => window.open(url, "_blank")} size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white">
      Book This Tour
    </Button>
  )
}