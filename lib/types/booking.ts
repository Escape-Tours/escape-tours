import { Decimal } from 'decimal.js';

/**
 * 1. Database Schema
 */
export interface ItineraryBooking {
  readonly id: string;
  readonly user_id: string;
  itinerary_item_id: string;
  full_name: string;
  email: string;
  phone: string;
  start_date: string;
  check_out: string; // Added to match Supabase schema
  adults: number;
  children: number;
  nights: number;        // Required for calculation validation
  currency: 'USD' | 'TZS'; // Explicit currency typing
  base_price: Decimal;   // Raw rate from pricing engine
  vat_amount: Decimal;   // Calculated tax
  total_amount: Decimal; // Final payable amount
  status: BookingStatus;
  room_category: string; // Essential for JSONB lookups
  service_name: string;  // Required for invoice/booking records
  service_type: 'hotel' | 'park' | 'transfer';
  readonly created_at: string;
}

/**
 * 2. Type-Safe State Definitions
 */
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'draft';
export const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled', 'draft'] as const;

/**
 * 3. Form-Specific Payloads
 * Omitted system-generated fields to simplify the creation process.
 */
export type CreateBookingPayload = Omit<
  ItineraryBooking,
  'id' | 'user_id' | 'status' | 'created_at'
>;

export type UpdateBookingPayload = Partial<CreateBookingPayload>;

/**
 * 4. UI Helper Types
 */
export interface BookingFormState {
  data: CreateBookingPayload;
  isValid: boolean;
  isSubmitting: boolean;
  error: string | null;
}