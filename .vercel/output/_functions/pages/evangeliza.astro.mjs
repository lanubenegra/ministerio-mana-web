/* empty css                                 */
import { c as createComponent, a as renderTemplate, e as addAttribute, m as maybeRenderHead, r as renderComponent, b as renderScript } from '../chunks/astro/server_BHL5z7kF.mjs';
import { $ as $$BaseLayout, a as $$TurnstileWidget } from '../chunks/BaseLayout_31eN-IV8.mjs';
import 'clsx';
import { $ as $$PrayerWall } from '../chunks/PrayerWall_Dp4luJDg.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$EvangelizaHeatmap = createComponent(($$result, $$props, $$slots) => {
  const id = "evangeliza-map";
  const points = [
    { lat: 6.2442, lng: -75.5812, count: 18, label: "Medell\xEDn, CO" },
    { lat: 4.711, lng: -74.0721, count: 12, label: "Bogot\xE1, CO" },
    { lat: 3.4372, lng: -76.5225, count: 9, label: "Cali, CO" },
    { lat: 7.1254, lng: -73.1198, count: 4, label: "Bucaramanga, CO" },
    { lat: -0.1807, lng: -78.4678, count: 5, label: "Quito, EC" },
    { lat: 25.7617, lng: -80.1918, count: 3, label: "Miami, US" }
  ];
  JSON.stringify(points);
  return renderTemplate(_a || (_a = __template(['<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">', "<div", ` class="h-[420px] rounded-3xl overflow-hidden border border-slate-200"></div> <script>
  (() => {
    if (typeof window === 'undefined') return;
    import('leaflet').then(({ default: L }) => {
      const container = document.getElementById('evangeliza-map');
      if (!container) return;

      const map = L.map('evangeliza-map', {
        center: [6.2442, -75.5812],
        zoom: 5,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const points = JSON.parse(
        document.getElementById('evangeliza-map-data')?.textContent || '[]'
      );

      points.forEach((p) => {
        L.circleMarker([p.lat, p.lng], {
          radius: 6 + p.count / 2,
          color: '#1d4ed8',
          fillColor: '#1d4ed8',
          fillOpacity: 0.7,
        })
          .addTo(map)
          .bindPopup(\`\${p.label} \xB7 \${p.count} personas\`);
      });
    });
  })();
<\/script> <script type="application/json" id="evangeliza-map-data">
  {pointsJson}
<\/script>`], ['<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">', "<div", ` class="h-[420px] rounded-3xl overflow-hidden border border-slate-200"></div> <script>
  (() => {
    if (typeof window === 'undefined') return;
    import('leaflet').then(({ default: L }) => {
      const container = document.getElementById('evangeliza-map');
      if (!container) return;

      const map = L.map('evangeliza-map', {
        center: [6.2442, -75.5812],
        zoom: 5,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const points = JSON.parse(
        document.getElementById('evangeliza-map-data')?.textContent || '[]'
      );

      points.forEach((p) => {
        L.circleMarker([p.lat, p.lng], {
          radius: 6 + p.count / 2,
          color: '#1d4ed8',
          fillColor: '#1d4ed8',
          fillOpacity: 0.7,
        })
          .addTo(map)
          .bindPopup(\\\`\\\${p.label} \xB7 \\\${p.count} personas\\\`);
      });
    });
  })();
<\/script> <script type="application/json" id="evangeliza-map-data">
  {pointsJson}
<\/script>`])), maybeRenderHead(), addAttribute(id, "id"));
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/components/EvangelizaHeatmap.astro", void 0);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Evangeliza \xB7 Ministerio Man\xE1", "description": "Reto permanente de evangelizaci\xF3n: registra a qui\xE9n compartiste de Cristo y ora por su vida." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container-tight py-10 space-y-8"> <header class="space-y-3 max-w-3xl"> <p class="eyebrow">Evangeliza</p> <h1 class="h1">Compartimos a Jesús, contamos las historias</h1> <p class="lead">
Registra el nombre de la persona a quien compartiste de Cristo y únete al reto global de evangelización del Ministerio Maná.
</p> </header> <form id="evangeliza-form" class="space-y-4 max-w-xl"> <div> <label class="label" for="name">Nombre de la persona</label> <input id="name" name="firstName" type="text" required class="input" placeholder="Solo el primer nombre (ej. Carlos)"> </div> <div> <label class="label" for="city">Ciudad / país (opcional)</label> <input id="city" name="city" type="text" class="input" placeholder="Medellín, Colombia"> </div> ${renderComponent($$result2, "TurnstileWidget", $$TurnstileWidget, {})} <button type="submit" class="btn-primary w-full sm:w-auto">
Sumar evangelización
</button> <p class="text-xs text-slate-500">Solo usamos el primer nombre para orar y sumar en el mapa.</p> </form> <section class="space-y-4"> <h2 class="h2">Mapa de evangelización</h2> <p class="text-slate-600 text-sm">
Cada punto representa personas por las que estamos orando. Es una vista de fe, no un mapa exacto de datos personales.
</p> ${renderComponent($$result2, "EvangelizaHeatmap", $$EvangelizaHeatmap, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/EvangelizaHeatmap.astro", "client:component-export": "default" })} </section> <section class="mt-10 space-y-6"> <h2 class="h2">Ora con nosotros</h2> ${renderComponent($$result2, "PrayerWall", $$PrayerWall, {})} </section> </section> ${renderScript($$result2, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/evangeliza/index.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/evangeliza/index.astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/evangeliza/index.astro";
const $$url = "/evangeliza";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
