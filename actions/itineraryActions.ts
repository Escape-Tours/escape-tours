'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { Decimal } from 'decimal.js';

const BookingSchema = z.object({
  itinerary_item_id: z.string().uuid().optional().nullable(),
  hotel_id: z.any().optional(),
  first_name: z.string().min(2).optional(),
  last_name: z.string().min(2).optional(),
  full_name: z.string().min(2).optional(),
  email: z.string().email(),
  phone: z.string().min(8),
  start_date: z.string().optional(),
  check_in: z.string().optional(),
  check_out: z.string(),
  total_amount: z.union([z.number(), z.string()]),
  subtotal: z.union([z.number(), z.string()]).optional(),
  base_price: z.union([z.number(), z.string()]).optional(),
  vat: z.union([z.number(), z.string()]).optional(),
  vat_amount: z.union([z.number(), z.string()]).optional(),
  agency_fee: z.union([z.number(), z.string()]).optional(),
  agent_fee: z.union([z.number(), z.string()]).optional(),
  park_fees_total: z.union([z.number(), z.string()]).optional(),
  nights: z.union([z.number(), z.string()]),
  currency: z.string().optional().default('USD'),
  status: z.enum(['pending', 'draft', 'confirmed', 'PENDING', 'DRAFT', 'CONFIRMED']),
  adults: z.union([z.number(), z.string()]),
  children: z.union([z.number(), z.string()]),
  room_category: z.string().optional(),
  residency_type: z.string().optional(),
  service_name: z.string().optional(),
  service_type: z.string().optional(),
  special_requests: z.string().optional(),
});

export async function createBooking(payload: unknown) {
  const validation = BookingSchema.safeParse(payload);
  
  if (!validation.success) {
    console.error('Validation failed:', validation.error.format());
    return { success: false, error: 'Invalid booking data provided.' };
  }

  const data = validation.data;
  const supabase = await createClient();

  try {
    const fullName = data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim();
    const checkInDate = data.check_in || data.start_date || new Date().toISOString().split('T')[0];
    const baseVal = data.base_price || data.subtotal || 0;
    const vatVal = data.vat_amount || data.vat || 0;
    const feeVal = data.agent_fee || data.agency_fee || 0;

    // Safe core insert payload mapped to primary booking columns
    const insertPayload: any = {
      ...(data.itinerary_item_id ? { itinerary_item_id: data.itinerary_item_id } : {}),
      full_name: fullName,
      email: data.email,
      phone: String(data.phone),
      check_in: checkInDate,
      check_out: data.check_out,
      nights: Number(data.nights),
      adults: Number(data.adults),
      children: Number(data.children),
      currency: data.currency || 'USD',
      base_price: Number(new Decimal(baseVal).toFixed(2)),
      vat_amount: Number(new Decimal(vatVal).toFixed(2)),
      agent_fee: Number(new Decimal(feeVal).toFixed(2)),
      total_amount: Number(new Decimal(data.total_amount).toFixed(2)),
      status: data.status,
    };

    // Safely append optional fields if present
    if (data.park_fees_total !== undefined) {
      insertPayload.park_fees_total = Number(new Decimal(data.park_fees_total).toFixed(2));
    }
    if (data.room_category) insertPayload.room_category = data.room_category;
    if (data.service_name) insertPayload.service_name = data.service_name;
    if (data.service_type) insertPayload.service_type = data.service_type;

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error('Supabase detailed insert error:', error);
      throw error;
    }

    return { success: true, data: booking };
  } catch (err: any) {
    console.error('Database Error:', err);
    return { success: false, error: err?.message || 'Failed to save booking to database.' };
  }
}

export async function updateItineraryItemDay(itemId: string, dayId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('itinerary_items')
    .update({ day: Number(dayId) } as any)
    .eq('id', itemId)
    .select();

  if (error) {
    console.error('Update Day Error:', error);
    return { success: false, error: 'Could not persist change.' };
  }

  return { success: true, data };
}