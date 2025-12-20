import type { APIRoute } from 'astro';
import { supabaseAdmin } from '@lib/supabaseAdmin';
import { geocodeCityCountry } from '@lib/geocode';
import { verifyTurnstile } from '@lib/turnstile';
import { enforceRateLimit } from '@lib/rateLimit';
import { logSecurityEvent } from '@lib/securityEvents';
import { safeCountry } from '@lib/donations';
import { sanitizePlainText, containsBlockedSequence } from '@lib/validation';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  try {
    const form = await request.formData();
    const firstNameRaw = (form.get('firstName') as string) || '';
    const cityRaw = (form.get('city') as string) || '';
    const countryRaw = (form.get('country') as string) || '';
    const campusRaw = (form.get('campus') as string) || '';

    if (containsBlockedSequence(firstNameRaw) || containsBlockedSequence(cityRaw) || containsBlockedSequence(campusRaw)) {
      return new Response(JSON.stringify({ ok:false, error:'No se permiten enlaces o caracteres especiales.' }), { status: 400 });
    }

    const firstName = sanitizePlainText(firstNameRaw, 60);
    const city = sanitizePlainText(cityRaw, 80);
    const campus = sanitizePlainText(campusRaw, 80);
    const country = sanitizePlainText(countryRaw, 80);
    const cfToken = (form.get('cf-turnstile-response') as string) || undefined;

    if (!firstName) {
      return new Response(JSON.stringify({ ok:false, error:'Nombre requerido' }), { status: 400 });
    }

    const turnstileConfigured = Boolean(
      import.meta.env?.TURNSTILE_SECRET_KEY ?? process.env?.TURNSTILE_SECRET_KEY,
    );
    if (turnstileConfigured) {
      const okCaptcha = await verifyTurnstile(cfToken, clientAddress);
      if (!okCaptcha) {
        void logSecurityEvent({
          type: 'captcha_failed',
          identifier: 'evangeliza.submit',
          ip: clientAddress,
          detail: 'Turnstile inválido',
        });
        return new Response(JSON.stringify({ ok:false, error:'Captcha inválido' }), { status: 400 });
      }
    } else {
      // Solo bypass en entornos sin llaves (dev). En prod debe estar configurado.
      console.warn('[EVANGELIZA] Turnstile no configurado: bypass en entorno local/dev');
    }

    const allowed = await enforceRateLimit(`evangeliza:${clientAddress ?? 'unknown'}`);
    if (!allowed) {
      void logSecurityEvent({
        type: 'rate_limited',
        identifier: `evangeliza:${clientAddress ?? 'unknown'}`,
        ip: clientAddress,
        detail: 'Evangeliza submit',
      });
      return new Response(JSON.stringify({ ok:false, error:'Demasiadas solicitudes' }), { status: 429 });
    }

    let lat: number | null = null;
    let lng: number | null = null;
    const geo = await geocodeCityCountry(city, country);
    if (geo) { lat = geo.lat; lng = geo.lng; }

    const countryCode = safeCountry(country) ?? null;
    const cityClean = city || null;
    const campusClean = campus || null;

    if (supabaseAdmin) {
      const { error } = await supabaseAdmin.from('evangeliza').insert({
        first_name: firstName, city: cityClean || null, country: countryCode, lat, lng, campus: campusClean || null
      });
      if (error) {
        void logSecurityEvent({
          type: 'payment_error',
          identifier: 'evangeliza.submit',
          ip: clientAddress,
          detail: 'Supabase insert error',
          meta: { error: error.message },
        });
        return new Response(JSON.stringify({ ok:false, error: error.message }), { status: 500 });
      }
    } else {
      console.log('[EVANGELIZA] (no-supabase)', { firstName, city, country, lat, lng, campus });
    }

    const point = lat != null && lng != null
      ? { lat, lng, label: [cityClean, countryCode].filter(Boolean).join(', ') || 'Nuevo punto', count: 1 }
      : null;

    return new Response(JSON.stringify({ ok:true, point }), { status: 200, headers: { 'content-type':'application/json' } });
  } catch (e:any) {
    void logSecurityEvent({
      type: 'payment_error',
      identifier: 'evangeliza.submit',
      ip: clientAddress,
      detail: e?.message || 'Evangeliza submit error',
    });
    return new Response(JSON.stringify({ ok:false, error: e?.message || 'Error' }), { status: 500 });
  }
};
