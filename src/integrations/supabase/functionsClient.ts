import { createClient } from '@supabase/supabase-js';

/**
 * Edge functions are deployed to the Lovable Cloud project, while the
 * storefront's data client still points at the older project. Invoking
 * functions through the data client hits stale, out-of-date copies — that's
 * what made corrected shipping prices appear to "revert".
 *
 * Use this client for every edge function call so the live, current version
 * always answers.
 */
const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_URL as string;
const FUNCTIONS_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const functionsClient = createClient(FUNCTIONS_URL, FUNCTIONS_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
