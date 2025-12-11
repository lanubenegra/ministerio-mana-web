export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  const form = await request.formData();
  const token = form.get("cf-turnstile-response");
  return new Response(JSON.stringify({ ok: !!token }));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
