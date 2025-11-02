import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.SUPABASE_URL as string;
const key = import.meta.env.SUPABASE_SERVICE_ROLE as string;

export const supabaseAdmin = url && key
  ? createClient(url, key, { auth: { persistSession: false } })
  : undefined;
