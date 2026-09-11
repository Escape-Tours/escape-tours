// Save this as: components/conditional-footer.tsx
"use client"
import { usePathname } from 'next/'
import  from "@/components/footer"

export default function ConditionalFooter() {
  const pathname = usePathname()
  // This will hide the footer ONLY on the contact page
  if (pathname === '/contact') return null
  return < />
}