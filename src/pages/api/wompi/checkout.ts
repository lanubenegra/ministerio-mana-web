
import type { APIRoute } from 'astro';
export const prerender = false;
export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const amount = Number(data.get('amount') || 0);
  const desc = (data.get('desc') || 'Donación') as string;
  // TODO: crear la preferencia/checkout de Wompi (Redirect o Widget)
  // Por ahora devolvemos un JSON de demo
  return new Response(JSON.stringify({ ok: true, provider: 'wompi', amount, currency: 'COP', desc }), { headers: { 'content-type': 'application/json' } });
};
