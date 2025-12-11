export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) {
    return new Response(JSON.stringify({ rows: [] }), { headers: { "content-type": "application/json" } });
  }
  const res = await fetch(`${url}/rest/v1/prayer_requests?select=id,first_name,city,country,prayers_count,created_at&approved=eq.true&order=created_at.desc&limit=200`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  const rows = await res.json();
  return new Response(JSON.stringify({ rows }), { headers: { "content-type": "application/json" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
