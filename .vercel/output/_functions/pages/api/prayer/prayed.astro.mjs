export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  const { id } = await request.json();
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key || !id) return new Response(JSON.stringify({ ok: false }), { status: 200 });
  const res = await fetch(`${url}/rest/v1/prayer_requests?id=eq.${id}`, {
    method: "PATCH",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ prayers_count: { "increment": 1 } })
  });
  if (!res.ok) return new Response(JSON.stringify({ ok: false }), { status: 500 });
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
