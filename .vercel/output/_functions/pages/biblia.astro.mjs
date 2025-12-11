/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BHL5z7kF.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_31eN-IV8.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Biblia y Plan de Lectura \xB7 Ministerio Man\xE1", "description": "Lee la Biblia (RVR1960) en l\xEDnea y sigue el plan de lectura b\xEDblica de Man\xE1." }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", `<section class="container-tight py-10 space-y-8"> <header class="space-y-3 max-w-3xl"> <p class="eyebrow">Biblia y lectura</p> <h1 class="h1">Biblia en l\xEDnea y plan de lectura</h1> <p class="lead">
Usa la Biblia en l\xEDnea (RVR1960) y el plan de lectura para acompa\xF1ar el Devocional Man\xE1,
        21 Retos y la Agenda Devocional.
</p> </header> <section class="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] items-start"> <div class="space-y-4"> <h2 class="h2 text-base">Abrir un pasaje</h2> <p class="text-sm text-slate-600">
Escribe una cita y haz clic en \u201CAbrir en la Biblia\u201D. Acepta abreviaturas como
<span class="font-mono">Jn 3:16</span>, <span class="font-mono">1 Pe 2:9</span>,
<span class="font-mono">Salmo 23</span>.
</p> <form id="bible-form" class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"> <input id="bible-ref" name="ref" type="text" placeholder="Ej. Juan 3:16" class="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm
                   focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"> <button type="submit" class="rounded-full bg-sky-600 text-white text-sm font-semibold px-5 py-2.5
                   hover:bg-sky-700 transition shadow-sm">
Abrir en la Biblia
</button> </form> <p class="text-xs text-slate-500">
Tambi\xE9n puedes hacer clic en citas b\xEDblicas dentro del sitio y se abrir\xE1n autom\xE1ticamente
          en el visor (por ejemplo:
<button type="button" class="underline text-sky-700" onclick="openBible('Filipenses 4:4-7')">Filipenses 4:4-7</button>).
</p> </div> <aside class="space-y-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"> <h2 class="h2 text-base">Plan de lectura sugerido</h2> <p class="text-sm text-slate-600">
Aqu\xED puedes ir armando el plan de lectura que conecte con el Devocional Man\xE1,
          21 Retos y la Agenda Devocional.
</p> <ul class="space-y-2 text-sm text-slate-700"> <li>\u{1F4D6} <strong>Lunes:</strong> Salmo 1 \xB7 Juan 1</li> <li>\u{1F4D6} <strong>Martes:</strong> Salmo 23 \xB7 Juan 3</li> <li>\u{1F4D6} <strong>Mi\xE9rcoles:</strong> Proverbios 3 \xB7 Romanos 8</li> <li>\u{1F4D6} <strong>Jueves:</strong> Juan 15 \xB7 Efesios 2</li> <li>\u{1F4D6} <strong>Viernes:</strong> Colosenses 3 \xB7 Filipenses 4</li> </ul> <p class="text-xs text-slate-500">
M\xE1s adelante podemos conectar este plan con las apps
<a class="underline" href="https://21retos.com" target="_blank" rel="noopener noreferrer">21Retos</a>
y
<a class="underline" href="https://agendadevocionalmana.com" target="_blank" rel="noopener noreferrer">Agenda Devocional Man\xE1</a>.
</p> </aside> </section> </section> <link rel="stylesheet" href="/bibles/bible-viewer.css"> <script defer src="/bibles/bible-viewer.js"><\/script> <script>
    if (typeof window !== 'undefined') {
      const form = document.getElementById('bible-form');
      if (form) {
        form.addEventListener('submit', (ev) => {
          ev.preventDefault();
          const input = document.getElementById('bible-ref') as HTMLInputElement | null;
          const value = (input?.value || 'Juan 3:16').trim();
          window.openBible?.(value || 'Juan 3:16');
        });
      }
      window.autoLinkScripture?.(document.body);
    }
  <\/script> `])), maybeRenderHead()) })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/biblia/index.astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/biblia/index.astro";
const $$url = "/biblia";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
