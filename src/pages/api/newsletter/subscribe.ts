import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const email = (body?.email || '').toLowerCase().trim();
  const lang = body?.lang || 'es';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return new Response(JSON.stringify({ ok:false, error:'Email inválido' }), { status: 400 });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;

  if (url && key) {
    await fetch(`${url}/rest/v1/newsletter_subscribers`, {
      method: 'POST',
      headers: { apikey:key, Authorization: `Bearer ${key}`, 'content-type':'application/json' },
      body: JSON.stringify({ email, lang })
    });
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
