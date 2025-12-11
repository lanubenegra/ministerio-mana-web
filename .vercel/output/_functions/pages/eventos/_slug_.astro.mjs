/* empty css                                    */
import { d as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_BHL5z7kF.mjs';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_31eN-IV8.mjs';
import { g as getEntry } from '../../chunks/_astro_content_C1432Uuv.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://www.ejemplo-ministeriomana.org");
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const entry = await getEntry("events", slug);
  if (!entry) throw new Error("Evento no encontrado");
  const d = entry.data;
  const { Content } = await entry.render();
  const eventDate = new Date(d.date);
  const structured = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": d.title,
    "startDate": eventDate.toISOString(),
    "location": { "@type": "Place", "name": d.location }
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": d.title + " \u2014 Evento", "description": d.summary ?? d.location, "image": d.heroImage, "type": "event", "structuredData": structured }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container-tight py-10 grid gap-6 md:grid-cols-3"> <article class="md:col-span-2 prose dark:prose-invert"> <h1>${d.title}</h1> <p class="text-sm text-gray-600"> ${eventDate.toLocaleDateString("es-ES", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })} • ${d.location} </p> ${d.summary && renderTemplate`<p class="text-lg text-gray-700 dark:text-gray-200">${d.summary}</p>`} ${renderComponent($$result2, "Content", Content, {})} </article> <aside class="space-y-4"> ${d.heroImage && renderTemplate`<img${addAttribute(d.heroImage, "src")} alt="" class="rounded-lg border border-gray-200 dark:border-gray-800">`} ${d.brochurePdf && renderTemplate`<a${addAttribute(d.brochurePdf, "href")} target="_blank" rel="noopener noreferrer" class="btn-secondary w-full justify-center normal-case">
Ver brochure (PDF)
</a>`} </aside> </section> ` })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/eventos/[slug].astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/eventos/[slug].astro";
const $$url = "/eventos/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
