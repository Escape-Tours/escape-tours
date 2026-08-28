// lib/types/ledger-types.ts
export interface SplitLedger {
  id: string;
  itineraryId: string;
  totalAmount: number;
  currency: string;
  splits: Array<{
    participantId: string;
    amount: number;
    status: 'PENDING' | 'PAID' | 'OVERDUE';
    dueDate: Date;
  }>;
  createdAt: Date;
}