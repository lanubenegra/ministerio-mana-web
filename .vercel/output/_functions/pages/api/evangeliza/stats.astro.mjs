export { renderers } from '../../../renderers.mjs';

const store = globalThis.__ev_store ?? (globalThis.__ev_store = []);
const prerender = false;
const GET = async () => {
  const byCountry = {};
  for (const r of store) byCountry[r.country] = (byCountry[r.country] || 0) + 1;
  return new Response(JSON.stringify({ ok: true, total: store.length, byCountry }));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
