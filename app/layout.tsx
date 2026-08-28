import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ScrollToTop } from "@/components/scroll-to-top";
import  {Navigation}  from "@/components/navigation"; // Ensure this is imported
import "./globals.css";
import Footer from "@/components/footer"; // Restored import
import { UserProvider } from '@/components/providers/UserContext';

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "600", "700", "900"],
    variable: "--font-montserrat",
    display: "swap",
});

const openSans = Open_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    variable: "--font-open-sans",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Escape Tours - Discover Tanzania's Wild Beauty",
    description: "Experience authentic safaris, epic mountain treks, and cultural adventures in Tanzania with Escape Tours.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="flex flex-col min-h-screen">
        <UserProvider>
          <Navigation /> {/* Added globally here */}
          <main className="flex-grow">
            {children}
          </main>
          <Footer /> {/* Restored Footer call */}
          <ScrollToTop />
          <Analytics />
        </UserProvider>
      </body>
    </html>
  );
}