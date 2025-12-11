/* empty css                                    */
import { d as createAstro, c as createComponent, a as renderTemplate, e as addAttribute, m as maybeRenderHead, r as renderComponent } from '../../chunks/astro/server_BHL5z7kF.mjs';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_31eN-IV8.mjs';
import 'clsx';
export { renderers } from '../../renderers.mjs';

const title = "Línea de oración en vivo";
const ctaText = "Entrar a YouTube";
const ctaUrl = "https://www.youtube.com/@ManaDevocional";
const cfg = {
  title,
  ctaText,
  ctaUrl,
};

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.ejemplo-ministeriomana.org");
const $$LivePrayerCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LivePrayerCard;
  const cspNonce = Astro2.locals?.cspNonce;
  return renderTemplate(_a || (_a = __template(["", '<div class="card p-4 flex flex-col sm:flex-row items-center justify-between gap-4"> <div> <h3 class="font-semibold text-lg">', '</h3> <p class="text-sm">Pr\xF3ximo: <span id="lp-when"></span></p> <p class="text-sm">Cuenta regresiva: <span id="lp-ctdwn"></span></p> </div> <a class="btn-primary"', ' target="_blank" rel="noreferrer">', "</a> </div> <script", ">\n  const start = new Date('${cfg.start}');\n  document.getElementById('lp-when').textContent = start.toLocaleString('es-CO');\n  function tick() {\n    const now = new Date();\n    let s = Math.max(0, Math.floor((start - now)/1000));\n    const h = Math.floor(s/3600); s -= h*3600;\n    const m = Math.floor(s/60); s -= m*60;\n    const t = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;\n    document.getElementById('lp-ctdwn').textContent = t;\n    requestAnimationFrame(()=>setTimeout(tick, 1000));\n  }\n  tick();\n<\/script>"], ["", '<div class="card p-4 flex flex-col sm:flex-row items-center justify-between gap-4"> <div> <h3 class="font-semibold text-lg">', '</h3> <p class="text-sm">Pr\xF3ximo: <span id="lp-when"></span></p> <p class="text-sm">Cuenta regresiva: <span id="lp-ctdwn"></span></p> </div> <a class="btn-primary"', ' target="_blank" rel="noreferrer">', "</a> </div> <script", ">\n  const start = new Date('\\${cfg.start}');\n  document.getElementById('lp-when').textContent = start.toLocaleString('es-CO');\n  function tick() {\n    const now = new Date();\n    let s = Math.max(0, Math.floor((start - now)/1000));\n    const h = Math.floor(s/3600); s -= h*3600;\n    const m = Math.floor(s/60); s -= m*60;\n    const t = \\`\\${h.toString().padStart(2,'0')}:\\${m.toString().padStart(2,'0')}:\\${s.toString().padStart(2,'0')}\\`;\n    document.getElementById('lp-ctdwn').textContent = t;\n    requestAnimationFrame(()=>setTimeout(tick, 1000));\n  }\n  tick();\n<\/script>"])), maybeRenderHead(), cfg.title, addAttribute(cfg.ctaUrl, "href"), cfg.ctaText, addAttribute(cspNonce, "nonce"));
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/components/LivePrayerCard.astro", void 0);

const $$Oracion = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "L\xEDnea de oraci\xF3n en vivo", "description": "Enlace y cuenta regresiva para la pr\xF3xima reuni\xF3n de oraci\xF3n." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section"> ${renderComponent($$result2, "LivePrayerCard", $$LivePrayerCard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/LivePrayerCard.astro", "client:component-export": "default" })} </section> ` })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/en-vivo/oracion.astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/en-vivo/oracion.astro";
const $$url = "/en-vivo/oracion";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Oracion,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
