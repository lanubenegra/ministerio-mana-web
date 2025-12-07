import type { APIRoute } from 'astro';
import { verifyTurnstile } from '@lib/turnstile';
import { enforceRateLimit } from '@lib/rateLimit';
import { logSecurityEvent } from '@lib/securityEvents';
import { containsBlockedSequence } from '@lib/validation';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const contentType = request.headers.get('content-type') || '';
  let email = '';
  let lang = 'es';
  let token: string | undefined;

  if (contentType.includes('application/json')) {
    const body = await request.json();
    email = (body?.email || '').toLowerCase().trim();
    lang = body?.lang || 'es';
    token = body?.['cf-turnstile-response'];
  } else {
    const form = await request.formData();
    email = (form.get('email') as string || '').toLowerCase().trim();
    lang = (form.get('lang') as string) || 'es';
    token = form.get('cf-turnstile-response')?.toString();
  }

  if (containsBlockedSequence(email)) {
    void logSecurityEvent({
      type: 'payment_error',
      identifier: 'newsletter.subscribe',
      detail: 'Email contiene URL bloqueada',
      meta: { email },
    });
    return new Response(JSON.stringify({ ok:false, error:'Email inválido' }), { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    void logSecurityEvent({
      type: 'payment_error',
      identifier: 'newsletter.subscribe',
      detail: 'Email inválido',
      meta: { email },
    });
    return new Response(JSON.stringify({ ok:false, error:'Email inválido' }), { status: 400 });
  }

  if (!['es', 'en'].includes(lang)) lang = 'es';

  const okCaptcha = await verifyTurnstile(token, clientAddress);
  if (!okCaptcha) {
    void logSecurityEvent({
      type: 'captcha_failed',
      identifier: 'newsletter.subscribe',
      ip: clientAddress,
      detail: 'Turnstile inválido',
    });
    return new Response(JSON.stringify({ ok:false, error:'Captcha inválido' }), { status: 400 });
  }

  const allowed = await enforceRateLimit(`newsletter:${clientAddress ?? 'unknown'}`);
  if (!allowed) {
    void logSecurityEvent({
      type: 'rate_limited',
      identifier: `newsletter:${clientAddress ?? 'unknown'}`,
      ip: clientAddress,
      detail: 'Newsletter subscribe',
    });
    return new Response(JSON.stringify({ ok:false, error:'Demasiadas solicitudes' }), { status: 429 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;

  if (url && key) {
    const res = await fetch(`${url}/rest/v1/newsletter_subscribers`, {
      method: 'POST',
      headers: { apikey:key, Authorization: `Bearer ${key}`, 'content-type':'application/json' },
      body: JSON.stringify({ email, lang })
    });
    if (!res.ok) {
      const text = await res.text();
      void logSecurityEvent({
        type: 'payment_error',
        identifier: 'newsletter.subscribe',
        detail: 'Supabase insert error',
        meta: { status: res.status, body: text.slice(0, 400) },
      });
    }
  }

  const rzKey = process.env.RESEND_API_KEY;
  if (rzKey) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${rzKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: 'Ministerio Maná <info@ministeriomana.org>',
        to: [email],
        subject: lang==='es' ? '¡Gracias por unirte al boletín de Maná!' : 'Thanks for subscribing — Maná',
        html: lang==='es'
          ? '<p>Te enviaremos devocionales, eventos y oportunidades de apoyar la misión.</p>'
          : '<p>We will send devotionals, events and opportunities to support the mission.</p>'
      })
    });
  }

  return new Response(JSON.stringify({ ok:true }), { status: 200 });
};
