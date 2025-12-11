/* empty css                                 */
import { c as createComponent, a as renderTemplate, e as addAttribute, m as maybeRenderHead, r as renderComponent } from '../chunks/astro/server_BHL5z7kF.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_31eN-IV8.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$ChurchesMap = createComponent(($$result, $$props, $$slots) => {
  const id = "churches-map";
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", "<div", ' class="w-full h-[420px] md:h-[480px] rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden"></div> <noscript> <p class="mt-2 text-xs text-slate-500">\nEl mapa requiere JavaScript. Act\xEDvalo para ver las ubicaciones de las iglesias.\n</p> </noscript> <!-- Script bundlado por Vite: inicializa Leaflet --> <script type="module" src="/src/scripts/churches-map.ts"><\/script>'])), maybeRenderHead(), addAttribute(id, "id"));
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/components/ChurchesMap.astro", void 0);

const churchesData = [
	{
		city: "Medellín / Itagüí",
		name: "Iglesia Maná Ditaires",
		address: "Cra 64 #35-39, Ditaires, Itagüí",
		lat: 6.165,
		lng: -75.616,
		contact: {
			name: "Ernesto Lozano",
			email: "medellin@ministeriomana.org",
			phone: "+57 312 4226129"
		},
		whatsapp: "+573124226129",
		notes: ""
	},
	{
		city: "Medellín",
		name: "Iglesia Maná Belén",
		address: "Calle 30A #80-107",
		lat: 6.225,
		lng: -75.601,
		contact: {
			name: "Mónica Palacios",
			email: "medellin@ministeriomana.org",
			phone: "+57 300 5877370"
		},
		whatsapp: "+573005877370",
		notes: ""
	},
	{
		city: "Bogotá",
		name: "Iglesia Maná Modelia",
		address: "Calle 25 F # 74 B – 04, Barrio Modelia",
		lat: 4.67,
		lng: -74.124,
		contact: {
			name: "Jesús Antonio Reyes",
			email: "jesusantonio@ministeriomana.org",
			phone: "+57 318 4937659"
		},
		whatsapp: "+573184937659",
		notes: ""
	},
	{
		city: "Cali",
		name: "Iglesia Maná Cali",
		address: "Avenida Roosevelt #27-44, Segundo piso",
		lat: 3.431,
		lng: -76.535,
		contact: {
			name: "Julián Tabima",
			email: "cali@ministeriomana.org",
			phone: "+57 305 2232890"
		},
		whatsapp: "+573052232890",
		notes: ""
	},
	{
		city: "Armenia",
		name: "Iglesia Maná Armenia",
		address: "Carrera 17 # 1 N – 27, Barrio Nueva Cecilia",
		lat: 4.548,
		lng: -75.66,
		contact: {
			name: "Dagoberto Martínez",
			email: "escuelabiblica@ministeriomana.org",
			phone: "+57 315 2865175"
		},
		whatsapp: "+573152865175",
		notes: ""
	},
	{
		city: "La Unión (Valle)",
		name: "Iglesia Maná La Unión",
		address: "Calle 14 #16-44, Barrio La Cruz",
		lat: 4.537,
		lng: -76.103,
		contact: {
			name: "Victor Franco",
			email: "info@ministeriomana.org",
			phone: "+57 317 5918318"
		},
		whatsapp: "+573175918318",
		notes: ""
	},
	{
		city: "Tuluá",
		name: "Iglesia Maná Tuluá",
		address: "Calle 14 #3-82, Portal de San Felipe, Vía Tres Esquinas",
		lat: 4.09,
		lng: -76.201,
		contact: {
			name: "Alexander Valencia",
			email: "info@ministeriomana.org",
			phone: "+57 317 4655226"
		},
		whatsapp: "+573174655226",
		notes: ""
	},
	{
		city: "Buenaventura",
		name: "Iglesia Maná Buenaventura",
		address: "—",
		lat: 3.877,
		lng: -77.026,
		contact: {
			name: "Humberto Gutiérrez",
			email: "info@ministeriomana.org",
			phone: "+57 315 4833033"
		},
		whatsapp: "+573154833033",
		notes: ""
	},
	{
		city: "Bucaramanga",
		name: "Iglesia Maná Bucaramanga",
		address: "Cabecera Country Hotel. Calle 48 #34 – 29, Cabecera",
		lat: 7.115,
		lng: -73.116,
		contact: {
			name: "Adrián Gutiérrez",
			email: "iglesiabucaramanga@ministeriomana.org",
			phone: "+57 311 4733983"
		},
		whatsapp: "+573114733983",
		notes: ""
	},
	{
		city: "Marinilla",
		name: "Iglesia Maná Marinilla",
		address: "—",
		lat: 6.176,
		lng: -75.336,
		contact: {
			name: "Elizabeth Cano",
			email: "info@ministeriomana.org",
			phone: "+57 312 8472997"
		},
		whatsapp: "+573128472997",
		notes: ""
	},
	{
		city: "Ibagué",
		name: "Iglesia Maná Ibagué",
		address: "Carrera 7 A # 51-71, Barrio Rincón de Piedra Pintada",
		lat: 4.438,
		lng: -75.198,
		contact: {
			name: "Delfín Quiroz",
			email: "iglesiaibague@ministeriomana.org",
			phone: "+57 317 2852399"
		},
		whatsapp: "+573172852399",
		notes: ""
	},
	{
		city: "Cartago",
		name: "Iglesia Maná Cartago",
		address: "Calle 12 # 1N – 28, Salón de Eventos Emprender",
		lat: 4.746,
		lng: -75.911,
		contact: {
			name: "Edwin Grijalba",
			email: "cartago@ministeriomana.org",
			phone: "+57 316 4280558"
		},
		whatsapp: "+573164280558",
		notes: ""
	},
	{
		city: "Manizales",
		name: "Iglesia Maná Manizales",
		address: "Carrera 23 #67A-55 Apto 502B, Edificio Atalaya",
		lat: 5.07,
		lng: -75.515,
		contact: {
			name: "José Aristizabal",
			email: "info@ministeriomana.org",
			phone: "+57 311 7770660"
		},
		whatsapp: "+573117770660",
		notes: ""
	},
	{
		city: "Pasto",
		name: "Iglesia Maná Pasto",
		address: "—",
		lat: 1.214,
		lng: -77.28,
		contact: {
			name: "Hugo Gomez",
			email: "info@ministeriomana.org",
			phone: "+57 301 5582036"
		},
		whatsapp: "+573015582036",
		notes: ""
	}
];

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const churchesRaw = churchesData.map((c) => ({
    ...c,
    country: c.country ?? "Colombia"
  }));
  const churches = churchesRaw.sort((a, b) => (a.city || "").localeCompare(b.city || ""));
  const countries = Array.from(new Set(churches.map((c) => c.country))).sort();
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Iglesias \u2014 Planea tu visita", "description": "Encuentra la sede de Man\xE1 m\xE1s cercana y planea tu visita." }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<section class="section"> <h1 class="h1 mb-6">Iglesias \xB7 Planea tu visita</h1> <p class="mb-4">Mapa interactivo con nuestras sedes. Cada pin abre opciones de <em>C\xF3mo llegar</em> y contacto directo por WhatsApp.</p> ', ' <div class="mt-10 space-y-4"> <div class="flex flex-wrap gap-3 items-end"> <label class="flex-1 min-w-[220px]"> <span class="label text-xs font-semibold text-slate-600">Buscar ciudad o iglesia</span> <input id="churches-search" type="search" class="input" placeholder="Ej: Medell\xEDn, Bogot\xE1, Cali"> </label> <label class="w-full sm:w-[220px]"> <span class="label text-xs font-semibold text-slate-600">Pa\xEDs</span> <select id="churches-country" class="input"> <option value="">Todos</option> ', ' </select> </label> <div class="text-sm text-slate-500 pb-2 sm:pb-0"> <span id="churches-count">', '</span> sedes\n</div> </div> <div id="churches-grid" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"> ', " </div> </div> </section> <script>\n    (() => {\n      const searchInput = document.getElementById('churches-search');\n      const countrySelect = document.getElementById('churches-country');\n      const cards = Array.from(document.querySelectorAll('#churches-grid [data-city]')) as HTMLElement[];\n      const countEl = document.getElementById('churches-count');\n\n      function normalize(str: string) {\n        return str.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');\n      }\n\n      function filter() {\n        const term = normalize((searchInput as HTMLInputElement).value || '');\n        const country = (countrySelect as HTMLSelectElement).value;\n        let visible = 0;\n\n        cards.forEach((card) => {\n          const city = normalize(card.dataset.city || '');\n          const name = normalize(card.dataset.name || '');\n          const address = normalize(card.dataset.address || '');\n          const rowCountry = card.dataset.country || '';\n\n          const matchesText = !term || city.includes(term) || name.includes(term) || address.includes(term);\n          const matchesCountry = !country || rowCountry === country;\n          const show = matchesText && matchesCountry;\n          card.style.display = show ? '' : 'none';\n          if (show) visible += 1;\n        });\n\n        if (countEl) countEl.textContent = String(visible);\n      }\n\n      if (searchInput) searchInput.addEventListener('input', filter);\n      if (countrySelect) countrySelect.addEventListener('change', filter);\n    })();\n  <\/script> "], [" ", '<section class="section"> <h1 class="h1 mb-6">Iglesias \xB7 Planea tu visita</h1> <p class="mb-4">Mapa interactivo con nuestras sedes. Cada pin abre opciones de <em>C\xF3mo llegar</em> y contacto directo por WhatsApp.</p> ', ' <div class="mt-10 space-y-4"> <div class="flex flex-wrap gap-3 items-end"> <label class="flex-1 min-w-[220px]"> <span class="label text-xs font-semibold text-slate-600">Buscar ciudad o iglesia</span> <input id="churches-search" type="search" class="input" placeholder="Ej: Medell\xEDn, Bogot\xE1, Cali"> </label> <label class="w-full sm:w-[220px]"> <span class="label text-xs font-semibold text-slate-600">Pa\xEDs</span> <select id="churches-country" class="input"> <option value="">Todos</option> ', ' </select> </label> <div class="text-sm text-slate-500 pb-2 sm:pb-0"> <span id="churches-count">', '</span> sedes\n</div> </div> <div id="churches-grid" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"> ', " </div> </div> </section> <script>\n    (() => {\n      const searchInput = document.getElementById('churches-search');\n      const countrySelect = document.getElementById('churches-country');\n      const cards = Array.from(document.querySelectorAll('#churches-grid [data-city]')) as HTMLElement[];\n      const countEl = document.getElementById('churches-count');\n\n      function normalize(str: string) {\n        return str.toLowerCase().normalize('NFD').replace(/[\\\\u0300-\\\\u036f]/g, '');\n      }\n\n      function filter() {\n        const term = normalize((searchInput as HTMLInputElement).value || '');\n        const country = (countrySelect as HTMLSelectElement).value;\n        let visible = 0;\n\n        cards.forEach((card) => {\n          const city = normalize(card.dataset.city || '');\n          const name = normalize(card.dataset.name || '');\n          const address = normalize(card.dataset.address || '');\n          const rowCountry = card.dataset.country || '';\n\n          const matchesText = !term || city.includes(term) || name.includes(term) || address.includes(term);\n          const matchesCountry = !country || rowCountry === country;\n          const show = matchesText && matchesCountry;\n          card.style.display = show ? '' : 'none';\n          if (show) visible += 1;\n        });\n\n        if (countEl) countEl.textContent = String(visible);\n      }\n\n      if (searchInput) searchInput.addEventListener('input', filter);\n      if (countrySelect) countrySelect.addEventListener('change', filter);\n    })();\n  <\/script> "])), maybeRenderHead(), renderComponent($$result2, "ChurchesMap", $$ChurchesMap, {}), countries.map((country) => renderTemplate`<option${addAttribute(country, "value")}>${country}</option>`), churches.length, churches.map((c) => renderTemplate`<article class="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-2"${addAttribute(c.city, "data-city")}${addAttribute(c.country, "data-country")}${addAttribute(c.name, "data-name")}${addAttribute(c.address, "data-address")}> <p class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">${c.country}</p> <div> <p class="text-sm font-semibold text-slate-700">${c.city}</p> <h3 class="text-lg font-semibold text-slate-900">${c.name}</h3> </div> <p class="text-sm text-slate-600">${c.address ?? "Direcci\xF3n por confirmar"}</p> ${c.notes && renderTemplate`<p class="text-xs text-amber-700 bg-amber-50 rounded-full px-3 py-1 inline-block">${c.notes}</p>`} <div class="text-sm text-slate-700 space-y-1"> ${c.contact?.name && renderTemplate`<div>Contacto: <span class="font-semibold">${c.contact.name}</span></div>`} ${c.contact?.phone && renderTemplate`<div>Tel: <a class="text-sky-700 hover:underline"${addAttribute(`tel:${c.contact.phone}`, "href")}>${c.contact.phone}</a></div>`} ${c.whatsapp && renderTemplate`<div>WhatsApp: <a class="text-sky-700 hover:underline"${addAttribute(`https://wa.me/${c.whatsapp.replace(/[^\\d]/g, "")}`, "href")} target="_blank" rel="noopener noreferrer">${c.whatsapp}</a></div>`} ${c.contact?.email && renderTemplate`<div>Email: <a class="text-sky-700 hover:underline"${addAttribute(`mailto:${c.contact.email}`, "href")}>${c.contact.email}</a></div>`} </div> <div class="pt-2 flex flex-wrap gap-2"> ${c.whatsapp && renderTemplate`<a class="btn-primary btn-sm inline-flex items-center"${addAttribute(`https://wa.me/${c.whatsapp.replace(/[^\\d]/g, "")}`, "href")} target="_blank" rel="noopener noreferrer">
Escribir por WhatsApp
</a>`} ${typeof c.lat === "number" && typeof c.lng === "number" && renderTemplate`<a class="btn-outline btn-sm inline-flex items-center"${addAttribute(`https://www.google.com/maps?q=${c.lat},${c.lng}`, "href")} target="_blank" rel="noopener noreferrer">
Cómo llegar
</a>`} </div> </article>`)) })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/iglesias/index.astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/iglesias/index.astro";
const $$url = "/iglesias";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
