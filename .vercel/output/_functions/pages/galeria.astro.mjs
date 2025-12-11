/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_BHL5z7kF.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_31eN-IV8.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const PHOTOS = Array.from({ length: 12 }).map((_, i) => `https://picsum.photos/seed/mana${i}/1024/640`);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Galer\xEDa \u2014 Ministerio Man\xE1", "description": "Repositorio de fotos (demo)." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container-tight py-10"> <h1 class="h1 mb-3">Galería</h1> <p class="text-sm text-gray-600">Conecta un almacenamiento (R2/Supabase Storage) y lista los álbumes.</p> <div class="grid gap-4 md:grid-cols-3"> ${PHOTOS.map((src) => renderTemplate`<img${addAttribute(src, "src")} alt="" class="rounded-lg border border-gray-200 dark:border-gray-800" loading="lazy">`)} </div> </section> ` })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/galeria/index.astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/galeria/index.astro";
const $$url = "/galeria";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
