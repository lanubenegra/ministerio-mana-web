
import type { APIRoute } from 'astro';
export const prerender = false;
export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const amountUsd = Number(data.get('amountUsd') || 0);
  const desc = (data.get('desc') || 'Donation') as string;
  // TODO: crear Stripe Checkout Session (monto dinámico)
  return new Response(JSON.stringify({ ok: true, provider: 'stripe', amount: amountUsd, currency: 'USD', desc }), { headers: { 'content-type': 'application/json' } });
};
