/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BHL5z7kF.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_31eN-IV8.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Mujeres que creen", "description": "Formaci\xF3n, eventos y mentor\xEDa para mujeres." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section"> <h1 class="h1 mb-4">Mujeres que creen</h1> <p class="max-w-3xl">Conoce el camino por el que nos ha llevado Jesús y lo fiel que Él ha sido. Nuestro propósito: modelar una feminidad piadosa (Tito 2:1–5), servir con misericordia (Mt 25:34–40), discipular a otras (Mt 28:18–20), enseñar sana doctrina (2 Ti 4:2–4), vivir en unidad generosa (Hch 2:46–47) y practicar el bien (Gá 6:10).</p> <div class="mt-8 grid md:grid-cols-2 gap-6"> <article class="card p-4"> <h2 class="font-semibold text-lg">Línea de tiempo</h2> <ul class="text-sm leading-6"> <li><strong>2020</strong> · Nace el ministerio durante la pandemia.</li> <li><strong>2021</strong> · Lectura de “Cautivante” y encuentros.</li> <li><strong>2022</strong> · Evento anual: <em>Encuentros con Jesús</em>.</li> <li><strong>2023</strong> · <em>La mujer y su significado</em>. Inician retiros en EE.UU., Colombia y otros países.</li> <li><strong>2024</strong> · Cartillas discipulares y expansión: <em>Creadas para cautivar</em>.</li> <li><strong>2025</strong> · Nuevo evento: <em>Adornadas por el Evangelio</em>.</li> </ul> </article> <article class="card p-4"> <h2 class="font-semibold text-lg">Podcast & YouTube</h2> <p class="text-sm mb-2">Programa semanal: enseñanza bíblica y conversación honesta.</p> <div class="flex gap-2 flex-wrap"> <a class="btn-outline" href="https://www.youtube.com/@mujeresquecreen" target="_blank">YouTube</a> <a class="btn-outline" href="https://open.spotify.com" target="_blank">Spotify</a> <a class="btn-primary" href="mailto:mujeres@ministeriomana.org">Quiero una mentora</a> </div> </article> </div> <div class="mt-8 card p-4"> <h2 class="font-semibold text-lg">Próximo evento: Adornadas por el Evangelio</h2> <p>Redescubre tu diseño divino. Enseñanza bíblica, oración, comunión y restauración.</p> <div class="mt-3"><a class="btn-primary" href="mailto:mujeres@ministeriomana.org">Solicitar información</a></div> </div> </section> ` })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/mujeres/index.astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/mujeres/index.astro";
const $$url = "/mujeres";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
