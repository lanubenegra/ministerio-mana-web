/* empty css                                    */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as renderScript } from '../../chunks/astro/server_BHL5z7kF.mjs';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_31eN-IV8.mjs';
export { renderers } from '../../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Reto de Campus \xB7 7 conversaciones", "description": "Cada semana, metas de 7 conversaciones por campus." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section grid md:grid-cols-2 gap-6"> <article class="card p-4"> <h1 class="h1">Reto semanal: 7 conversaciones</h1> <p class="text-sm text-gray-600">Ranking amable por campus. ¡Suma solo conversaciones reales! Esta semana empieza el <span id="weekStart"></span>.</p> <ul id="score" class="mt-4 divide-y divide-gray-200 dark:divide-gray-700"></ul> </article> <article class="card p-4"> <h2 class="font-semibold text-lg">Reportar (staff)</h2> <div class="grid gap-2"> <select id="campus" class="rounded border-gray-300 dark:border-gray-700"> <option>Medellín</option> <option>Bogotá</option> <option>Cali</option> <option>Otros</option> </select> <input id="amount" type="number" min="1" value="1" class="rounded border-gray-300 dark:border-gray-700"> <input id="code" type="password" placeholder="Código del campus" class="rounded border-gray-300 dark:border-gray-700"> <button id="btn" class="btn-primary">Sumar</button> <p class="text-xs text-gray-500">Solicita tu código privado al equipo central.</p> </div> </article> </section> ${renderScript($$result2, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/campus/reto/index.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/campus/reto/index.astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/campus/reto/index.astro";
const $$url = "/campus/reto";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
