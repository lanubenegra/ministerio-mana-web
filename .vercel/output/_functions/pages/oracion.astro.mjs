/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BHL5z7kF.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_31eN-IV8.mjs';
import { $ as $$PrayerWall } from '../chunks/PrayerWall_Dp4luJDg.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Muro de Oraci\xF3n", "description": "Agrega un primer nombre para orar y \xFAnete a interceder por otros." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section"> <h1 class="h1 mb-6">Muro de Oración</h1> ${renderComponent($$result2, "PrayerWall", $$PrayerWall, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/PrayerWall.astro", "client:component-export": "default" })} </section> ` })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/oracion/index.astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/oracion/index.astro";
const $$url = "/oracion";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
