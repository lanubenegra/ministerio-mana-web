/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BHL5z7kF.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_31eN-IV8.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Devocional Man\xE1 \u2014 con el Ps. Carlos R\xEDos", "description": "Devocional en YouTube de lunes a viernes con el Pastor Carlos R\xEDos." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container-tight py-10 grid gap-10 md:grid-cols-3"> <div class="md:col-span-2"> <h1 class="h1 mb-3">Devocional Maná de Hoy</h1> <div class="aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800"> <iframe class="w-full h-full" src="https://www.youtube.com/embed?listType=playlist&list=UUC85JrvTKq9dfCcgxQQU_Ag" title="Devocional Maná (últimos videos)" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe> </div> <div class="mt-4 grid gap-3 md:grid-cols-2"> <a class="btn-outline w-full normal-case" href="https://21retos.com" target="_blank" rel="noreferrer">21 Retos</a> <a class="btn-outline w-full normal-case" href="https://agendadevocionalmana.com" target="_blank" rel="noreferrer">Agenda Devocional</a> <a class="btn-outline w-full normal-case" href="https://open.spotify.com" target="_blank" rel="noreferrer">Escuchar en Spotify</a> <a class="btn-outline w-full normal-case" href="https://soundcloud.com" target="_blank" rel="noreferrer">Escuchar en SoundCloud</a> </div> </div> <aside class="space-y-4"> <div class="card p-4"> <h3 class="font-semibold">Apoya la misión</h3> <p class="text-sm text-gray-600">Tu donación nos ayuda a llegar a más personas con la Palabra.</p> <a href="/donaciones/" class="mt-3 btn-primary normal-case">Donar</a> </div> <div class="card p-4"> <h3 class="font-semibold">Contacto</h3> <ul class="text-sm"> <li><a href="mailto:carlosrios@ministeriomana.org">carlosrios@ministeriomana.org</a></li> </ul> </div> </aside> </section> ` })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/devocional/index.astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/devocional/index.astro";
const $$url = "/devocional";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
