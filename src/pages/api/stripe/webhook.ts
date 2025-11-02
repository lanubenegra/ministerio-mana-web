
import type { APIRoute } from 'astro';
export const prerender = false;
export const POST: APIRoute = async ({ request }) => {
  const raw = await request.text();
  // TODO: Validar firma stripe-signature y registrar en DB
  console.log('Stripe webhook', raw.slice(0,200));
  return new Response(JSON.stringify({ ok: true }));
};
