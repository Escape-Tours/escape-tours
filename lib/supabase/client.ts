// lib/supabase/client.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from 'lib/supabase/database.types'; 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 1. The Singleton Instance (for 'import { supabase }')
export const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);

// 2. The Legacy/Factory Export (for 'import { createClient }')
// This satisfies files that were already calling createClient() as a function
export const createClient = () => supabase;

// 3. Helper Export for Admin Hub components
export const getSupabaseClient = () => supabase;