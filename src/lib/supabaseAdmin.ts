import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.SUPABASE_URL as string;
// Permitimos ambos nombres para evitar confusión entre _KEY y sin _KEY
const key =
  (import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string) ||
  (import.meta.env.SUPABASE_SERVICE_ROLE as string);

if (!url || !key) {
  console.warn('[Supabase] Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el .env.local');
}

export const supabaseAdmin = url && key
  ? createClient(url, key, { auth: { persistSession: false } })
  : undefined;
