/* empty css                                 */
import { d as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_BHL5z7kF.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_31eN-IV8.mjs';
import { M as MISIONEROS } from '../chunks/misioneros_yfQVQuOP.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://www.ejemplo-ministeriomana.org");
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const geo = Astro2.locals?.geo ?? { country: "CO" };
  const isColombia = geo.country === "CO";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Campus Man\xE1 \u2014 Socios de la Gran Comisi\xF3n", "description": "Cambiamos el campus, cambiamos el mundo." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="relative"> <div class="container-tight py-12"> <h1 class="h1">Socios de la Gran Comisión</h1> <p class="lead max-w-3xl">Transforma palabras en acciones. Conviértete en socio de la misión en universidades de Colombia y Latinoamérica.</p> <div class="mt-6 flex gap-3 flex-wrap"> <a href="#como" class="btn-primary normal-case">¿Cómo ser parte?</a> <a href="#misioneros" class="btn-outline normal-case">Conocer a los misioneros</a> </div> </div> </section> <section id="misioneros" class="container-tight py-10"> <h2 class="h2 mb-2">Jóvenes misioneros</h2> <p class="text-sm text-gray-600 mb-6">Apoya mensualmente a uno de nuestros misioneros universitarios.</p> <div class="grid gap-6 md:grid-cols-2"> ${MISIONEROS.map((m) => renderTemplate`<article class="card p-5"> <h3 class="font-semibold text-lg">${m.nombre}</h3> <p class="text-sm text-gray-600">${m.rol}</p> <div class="aspect-video rounded-lg overflow-hidden border my-3">${m.video && renderTemplate`<iframe class="w-full h-full"${addAttribute(m.video, "src")}${addAttribute(m.nombre, "title")} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>`}</div> <div class="flex flex-wrap gap-3 items-start"> <a${addAttribute(isColombia ? m.wompiLink ?? "#" : m.stripePriceId ? "/donaciones/stripe?price=" + m.stripePriceId : "/donaciones/", "href")} class="btn-primary normal-case"> ${isColombia ? "Donar en Colombia" : "Donar internacional"} </a> <details class="text-sm"> <summary class="btn-outline normal-case cursor-pointer">Otras opciones</summary> <div class="mt-2 space-y-2"> <a${addAttribute(m.wompiLink ?? "#", "href")} class="block text-brand hover:underline">Donar vía Wompi (COP)</a> <a${addAttribute(m.stripePriceId ? "/donaciones/stripe?price=" + m.stripePriceId : "/donaciones/", "href")} class="block text-brand hover:underline">Donar vía Stripe (USD)</a> </div> </details> <a${addAttribute("/campus/" + m.slug + "/", "href")} class="btn-outline normal-case">Historia</a> </div> </article>`)} </div> </section> <section id="como" class="container-tight py-10"> <h2 class="h2 mb-4">Elige tu compromiso</h2> <div class="grid gap-6 md:grid-cols-3"> <div class="card p-6"><h3 class="font-semibold text-lg">1 Misión</h3><p>Conviértete en padrino de un misionero.</p><a href="#misioneros" class="mt-4 btn-primary normal-case">Apoyar</a></div> <div class="card p-6"><h3 class="font-semibold text-lg">2 Misiones</h3><p>Aumenta el impacto en dos campus.</p><a href="#misioneros" class="mt-4 btn-primary normal-case">Apoyar</a></div> <div class="card p-6"><h3 class="font-semibold text-lg">La Gran Comisión</h3><p>Defensor y compañero de nuestras 4 misiones.</p><a href="#misioneros" class="mt-4 btn-primary normal-case">Apoyar</a></div> </div> </section> ` })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/campus/index.astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/campus/index.astro";
const $$url = "/campus";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
