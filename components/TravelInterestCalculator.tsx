"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";

export default function TravelInterestCalculator() {
    const [interest, setInterest] = useState<'relax' | 'adventure' | null>(null);

    return (
        <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-200 mt-8">
            <h3 className="font-bold text-lg mb-4">What’s your Zanzibar Vibe?</h3>
            <div className="flex gap-4 mb-4">
                <Button onClick={() => setInterest('relax')} variant={interest === 'relax' ? 'default' : 'outline'}>🏖️ Relax</Button>
                <Button onClick={() => setInterest('adventure')} variant={interest === 'adventure' ? 'default' : 'outline'}>🤿 Adventure</Button>
            </div>
            {interest === 'relax' && <p className="text-sm text-gray-600">Perfect! We'll highlight our private beach villas and sunset dhow cruises.</p>}
            {interest === 'adventure' && <p className="text-sm text-gray-600">Great! We'll prioritize the Jozani Forest treks and deep-sea diving spots.</p>}
        </div>
    );
}