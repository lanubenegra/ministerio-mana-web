
import type { APIRoute } from 'astro';
const store: { name:string, country:string, city:string, ts:number }[] = globalThis.__ev_store ?? (globalThis.__ev_store = []);
export const prerender = false;
export const GET: APIRoute = async () => {
  const byCountry: Record<string, number> = {};
  for (const r of store) byCountry[r.country] = (byCountry[r.country] || 0) + 1;
  return new Response(JSON.stringify({ ok:true, total: store.length, byCountry }));
};
