/* empty css                                    */
import { d as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, ah as unescapeHTML, m as maybeRenderHead } from '../../chunks/astro/server_BHL5z7kF.mjs';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_31eN-IV8.mjs';
import { a as getCollection } from '../../chunks/_astro_content_C1432Uuv.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.ejemplo-ministeriomana.org");
async function getStaticPaths() {
  const posts = await getCollection("news");
  return posts.map((p) => ({ params: { slug: p.slug.split("/") }, props: { entry: p } }));
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { entry } = Astro2.props;
  const { Content, data } = await entry.render();
  const url = new URL(Astro2.url);
  `${url.origin}/noticias/${entry.slug}/`;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${data.title} \u2014 Noticias`, "description": data.summary }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<article class="prose dark:prose-invert mx-auto"> <h1 class="mb-2">', '</h1> <p class="text-sm text-gray-500">', "</p> ", ' </article> <script type="application/ld+json">', "<\/script> "])), maybeRenderHead(), data.title, new Date(data.date).toLocaleDateString("es"), renderComponent($$result2, "Content", Content, {}), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: data.title,
    datePublished: data.date,
    dateModified: data.date,
    description: data.summary
  }))) })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/noticias/[...slug].astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/noticias/[...slug].astro";
const $$url = "/noticias/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
