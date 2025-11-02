
import type { APIRoute } from 'astro';
export const prerender = false;
export const POST: APIRoute = async ({ request }) => {
  const event = await request.json();
  // TODO: Validar firma de Wompi y registrar en DB (Supabase)
  console.log('Wompi webhook', event);
  return new Response(JSON.stringify({ ok: true }));
};
