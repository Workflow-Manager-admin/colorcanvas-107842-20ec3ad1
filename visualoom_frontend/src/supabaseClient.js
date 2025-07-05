import { createClient } from "@supabase/supabase-js";

// PUBLIC_INTERFACE
/**
 * Returns a singleton Supabase client using env variables (never hardcoded).
 * Requires REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in .env
 *
 * If these variables are not defined, throw a descriptive error.
 * This ensures developers see the cause of misconfiguration directly at startup, 
 * preventing undefined behavior from an incorrectly configured Supabase client.
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase credentials missing: Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file. " +
    "See assets/supabase.md for the correct values."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
