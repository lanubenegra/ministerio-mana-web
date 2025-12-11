/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as renderScript } from '../chunks/astro/server_BHL5z7kF.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_31eN-IV8.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Plan de lectura b\xEDblica", "description": "Plan semanal (Salmos y Evangelios). Marca tu progreso y abre el pasaje en el visor." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section"> <h1 class="h1 mb-4">Plan de lectura</h1> <p class="text-sm text-gray-600">MVP sin cuenta: se guarda en tu dispositivo. Para abrir el pasaje usa el botón "Leer".</p> <div id="plan" class="mt-4 grid md:grid-cols-2 gap-6"></div> <div class="mt-6 card p-4"> <h2 class="font-semibold">Medallas</h2> <p id="medals" class="text-sm"></p> </div> </section> ${renderScript($$result2, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/plan-lectura/index.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/plan-lectura/index.astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/plan-lectura/index.astro";
const $$url = "/plan-lectura";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
