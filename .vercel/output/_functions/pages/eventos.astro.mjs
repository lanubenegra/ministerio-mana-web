/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BHL5z7kF.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_31eN-IV8.mjs';
import { $ as $$EventCard } from '../chunks/EventCard_DN6tJILE.mjs';
import { a as getCollection } from '../chunks/_astro_content_C1432Uuv.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const events = (await getCollection("events")).sort((a, b) => a.data.date.localeCompare(b.data.date));
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Eventos \u2014 Ministerio Man\xE1", "description": "Calendario de actividades: adoraci\xF3n, conferencias y peregrinaciones." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container-tight py-10"> <h1 class="h1 mb-6">Eventos</h1> <div class="grid gap-6 md:grid-cols-3"> ${events.map((e) => renderTemplate`${renderComponent($$result2, "EventCard", $$EventCard, { "event": e })}`)} </div> </section> ` })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/eventos/index.astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/eventos/index.astro";
const $$url = "/eventos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
