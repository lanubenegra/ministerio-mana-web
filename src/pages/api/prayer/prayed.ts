import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const { id } = await request.json();
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key || !id) return new Response(JSON.stringify({ ok:false }), { status: 200 });

  const res = await fetch(`${url}/rest/v1/prayer_requests?id=eq.${id}`, {
    method: 'PATCH',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'content-type':'application/json' },
    body: JSON.stringify({ prayers_count: { "increment": 1 } })
  });
  if (!res.ok) return new Response(JSON.stringify({ ok:false }), { status: 500 });
  return new Response(JSON.stringify({ ok:true }), { status: 200 });
};
