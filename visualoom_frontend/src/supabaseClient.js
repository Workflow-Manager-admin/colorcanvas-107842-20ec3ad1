import { createClient } from "@supabase/supabase-js";

// PUBLIC_INTERFACE
/**
 * Returns a singleton Supabase client using env variables (never hardcoded).
 * Requires REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in .env
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
