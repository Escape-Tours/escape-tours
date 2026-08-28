// lib/services/ledgerService.ts
import { SplitLedger } from '../../lib/types/ledger-types';

export const getLedgerByItineraryId = async (itineraryId: string): Promise<SplitLedger> => {
  // Logic to fetch split payment status from your database
  // This connects the 'Financial Hub' to the 'User Hub'
  return {
    id: 'ledger-123',
    itineraryId,
    totalAmount: 5000,
    currency: 'USD',
    splits: [
      { participantId: 'user-a', amount: 2500, status: 'PAID', dueDate: new Date('2026-07-01') },
      { participantId: 'user-b', amount: 2500, status: 'PENDING', dueDate: new Date('2026-07-01') }
    ],
    createdAt: new Date()
  };
};