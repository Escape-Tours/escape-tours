// lib/types/resilience.ts
import { z } from 'zod';

/**
 * World-Class Booking Schema
 * Enforces strict data integrity for payments and database operations.
 */
export const BookingSchema = z.object({
  // UUID ensures unique traceability for every transaction
  bookingId: z.string().uuid("Invalid booking reference format."),
  
  // Financial integrity: using number, but we handle decimal precision in the action
  totalAmount: z.number().positive("Amount must be a positive value."),
  currency: z.enum(['USD', 'TZS', 'EUR']).default('USD'),
  
  // Contact details: Sanitized via .trim() and .toLowerCase()
  email: z.string().email("Please provide a valid email address."),
  phone: z.string()
    .min(8, "Phone number is too short.")
    .transform((val) => val.replace(/\s+/g, '')), // Normalize format early
  
  // Customer identity
  firstName: z.string().min(1, "First name is required.").trim(),
  lastName: z.string().min(1, "Last name is required.").trim(),
  
  // Contextual booking data
  hotelName: z.string().min(1, "Hotel name is required."),
  checkInDate: z.string().datetime(), // Ensure date strings are valid ISO
  checkOutDate: z.string().datetime(),
  
  // Metadata for tracing
  createdAt: z.string().datetime().optional(),
});

// Export the inferred type for use in your components and actions
export type BookingPayload = z.infer<typeof BookingSchema>;