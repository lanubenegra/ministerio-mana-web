/* empty css                                 */
import { d as createAstro, c as createComponent, m as maybeRenderHead, e as addAttribute, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_BHL5z7kF.mjs';
import { a as $$TurnstileWidget, $ as $$BaseLayout } from '../chunks/BaseLayout_31eN-IV8.mjs';
import { g as getFxSnapshot } from '../chunks/fx_CIuljFs3.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro("https://www.ejemplo-ministeriomana.org");
const $$DonationGateway = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DonationGateway;
  const { preferred = "wompi", country = "CO", rates } = Astro2.props;
  const isWompi = preferred === "wompi";
  const copPerUsd = rates && (rates.COP ?? rates?.rates?.COP) || null;
  return renderTemplate`${maybeRenderHead()}<section class="container-tight py-10 space-y-6"> <header class="space-y-2"> <p class="text-sm uppercase tracking-[0.2em] text-sky-600">
Donaciones seguras
</p> <h1 class="h1">Pagos y donaciones</h1> <p class="text-base text-slate-600 max-w-3xl">
Todo nuestro lenguaje es donaciones: das con generosidad y recibes los
      recursos (libros, agenda, inscripciones) como agradecimiento.
</p> ${country && renderTemplate`<p class="text-xs text-slate-500 mt-2">
Detectamos que te encuentras en <span class="font-semibold">${country}</span>. Te
        sugerimos esta opción:
</p>`} ${copPerUsd && renderTemplate`<p class="text-xs text-slate-400 mt-1">
Referencia de cambio: <span class="font-mono">1 USD ≈ ${copPerUsd.toLocaleString("es-CO")} COP</span>
(solo informativo, la tasa final la define la pasarela).
</p>`} </header> <div class="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6"> <!-- Radios invisibles para cambiar de pasarela sin JS --> <input type="radio" id="gw-wompi" name="gateway" class="peer/gw-wompi hidden"${addAttribute(isWompi, "checked")}> <input type="radio" id="gw-stripe" name="gateway" class="peer/gw-stripe hidden"${addAttribute(!isWompi, "checked")}> <!-- Tabs --> <div class="flex flex-wrap gap-2"> <label for="gw-wompi" class="cursor-pointer px-4 py-1.5 text-sm rounded-full border
               peer-checked/gw-wompi:bg-sky-600 peer-checked/gw-wompi:text-white
               peer-checked/gw-wompi:border-sky-600 border-slate-200 text-slate-700">
Pagos en Colombia (COP)
</label> <label for="gw-stripe" class="cursor-pointer px-4 py-1.5 text-sm rounded-full border
               peer-checked/gw-stripe:bg-indigo-600 peer-checked/gw-stripe:text-white
               peer-checked/gw-stripe:border-indigo-600 border-slate-200 text-slate-700">
Pagos internacionales (USD)
</label> </div> <!-- Paneles --> <div class="space-y-6"> <!-- Panel Wompi --> <div class="gw-panel gw-panel-wompi"> <p class="text-xs font-medium text-sky-600 mb-1">Recomendado</p> <p class="font-semibold text-slate-900">
Pagos en Colombia (COP)
</p> <p class="text-sm text-slate-600 mb-4">
Procesado con Wompi para cuentas bancarias colombianas.
</p> <form method="POST" action="/api/wompi/checkout" class="space-y-4"> <div> <label class="block text-sm font-medium text-slate-700 mb-1">
Valor (COP) – ingresa tu donación en pesos colombianos
</label> <input type="number" name="amount" min="1000" step="1000" required placeholder="Ej. 50000" class="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"> </div> <div> <label class="block text-sm font-medium text-slate-700 mb-1">
Descripción
</label> <input type="text" name="description" placeholder="Donación general, Devocional, Campus, etc." class="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"> </div> <!-- Campos ocultos básicos --> <input type="hidden" name="currency" value="COP"> <input type="hidden" name="source" value="donaciones-wompi"> <!-- Turnstile (aparecerá cuando haya llave configurada) --> ${renderComponent($$result, "TurnstileWidget", $$TurnstileWidget, { "appearance": "always", "theme": "auto" })} <button type="submit" class="mt-4 inline-flex w-full items-center justify-center rounded-full
                   bg-gradient-to-r from-sky-600 via-indigo-600 to-pink-500
                   px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20
                   hover:brightness-105 transition">
Donar con Wompi
</button> <p class="mt-2 text-[11px] text-slate-400">
Tu pago se procesa en la pasarela segura de Wompi. No almacenamos datos de tarjeta.
</p> </form> </div> <!-- Panel Stripe --> <div class="gw-panel gw-panel-stripe"> <p class="font-semibold text-slate-900">
Pagos internacionales (USD)
</p> <p class="text-sm text-slate-600 mb-4">
Procesado con Stripe para donaciones desde el exterior.
</p> <form method="POST" action="/api/stripe/checkout" class="space-y-4"> <div> <label class="block text-sm font-medium text-slate-700 mb-1">
Monto (USD)
</label> <input type="number" name="amount" min="5" step="1" required placeholder="Ej. 50" class="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"> </div> <div> <label class="block text-sm font-medium text-slate-700 mb-1">
Propósito de la donación
</label> <input type="text" name="description" placeholder="Devocional Maná, Campus Maná, Mujeres que creen..." class="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"> </div> <!-- Campos ocultos básicos --> <input type="hidden" name="currency" value="USD"> <input type="hidden" name="source" value="donaciones-stripe"> <!-- Turnstile --> ${renderComponent($$result, "TurnstileWidget", $$TurnstileWidget, { "appearance": "always", "theme": "auto" })} <button type="submit" class="mt-4 inline-flex w-full items-center justify-center rounded-full
                   bg-gradient-to-r from-indigo-600 via-sky-600 to-teal-500
                   px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20
                   hover:brightness-105 transition">
Donar con tarjeta internacional
</button> <p class="mt-2 text-[11px] text-slate-400">
Stripe procesa tu donación de forma segura. Nosotros sólo recibimos la confirmación.
</p> </form> </div> </div> </div> <p class="text-xs text-slate-500 max-w-3xl">
Emitimos reportes y exportaciones (CSV/Excel) para contabilidad y DIAN; pedimos número de
    identificación según país. Las donaciones desde el exterior se registran con los datos que
    ingresas en Stripe.
</p> </section> <style>
  /* Mostrar/ocultar paneles según el radio seleccionado sin usar JS */
  .gw-panel {
    display: none;
  }

  #gw-wompi:checked ~ .space-y-6 .gw-panel-wompi {
    display: block;
  }
  #gw-stripe:checked ~ .space-y-6 .gw-panel-stripe {
    display: block;
  }

  /* Fallback: si por lo que sea no se aplica el selector, mostramos siempre ambos stacked */
  @supports not (#gw-wompi:checked ~ .space-y-6 .gw-panel-wompi) {
    .gw-panel {
      display: block;
    }
  }
</style>`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/components/DonationGateway.astro", void 0);

const $$Astro = createAstro("https://www.ejemplo-ministeriomana.org");
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const geo = Astro2.locals?.geo ?? { country: "CO"};
  const rates = await getFxSnapshot();
  const preferred = geo.country === "CO" ? "wompi" : "stripe";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Donaciones \u2014 Ministerio Man\xE1", "description": "Dona para expandir la misi\xF3n." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container-tight py-10"> <h1 class="h1">Donaciones</h1> <p class="lead mt-2 max-w-3xl">Todo nuestro lenguaje es donaciones: das con generosidad y recibes los recursos (libros, agenda, inscripciones) como agradecimiento.</p> <div class="mt-8"> ${renderComponent($$result2, "DonationGateway", $$DonationGateway, { "preferred": preferred, "rates": rates, "country": geo.country })} </div> <p class="text-xs text-gray-500 mt-6">Emitimos reportes y exportaciones (CSV/Excel) para contabilidad y DIAN; pedimos número de identificación según país.</p> </section> ` })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/donaciones/index.astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/donaciones/index.astro";
const $$url = "/donaciones";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
