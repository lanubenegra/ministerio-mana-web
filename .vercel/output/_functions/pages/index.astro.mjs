/* empty css                                 */
import { d as createAstro, c as createComponent, m as maybeRenderHead, a as renderTemplate, e as addAttribute, r as renderComponent, ap as Fragment } from '../chunks/astro/server_BHL5z7kF.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_31eN-IV8.mjs';
import 'clsx';
import { $ as $$EventCard } from '../chunks/EventCard_DN6tJILE.mjs';
import { a as getCollection } from '../chunks/_astro_content_C1432Uuv.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://www.ejemplo-ministeriomana.org");
const $$Hero = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Hero;
  const { title, subtitle, ctas = [] } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="relative"> <img src="/hero.jpg" alt="" class="absolute inset-0 h-full w-full object-cover opacity-20 dark:opacity-30" loading="eager"> <div class="container-tight pt-16 pb-20 relative"> <h1 class="h1">${title}</h1> ${subtitle && renderTemplate`<p class="lead max-w-2xl mt-3">${subtitle}</p>`} <div class="mt-6 flex flex-wrap gap-3"> ${ctas.map((c) => renderTemplate`<a${addAttribute(c.href, "href")} class="btn-primary normal-case">${c.label}</a>`)} </div> </div> </section>`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/components/Hero.astro", void 0);

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const eventsAll = (await getCollection("events")).sort((a, b) => a.data.date.localeCompare(b.data.date));
  const upcoming = eventsAll.slice(0, 3);
  const news = (await getCollection("news")).sort((a, b) => b.data.date.localeCompare(a.data.date)).slice(0, 3);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Ministerio Man\xE1 \u2014 Bienvenido", "description": "Iglesias, devocionales, Campus Man\xE1, Escuela B\xEDblica y eventos." }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Hero", $$Hero, { "title": "Compartimos el Pan de Vida", "subtitle": "Planifica tu visita, descubre Campus Man\xE1 y participa en los pr\xF3ximos eventos.", "ctas": [{ href: "/iglesias/", label: "Planifica tu visita" }, { href: "/eventos/", label: "Ver eventos" }, { href: "/donaciones/", label: "Donar" }] })} ${maybeRenderHead()}<section class="container-tight mt-12 grid gap-6 md:grid-cols-3"> <div class="card p-5"><h3 class="font-semibold text-lg mb-1">Palabra</h3><p class="text-sm text-gray-700 dark:text-gray-200">Cristo en el centro, Escritura como fundamento. Devocional diario y discipulado.</p></div> <div class="card p-5"><h3 class="font-semibold text-lg mb-1">Comunidad</h3><p class="text-sm text-gray-700 dark:text-gray-200">Nos reunimos en sedes y grupos, servimos y caminamos juntos.</p></div> <div class="card p-5"><h3 class="font-semibold text-lg mb-1">Misión</h3><p class="text-sm text-gray-700 dark:text-gray-200">Campus Maná y obra social: jóvenes y familias que transforman su entorno.</p></div> </section> <section class="container-tight mt-12"> <h2 class="h2 mb-3">Próximos eventos</h2> <div class="grid gap-6 md:grid-cols-3"> ${upcoming.map((e) => renderTemplate`${renderComponent($$result2, "EventCard", $$EventCard, { "event": e })}`)} </div> </section> <section class="container-tight py-14 space-y-6" id="noticias"> <header class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between"> <div> <p class="eyebrow">Noticias y testimonios</p> <h2 class="h2">Lo que Dios está haciendo con Maná</h2> <p class="text-sm text-slate-600 max-w-xl">
Historias reales del Devocional Maná, Mujeres que creen, Campus Maná e iglesias en las naciones.
</p> </div> <a href="/noticias/" class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 hover:text-sky-900">
VER TODAS
</a> </header> <div class="grid gap-5 md:grid-cols-3"> ${news.map(({ slug, data }) => renderTemplate`<article class="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col"> ${data.image && renderTemplate`<a${addAttribute(`/noticias/${slug}/`, "href")} class="block overflow-hidden aspect-[4/3]"> <img${addAttribute(data.image, "src")}${addAttribute(data.title, "alt")} loading="lazy" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"> </a>`} <div class="p-5 flex flex-col gap-2 flex-1"> <p class="text-[11px] uppercase tracking-[0.2em] text-slate-500"> ${new Date(data.date).toLocaleDateString("es-CO")} ${data.category && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` · ${data.category}` })}`} </p> <h3 class="text-sm font-semibold text-slate-900 line-clamp-2"> ${data.title} </h3> ${data.summary && renderTemplate`<p class="text-xs text-slate-600 line-clamp-3"> ${data.summary} </p>`} <div class="mt-3"> <a${addAttribute(`/noticias/${slug}/`, "href")} class="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-900">
Leer historia
<span aria-hidden="true">→</span> </a> </div> </div> </article>`)} </div> </section> ` })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/index.astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
