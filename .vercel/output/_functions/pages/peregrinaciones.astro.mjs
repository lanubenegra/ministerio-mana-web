/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_BHL5z7kF.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_31eN-IV8.mjs';
import { a as getCollection } from '../chunks/_astro_content_C1432Uuv.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const events = await getCollection("events", ({ data }) => data.category === "peregrinacion");
  const peregrinaciones = events.sort((a, b) => b.data.date.localeCompare(a.data.date));
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Peregrinaciones \xB7 Ministerio Man\xE1", "description": "Peregrinaciones a Israel, Turqu\xEDa y otros destinos para crecer en la fe y en el conocimiento de la Palabra." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container-tight py-12 space-y-8"> <header class="space-y-3 max-w-3xl"> <p class="eyebrow">Peregrinaciones</p> <h1 class="h1">Viajes que fortalecen la fe</h1> <p class="lead">
Israel, Turquía y otros destinos bíblicos para caminar la Palabra, aprender juntos
        y servir como comunidad Maná.
</p> </header> <div class="grid gap-6 md:grid-cols-2"> ${peregrinaciones.map(({ slug, data }) => renderTemplate`<article class="rounded-3xl bg-white shadow-sm p-6 flex flex-col gap-3"> <p class="text-xs font-semibold uppercase tracking-[0.15em] text-sky-600"> ${data.location} · ${new Date(data.date).toLocaleDateString("es-CO")} </p> <h2 class="text-lg font-semibold text-slate-900"> ${data.title} </h2> <p class="text-sm text-slate-600"> ${data.summary} </p> <div class="mt-3 flex flex-wrap gap-3"> <a${addAttribute(`/eventos/${slug}/`, "href")} class="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 via-indigo-600 to-pink-500 shadow-sm">
Ver detalles
</a> ${data.brochurePdf && renderTemplate`<a${addAttribute(data.brochurePdf, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-sky-700 bg-sky-50">
Ver brochure en PDF
</a>`} </div> </article>`)} </div> </section> ` })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/peregrinaciones/index.astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/peregrinaciones/index.astro";
const $$url = "/peregrinaciones";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
