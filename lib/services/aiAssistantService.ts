// lib/services/aiAssistantService.ts
import { Day, ItineraryItem } from '@/lib/types/itinerary-types';
import { analyzeItineraryPace, PaceScoreResult } from './itineraryAnalyzer';

export interface AssistantAction {
  label: string;
  type: 'ADD_ITEM' | 'OPTIMIZE_PACING' | 'RESOLVE_CONFLICT' | 'SUGGEST_ROUTE';
  payload?: any;
}

export interface AdvancedAssistantResponse {
  reply: string;
  diagnostic?: PaceScoreResult;
  suggestedAction?: AssistantAction;
  proactiveInsights?: string[];
}

// Advanced Region & Circuit Intelligence Mapping
const getRegionCategory = (name: string): 'NORTHERN' | 'SOUTHERN' | 'ZANZIBAR' | 'OTHER' => {
  const lower = name.toLowerCase();
  if (lower.includes('serengeti') || lower.includes('ngorongoro') || lower.includes('tarangire') || lower.includes('manyara') || lower.includes('arusha') || lower.includes('kilimanjaro')) {
    return 'NORTHERN';
  }
  if (lower.includes('ruaha') || lower.includes('selous') || lower.includes('nyerere') || lower.includes('mikumi') || lower.includes('katavi') || lower.includes('mahale')) {
    return 'SOUTHERN';
  }
  if (lower.includes('zanzibar') || lower.includes('stone town') || lower.includes('mnemba') || lower.includes('nungwi') || lower.includes('paje')) {
    return 'ZANZIBAR';
  }
  return 'OTHER';
};

export function processAdvancedAssistantQuery(
  query: string,
  days: Day[],
  allItineraryItems: any[],
  residencyTier: string
): AdvancedAssistantResponse {
  const lowerQuery = query.toLowerCase();
  const diagnostic = analyzeItineraryPace(days, allItineraryItems);

  // 1. Explicit Logistical Failure / Chrono-Flow Repair Requests
  if (lowerQuery.includes('fix') || lowerQuery.includes('repair') || lowerQuery.includes('optimize') || lowerQuery.includes('route')) {
    if (diagnostic.score < 80) {
      return {
        reply: `⚠️ Chrono-Flow Alert Detected (${diagnostic.label}): ${diagnostic.advice}\n\nI recommend restructuring your day slots or injecting a dedicated transfer link to re-establish optimal safari flow.`,
        diagnostic,
        suggestedAction: {
          label: 'Auto-Balance Expedition Pace',
          type: 'OPTIMIZE_PACING',
          payload: { targetScore: 95 }
        },
        proactiveInsights: [
          "Ensure inter-circuit jumps are bridged with domestic flight segments.",
          "Verify that full-day park game drives are isolated to prevent slot collisions."
        ]
      };
    }
    return {
      reply: `✨ Your itinerary structure is already running at peak optimization (${diagnostic.score}% Chrono Score). Every temporal slot and regional transition complies with Tanzanian tour operator logistics.`,
      diagnostic
    };
  }

  // 2. Financial, Cost, and Valuation Inquiries
  if (lowerQuery.includes('cost') || lowerQuery.includes('price') || lowerQuery.includes('budget') || lowerQuery.includes('quote') || lowerQuery.includes('total')) {
    const itemCount = allItineraryItems.length;
    if (itemCount === 0) {
      return {
        reply: "Your active canvas is currently a blank slate. Add accommodations, park excursions, or transport assets to generate a real-time valuation breakdown tailored to your selected residency tier."
      };
    }

    const hasTransport = allItineraryItems.some(s => s.item?.category === 'TRANSPORT');
    const insights = [
      `Active Tier: ${residencyTier} pricing rules applied.`,
      hasTransport ? "✓ 4x4 Cruiser logistics accounted for." : "⚠️ Warning: Transport vehicle missing from valuation calculation."
    ];

    return {
      reply: `Your current manifest contains ${itemCount} premium components across ${days.length} operational days. All park conservation fees, 18% VAT, and 20% agency operational margins are factored into the live builder total.`,
      diagnostic,
      proactiveInsights: insights
    };
  }

  // 3. Wildlife & Circuit Expert Recommendations (Serengeti, Ngorongoro, Zanzibar, Selous)
  if (lowerQuery.includes('serengeti') || lowerQuery.includes('migration') || lowerQuery.includes('wildlife') || lowerQuery.includes('best time')) {
    return {
      reply: "🦁 Serengeti Expedition Intelligence:\n• **Calving Season (Jan–Mar):** Southern Ndutu plains for predator action.\n• **River Crossings (Jul–Oct):** Northern Mara River for dramatic migration leaps.\n\nRecommendation: Ensure a minimum of 3 nights in the Serengeti circuit to account for transit distances from Arusha or Ngorongoro.",
      diagnostic,
      suggestedAction: {
        label: 'Explore Serengeti Inventory',
        type: 'SUGGEST_ROUTE',
        payload: { circuit: 'NORTHERN', focus: 'SERENGETI' }
      }
    };
  }

  if (lowerQuery.includes('zanzibar') || lowerQuery.includes('beach') || lowerQuery.includes('stone town')) {
    return {
      reply: "🏝️ Coastal Integration Protocol:\nCombining a northern wildlife safari with Zanzibar requires an immediate bush flight (e.g., Serengeti/Manyara to Abeid Amani Karume International Airport) or a return via Kilimanjaro/Dar es Salaam. Avoid same-day cross-country driving connections.",
      diagnostic
    };
  }

  // 4. Transport & Vehicle Compliance Inquiries
  if (lowerQuery.includes('transport') || lowerQuery.includes('car') || lowerQuery.includes('cruiser') || lowerQuery.includes('driver') || lowerQuery.includes('4x4')) {
    const hasTransport = allItineraryItems.some(s => s.item?.category === 'TRANSPORT');
    if (!hasTransport) {
      return {
        reply: "🚨 Logistical Gap Identified: Your itinerary includes wilderness parks or lodges but lacks a licensed 4x4 Safari Land Cruiser. In Tanzania, park terrain mandates dedicated rugged transport.",
        diagnostic,
        suggestedAction: {
          label: 'Deploy 4x4 Safari Cruiser',
          type: 'ADD_ITEM',
          payload: { category: 'TRANSPORT' }
        }
      };
    }
    return {
      reply: "✓ Dedicated 4x4 safari ground transport is successfully secured within your itinerary manifest.",
      diagnostic
    };
  }

  // 5. General Context-Aware AI Orchestrator Fallback
  return {
    reply: `🤖 **Chrono-Master AI Core Active**\nI am continuously auditing your ${days.length}-day operational canvas (${allItineraryItems.length} active bookings). \n\nCurrent Itinerary Health: **${diagnostic.score}% (${diagnostic.label})**\n*${diagnostic.advice}*\n\nAsk me about circuit routing, park gate timings, flight connections, or budget structuring.`,
    diagnostic,
    proactiveInsights: [
      "All rules adhere to East African tourism transit thresholds.",
      "Ready to export to PDF client manifests upon your confirmation."
    ]
  };
}