import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) {
    return new Response(JSON.stringify({ rows: [] }), { headers: { 'content-type':'application/json' } });
  }
  const res = await fetch(`${url}/rest/v1/prayer_requests?select=id,first_name,city,country,prayers_count,created_at&approved=eq.true&order=created_at.desc&limit=200`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  const rows = await res.json();
  return new Response(JSON.stringify({ rows }), { headers: { 'content-type':'application/json' } });
};
