import { d as createAstro, c as createComponent, m as maybeRenderHead, e as addAttribute, a as renderTemplate } from './astro/server_BHL5z7kF.mjs';
import 'clsx';

const $$Astro = createAstro("https://www.ejemplo-ministeriomana.org");
const $$EventCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$EventCard;
  const { event } = Astro2.props;
  const d = event.data;
  const eventDate = new Date(d.date);
  return renderTemplate`${maybeRenderHead()}<article class="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden"> ${d.heroImage && renderTemplate`<img${addAttribute(d.heroImage, "src")} alt="" class="h-44 w-full object-cover">`} <div class="p-4 space-y-2"> <h3 class="font-semibold text-lg"><a${addAttribute("/eventos/" + event.slug + "/", "href")} class="hover:underline">${d.title}</a></h3> <p class="text-sm text-gray-600 dark:text-gray-300"> ${eventDate.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
• ${d.location} </p> ${d.summary && renderTemplate`<p class="text-sm text-gray-700 dark:text-gray-200">${d.summary}</p>`} <div class="pt-2"><a${addAttribute("/eventos/" + event.slug + "/", "href")} class="text-sm font-semibold text-brand hover:underline">Ver detalle</a></div> </div> </article>`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/components/EventCard.astro", void 0);

export { $$EventCard as $ };
