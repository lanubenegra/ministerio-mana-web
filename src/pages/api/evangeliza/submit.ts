import type { APIRoute } from 'astro';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { geocodeCityCountry } from '@/lib/geocode';

export const prerender = false;

async function verifyTurnstile(token?: string, ip?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // skip if not configured
  if (!token) return false;
  const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type':'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, remoteip: ip || '' }),
  });
  const json = await resp.json();
  return !!json.success;
}

export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  try {
    const form = await request.formData();
    const firstName = (form.get('firstName') as string || '').trim().slice(0, 60);
    const city = ((form.get('city') as string) || '').trim().slice(0, 80);
    const country = ((form.get('country') as string) || '').trim().slice(0, 80);
    const campus = ((form.get('campus') as string) || '').trim().slice(0, 80);
    const cfToken = (form.get('cf-turnstile-response') as string) || undefined;

    if (!firstName) return new Response(JSON.stringify({ ok:false, error:'Nombre requerido' }), { status: 400 });

    const okCaptcha = await verifyTurnstile(cfToken, clientAddress);
    if (!okCaptcha) return new Response(JSON.stringify({ ok:false, error:'Captcha inválido' }), { status: 400 });

    let lat: number | null = null;
    let lng: number | null = null;
    const geo = await geocodeCityCountry(city, country);
    if (geo) { lat = geo.lat; lng = geo.lng; }

    if (supabaseAdmin) {
      const { error } = await supabaseAdmin.from('evangeliza').insert({
        first_name: firstName, city: city || null, country: country || null, lat, lng, campus: campus || null
      });
      if (error) return new Response(JSON.stringify({ ok:false, error: error.message }), { status: 500 });
    } else {
      console.log('[EVANGELIZA] (no-supabase)', { firstName, city, country, lat, lng, campus });
    }

    return new Response(JSON.stringify({ ok:true }), { status: 200, headers: { 'content-type':'application/json' } });
  } catch (e:any) {
    return new Response(JSON.stringify({ ok:false, error: e?.message || 'Error' }), { status: 500 });
  }
};
