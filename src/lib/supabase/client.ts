import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("Supabase credentials missing. Check .env.local.");
    // Return a dummy client or similar if needed, but for now just avoid crashing the factory
    return createBrowserClient(
      url || "https://placeholder.supabase.co",
      key || "placeholder_key"
    );
  }

  return createBrowserClient(url, key);
}
