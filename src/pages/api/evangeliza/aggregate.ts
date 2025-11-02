import type { APIRoute } from 'astro';

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE;

export const prerender = false;

export const GET: APIRoute = async () => {
  if (!url || !serviceKey) {
    return new Response(JSON.stringify({ rows: [] }), { headers: { 'content-type':'application/json' } });
  }
  const endpoint = `${url}/rest/v1/evangeliza?select=city,country,lat,lng,count:count()&group=city,country,lat,lng`;
  const res = await fetch(endpoint, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }
  });
  const rows = await res.json();
  return new Response(JSON.stringify({ rows }), { headers: { 'content-type':'application/json' } });
};
