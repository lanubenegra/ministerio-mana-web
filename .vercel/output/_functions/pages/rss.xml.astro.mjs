import rss from '@astrojs/rss';
export { renderers } from '../renderers.mjs';

async function GET(context) {
  return rss({ title: "Ministerio Maná", description: "Noticias y devocionales", site: context.site?.toString() ?? "http://localhost:4321", items: [] });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
