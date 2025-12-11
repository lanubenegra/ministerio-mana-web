/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BHL5z7kF.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_31eN-IV8.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Sobre el Ministerio \u2014 Ministerio Man\xE1", "description": "Conoce visi\xF3n, misi\xF3n, valores y pr\xF3ximos pasos para conectarte." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container-tight py-10 prose dark:prose-invert"> <h1>Sobre el Ministerio</h1> <p>Nuestra misión es compartir el Pan de Vida en cada casa y nación.</p> </section> ` })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/ministerio/index.astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/ministerio/index.astro";
const $$url = "/ministerio";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
