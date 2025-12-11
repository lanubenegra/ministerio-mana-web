/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_BHL5z7kF.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_31eN-IV8.mjs';
import { a as getCollection } from '../chunks/_astro_content_C1432Uuv.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const posts = (await getCollection("news")).sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Noticias \u2014 Ministerio Man\xE1", "description": "Noticias e historias de fe del Ministerio Man\xE1." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section"> <h1 class="h1 mb-6">Noticias</h1> <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"> ${posts.map(({ id, slug, data }) => renderTemplate`<article class="card overflow-hidden"> ${data.image && renderTemplate`<img${addAttribute(data.image, "src")}${addAttribute(data.title, "alt")} loading="lazy" class="w-full aspect-[16/9] object-cover">`} <div class="p-4"> <h2 class="font-semibold text-lg"><a${addAttribute(`/noticias/${slug}/`, "href")} class="hover:underline">${data.title}</a></h2> <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">${data.summary}</p> <p class="text-xs mt-3">${new Date(data.date).toLocaleDateString("es")}</p> </div> </article>`)} </div> </section> ` })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/noticias/index.astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/noticias/index.astro";
const $$url = "/noticias";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
