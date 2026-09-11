import { Suspense } from "react"
import ContactClientPage from "./contact-client"

export const metadata = {
  title: "Contact Us - Escape Tours | Plan Your Tanzania Adventure",
  description:
    "Get in touch with Escape Tours to plan your perfect Tanzania safari, Kilimanjaro trek, or Zanzibar beach holiday. Expert advice and custom packages available.",
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ContactClientPage />
    </Suspense>
  )
}