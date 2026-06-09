import { createClient } from "@supabase/supabase-js";

// Browser/client Supabase instance. Reads only the public env vars.
// When the env vars are absent (e.g. first local run) the UI falls back to
// mock data, so the app stays viewable before Supabase is provisioned.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anon);

export const supabase = isSupabaseConfigured
  ? createClient(url as string, anon as string)
  : null;
