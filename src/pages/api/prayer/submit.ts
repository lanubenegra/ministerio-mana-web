import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const firstName = (form.get('firstName') as string || '').trim().slice(0,60);
  const city = (form.get('city') as string || '').trim().slice(0,80);
  const country = (form.get('country') as string || '').trim().slice(0,80);
  if (!firstName) return new Response(JSON.stringify({ ok:false, error:'Nombre requerido' }), { status: 400 });

  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE!;
  if (!url || !key) return new Response(JSON.stringify({ ok:true, simulated:true }), { status: 200 });

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from('prayer_requests').insert({ first_name:firstName, city: city||null, country: country||null, prayers_count: 0, approved: true });
  if (error) return new Response(JSON.stringify({ ok:false, error: error.message }), { status: 500 });
  return new Response(JSON.stringify({ ok:true }), { status: 200 });
};
