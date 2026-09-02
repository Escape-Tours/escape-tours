import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getSupabaseClient = () => supabase

export async function createBookingRecord(bookingData: {
  package_id: string
  user_id?: string
  total_price: number
  residency_tier: 'citizen' | 'resident' | 'international'
  status: string
}) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}