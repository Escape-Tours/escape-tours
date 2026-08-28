
import { ItineraryBuilder } from "@/lib/utils/ItineraryBuilderPage";
import { ResidencyTier } from "@/lib/types/TariffParkFees";
import { ItinerariesClient } from "./_components/itineraries-client";
// Removed ItineraryBuilder import as it is causing the export error

// Metadata remains for SEO
export const metadata = {
    title: "Safari Packages | Escape Tours",
    description: "Browse our curated Tanzania safari packages including Serengeti, Ngorongoro, Zanzibar beach escapes, and Kilimanjaro treks. Custom packages available.",
};

export default function ItinerariesPage() {
    // We keep the server-side architecture clean by delegating the client logic
    // to the component, but we ensure the client is ready to receive engine data.
    return (
        <main className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-extrabold mb-8">Craft Your Safari</h1>
                <ItinerariesClient />
            </div>
        </main>
    );
}