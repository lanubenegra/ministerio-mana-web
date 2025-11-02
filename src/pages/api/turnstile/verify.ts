
import type { APIRoute } from 'astro';
export const prerender = false;
export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const token = form.get('cf-turnstile-response');
  // TODO: Llamar a https://challenges.cloudflare.com/turnstile/v0/siteverify con secret y token
  return new Response(JSON.stringify({ ok: !!token }));
};
