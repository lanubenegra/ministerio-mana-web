/* empty css                                    */
import { d as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_BHL5z7kF.mjs';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_31eN-IV8.mjs';
import { M as MISIONEROS } from '../../chunks/misioneros_yfQVQuOP.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://www.ejemplo-ministeriomana.org");
const $$slug = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const m = MISIONEROS.find((x) => x.slug === slug);
  if (!m) throw new Error("Misionero no encontrado");
  const geo = Astro2.locals?.geo ?? { country: "CO" };
  const isColombia = geo.country === "CO";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${m.nombre} \u2014 Campus Man\xE1`, "description": "Misionero Campus Man\xE1" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container-tight py-10 grid gap-6 md:grid-cols-3"> <article class="md:col-span-2 prose dark:prose-invert"> <h1>${m.nombre}</h1> <p>Conoce su testimonio y apóyalo en oración y con tu donación.</p> <div class="aspect-video rounded-lg overflow-hidden border my-3">${m.video && renderTemplate`<iframe class="w-full h-full"${addAttribute(m.video, "src")}${addAttribute(m.nombre, "title")} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>`}</div> </article> <aside class="space-y-3"> <a${addAttribute(isColombia ? m.wompiLink ?? "#" : m.stripePriceId ? "/donaciones/stripe?price=" + m.stripePriceId : "/donaciones/", "href")} class="btn-primary w-full justify-center normal-case"> ${isColombia ? "Donar en Colombia" : "Donar internacional"} </a> <details class="text-sm"> <summary class="btn-outline w-full justify-center normal-case cursor-pointer">Otras opciones</summary> <div class="mt-2 space-y-2"> <a${addAttribute(m.wompiLink ?? "#", "href")} class="block text-brand hover:underline">Donar vía Wompi (COP)</a> <a${addAttribute(m.stripePriceId ? "/donaciones/stripe?price=" + m.stripePriceId : "/donaciones/", "href")} class="block text-brand hover:underline">Donar vía Stripe (USD)</a> </div> </details> </aside> </section> ` })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/campus/[slug].astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/campus/[slug].astro";
const $$url = "/campus/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
