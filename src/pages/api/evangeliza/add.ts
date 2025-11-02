
import type { APIRoute } from 'astro';

const store: { name:string, country:string, city:string, ts:number }[] = globalThis.__ev_store ?? (globalThis.__ev_store = []);

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name = String(data.get('name') || '').trim();
  const country = String(data.get('country') || '').trim();
  const city = String(data.get('city') || '').trim();
  if(!name || !country || !city) return new Response(JSON.stringify({ ok:false }));
  store.push({ name, country, city, ts: Date.now() });
  return new Response(JSON.stringify({ ok:true }));
};
