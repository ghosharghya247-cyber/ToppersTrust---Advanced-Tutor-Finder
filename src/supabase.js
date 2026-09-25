// src/supabase.js
import { createClient } from '@supabase/supabase-js'

const configuredSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!configuredSupabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing. Check your .env file and restart the dev server.");
}

// createClient expects the project root. Accidentally pasting a REST/Auth API URL
// makes it request paths such as /rest/v1/auth/v1 and Supabase rejects login.
const supabaseUrl = configuredSupabaseUrl
  .replace(/\/(?:rest|auth|storage)\/v1\/?$/i, '')
  .replace(/\/+$/, '');

try {
  new URL(supabaseUrl);
} catch {
  throw new Error("VITE_SUPABASE_URL must be a valid Supabase project URL (for example, https://project-ref.supabase.co).");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

