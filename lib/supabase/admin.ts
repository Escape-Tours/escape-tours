import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * World-Class Security:
 * 1. Static validation at runtime startup.
 * 2. Singleton instance to prevent multiple connections in serverless functions.
 * 3. Type-safe configuration.
 */

// Private configuration loader
const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`[Supabase Admin] Missing required environment variable: ${key}`);
  }
  return value;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

// Ensure we aren't leaking the admin key to the client
if (typeof window !== 'undefined') {
  throw new Error("[Supabase Admin] Security Violation: Admin client initialized on client-side.");
}

/**
 * Singleton pattern ensures we reuse the connection pool across serverless invocations,
 * reducing latency and connection overhead.
 */
let adminInstance: SupabaseClient | null = null;

export const getSupabaseAdmin = (): SupabaseClient => {
  if (!adminInstance) {
    adminInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return adminInstance;
};

// Export as a constant for easy usage
export const supabaseAdmin = getSupabaseAdmin();