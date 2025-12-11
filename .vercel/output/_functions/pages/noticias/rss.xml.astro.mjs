import rss from '@astrojs/rss';
import { a as getCollection } from '../../chunks/_astro_content_C1432Uuv.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async (ctx) => {
  const posts = (await getCollection("news")).sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  return rss({
    title: "Ministerio Maná — Noticias",
    description: "Noticias e historias de fe",
    site: ctx.site.href,
    items: posts.map((p) => ({
      link: `/noticias/${p.slug}/`,
      title: p.data.title,
      pubDate: new Date(p.data.date),
      description: p.data.summary
    }))
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
