import { c as createComponent, m as maybeRenderHead, a as renderTemplate } from './astro/server_BHL5z7kF.mjs';
import 'clsx';

const $$PrayerWall = createComponent(($$result, $$props, $$slots) => {
  const prayers = [
    { name: "Ana", city: "Medell\xEDn", request: "Por salvaci\xF3n de mi familia" },
    { name: "Luis", city: "Bogot\xE1", request: "Por direcci\xF3n en el trabajo" },
    { name: "Mar\xEDa", city: "Miami", request: "Por sanidad y fortaleza" }
  ];
  return renderTemplate`${maybeRenderHead()}<section class="space-y-4"> <h2 class="h2">Muro de oración</h2> <p class="text-sm text-slate-600">
Ora por estas personas y marca cuando hayas orado. No mostramos apellidos ni datos sensibles.
</p> <div class="grid gap-4 md:grid-cols-2"> ${prayers.map((p) => renderTemplate`<article class="rounded-2xl border border-slate-100 bg-white p-4 space-y-2 shadow-sm"> <p class="font-semibold text-slate-900"> ${p.name} <span class="text-xs text-slate-500">(${p.city})</span> </p> <p class="text-sm text-slate-700">${p.request}</p> <button type="button" class="mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50" onclick="alert('Gracias por orar 🙏')">
Oré por esta persona
</button> </article>`)} </div> </section>`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/components/PrayerWall.astro", void 0);

export { $$PrayerWall as $ };
