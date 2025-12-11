export { renderers } from '../../../renderers.mjs';

const store = globalThis.__ev_store ?? (globalThis.__ev_store = []);
const prerender = false;
const POST = async ({ request }) => {
  const data = await request.formData();
  const name = String(data.get("name") || "").trim();
  const country = String(data.get("country") || "").trim();
  const city = String(data.get("city") || "").trim();
  if (!name || !country || !city) return new Response(JSON.stringify({ ok: false }));
  store.push({ name, country, city, ts: Date.now() });
  return new Response(JSON.stringify({ ok: true }));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
