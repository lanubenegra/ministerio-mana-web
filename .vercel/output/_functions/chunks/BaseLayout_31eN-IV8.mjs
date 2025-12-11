import { d as createAstro, c as createComponent, e as addAttribute, a as renderTemplate, m as maybeRenderHead, r as renderComponent, ai as renderSlot, aj as renderHead } from './astro/server_BHL5z7kF.mjs';
import 'clsx';

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(cooked.slice()) }));
var _a$2;
const $$Astro$5 = createAstro("https://www.ejemplo-ministeriomana.org");
const $$SEO = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$SEO;
  const {
    title = "Ministerio Man\xE1",
    description = "Iglesias, devocionales y eventos para crecer en la fe.",
    image = "/og.jpg",
    type = "website",
    canonicalUrl,
    noindex = false,
    structuredData
  } = Astro2.props;
  const site = Astro2.site?.toString() ?? "";
  const pathname = Astro2.url.pathname;
  const url = canonicalUrl ?? (site ? new URL(pathname, site).toString() : pathname);
  const cspNonce = Astro2.locals?.cspNonce;
  return renderTemplate`<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><meta name="description"${addAttribute(description, "content")}>${noindex && renderTemplate`<meta name="robots" content="noindex, nofollow">`}<link rel="canonical"${addAttribute(url, "href")}><meta property="og:type"${addAttribute(type, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(image, "content")}><meta property="og:url"${addAttribute(url, "content")}><meta property="og:site_name" content="Ministerio Maná"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><meta name="twitter:image"${addAttribute(image, "content")}>${structuredData && renderTemplate(_a$2 || (_a$2 = __template$2(['<script type="application/ld+json"', ">{JSON.stringify(structuredData)}<\/script>"])), addAttribute(cspNonce, "nonce"))}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/components/SEO.astro", void 0);

const messages = {
  es: {
    nav_home: "Inicio",
    nav_ministry: "Ministerio",
    nav_campus: "Campus Maná",
    nav_school: "Escuela Bíblica",
    nav_churches: "Iglesias",
    nav_events: "Eventos",
    nav_devotional: "Devocional",
    nav_women: "Mujeres",
    nav_pilgrims: "Peregrinaciones",
    nav_donate: "Donar",
    donate: "Donar",
    see_more: "Ver más"
  },
  en: {
    nav_home: "Home",
    nav_ministry: "Ministry",
    nav_campus: "Campus Maná",
    nav_school: "Bible School",
    nav_churches: "Churches",
    nav_events: "Events",
    nav_devotional: "Devotional",
    nav_women: "Women",
    nav_pilgrims: "Pilgrimages",
    nav_donate: "Donate",
    donate: "Donate",
    see_more: "See more"
  }
};
function t(locale, key, fallback) {
  return messages[locale]?.[key] ?? fallback ?? key;
}

const $$Astro$4 = createAstro("https://www.ejemplo-ministeriomana.org");
const $$LangSwitch = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$LangSwitch;
  const current = Astro2.cookies.get("lang")?.value ?? "es";
  const next = current === "es" ? "en" : "es";
  function setLang(l) {
    document.cookie = `lang=${l};path=/;max-age=${60 * 60 * 24 * 365}`;
    location.reload();
  }
  return renderTemplate`${maybeRenderHead()}<button class="btn-outline btn-sm"${addAttribute(`(${setLang.toString()})('${next}')`, "onclick")}>${next.toUpperCase()}</button>`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/components/LangSwitch.astro", void 0);

const $$Astro$3 = createAstro("https://www.ejemplo-ministeriomana.org");
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Header;
  const locale = Astro2.cookies.get("lang")?.value ?? "es";
  return renderTemplate`${maybeRenderHead()}<header class="sticky top-0 z-40 border-b border-[var(--mana-border)] bg-[var(--mana-surface)]/95 backdrop-blur"> <div class="container-tight flex items-center justify-between gap-6 py-4"> <a href="/" class="group inline-flex items-center gap-3"> <span class="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--mana-border)] bg-[var(--mana-surface)] shadow-brandInset transition-all duration-200 group-hover:border-brand-medium group-hover:shadow-brand"> <img src="/logo.svg" alt="Ministerio Maná" class="h-7 w-auto"> </span> <div class="hidden sm:flex flex-col leading-tight"> <span class="text-xs font-display font-semibold uppercase tracking-[0.12em] text-neutral-500">Ministerio</span> <span class="text-base font-display font-bold text-brand-dark group-hover:text-brand-medium transition-colors">Maná</span> </div> </a> <nav class="hidden lg:flex items-center gap-6"> <a href="/" class="nav-link">${t(locale, "nav_home")}</a> <a href="/ministerio/" class="nav-link">${t(locale, "nav_ministry")}</a> <a href="/campus/" class="nav-link">${t(locale, "nav_campus")}</a> <a href="/escuela-biblica/" class="nav-link">${t(locale, "nav_school")}</a> <a href="/iglesias/" class="nav-link">${t(locale, "nav_churches")}</a> <a href="/eventos/" class="nav-link">${t(locale, "nav_events")}</a> <a href="/devocional/" class="nav-link">${t(locale, "nav_devotional")}</a> <a href="/mujeres/" class="nav-link">${t(locale, "nav_women")}</a> <a href="/peregrinaciones/" class="nav-link">${t(locale, "nav_pilgrims")}</a> </nav> <div class="flex items-center gap-3"> <a href="/donaciones/" class="hidden lg:inline-flex btn-primary">${t(locale, "nav_donate")}</a> ${renderComponent($$result, "LangSwitch", $$LangSwitch, {})} <details class="relative lg:hidden"> <summary class="btn-outline btn-sm cursor-pointer select-none">Menú</summary> <div class="absolute right-0 mt-3 w-64 rounded-3xl border border-[var(--mana-border-strong)] bg-[var(--mana-surface)] p-4 shadow-lg"> <div class="flex flex-col gap-3"> <a href="/" class="nav-link">${t(locale, "nav_home")}</a> <a href="/ministerio/" class="nav-link">${t(locale, "nav_ministry")}</a> <a href="/campus/" class="nav-link">${t(locale, "nav_campus")}</a> <a href="/escuela-biblica/" class="nav-link">${t(locale, "nav_school")}</a> <a href="/iglesias/" class="nav-link">${t(locale, "nav_churches")}</a> <a href="/eventos/" class="nav-link">${t(locale, "nav_events")}</a> <a href="/devocional/" class="nav-link">${t(locale, "nav_devotional")}</a> <a href="/mujeres/" class="nav-link">${t(locale, "nav_women")}</a> <a href="/peregrinaciones/" class="nav-link">${t(locale, "nav_pilgrims")}</a> <a href="/donaciones/" class="btn-primary justify-center text-xs">${t(locale, "nav_donate")}</a> </div> </div> </details> </div> </div> </header>`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/components/Header.astro", void 0);

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://www.ejemplo-ministeriomana.org", "SSR": true};
const $$Astro$2 = createAstro("https://www.ejemplo-ministeriomana.org");
const $$TurnstileWidget = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$TurnstileWidget;
  const { appearance = "always", theme = "auto", id } = Astro2.props;
  const siteKey = Astro2.locals?.turnstile?.siteKey ?? Object.assign(__vite_import_meta_env__, { _: process.env._ })?.TURNSTILE_SITE_KEY ?? process.env?.TURNSTILE_SITE_KEY;
  return renderTemplate`${siteKey && renderTemplate`${maybeRenderHead()}<div${addAttribute(id, "id")} class="cf-turnstile mt-3"${addAttribute(siteKey, "data-sitekey")}${addAttribute(appearance, "data-appearance")}${addAttribute(theme, "data-theme")}></div>`}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/components/TurnstileWidget.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Astro$1 = createAstro("https://www.ejemplo-ministeriomana.org");
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Footer;
  const cspNonce = Astro2.locals?.cspNonce;
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<footer class="mt-24 bg-[var(--mana-surface)]"> <div class="border-t border-[var(--mana-border)] bg-accent/20"> <div class="container-tight flex flex-col gap-4 py-8 text-center md:flex-row md:items-center md:justify-between md:text-left"> <div> <p class="text-xs font-display uppercase tracking-[0.16em] text-neutral-500">Suscr\xEDbete al devocional</p> <h2 class="mt-1 text-lg font-display font-bold text-brand-dark">Recibe historias y noticias cada semana</h2> </div> <form id="newsletter-form" class="flex flex-col gap-3 md:flex-row md:items-center" method="post" action="/api/newsletter/subscribe"> <input type="email" name="email" placeholder="Tu email" class="w-full rounded-full border border-[var(--mana-border-strong)] bg-white px-5 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-brand-medium focus:outline-none focus:ring-2 focus:ring-brand-medium/30 md:w-72" required> ', ' <button class="btn-primary justify-center md:px-8">Recibir devocional</button> </form> </div> </div> <div class="container-tight grid gap-10 py-12 md:grid-cols-4"> <div class="space-y-4"> <div class="inline-flex items-center gap-3"> <img src="/logo.svg" alt="Ministerio Man\xE1" class="h-8 w-auto"> <span class="text-sm font-display font-semibold text-brand-dark">Ministerio Man\xE1</span> </div> <p class="text-sm text-neutral-500">Compartimos recursos, comunidad y acompa\xF1amiento para crecer en la fe y llevar esperanza a donde hace falta.</p> <div class="flex flex-wrap gap-2"> <span class="pill">Fe activa</span> <span class="pill">Comunidad</span> <span class="pill">Servicio</span> </div> </div> <div> <h3 class="text-sm font-display font-semibold text-brand-dark">Explora</h3> <ul class="mt-3 space-y-2 text-sm text-neutral-600"> <li><a href="/ministerio/" class="hover:text-brand-medium">Ministerio</a></li> <li><a href="/campus/" class="hover:text-brand-medium">Campus Man\xE1</a></li> <li><a href="/escuela-biblica/" class="hover:text-brand-medium">Escuela B\xEDblica</a></li> <li><a href="/iglesias/" class="hover:text-brand-medium">Iglesias</a></li> <li><a href="/eventos/" class="hover:text-brand-medium">Eventos</a></li> <li><a href="/devocional/" class="hover:text-brand-medium">Devocional</a></li> <li><a href="/mujeres/" class="hover:text-brand-medium">Mujeres</a></li> <li><a href="/peregrinaciones/" class="hover:text-brand-medium">Peregrinaciones</a></li> <li><a href="/donaciones/" class="hover:text-brand-medium">Donaciones</a></li> </ul> </div> <div> <h3 class="text-sm font-display font-semibold text-brand-dark">Contacto</h3> <ul class="mt-3 space-y-2 text-sm text-neutral-600"> <li><a class="hover:text-brand-medium" href="mailto:info@ministeriomana.org">info@ministeriomana.org</a></li> <li><a class="hover:text-brand-medium" href="mailto:media@ministeriomana.org">media@ministeriomana.org</a></li> <li><a class="hover:text-brand-medium" href="mailto:mujeres@ministeriomana.org">mujeres@ministeriomana.org</a></li> <li><a class="hover:text-brand-medium" href="mailto:campusuniversitario@ministeriomana.org">campusuniversitario@ministeriomana.org</a></li> </ul> </div> <div class="space-y-4"> <h3 class="text-sm font-display font-semibold text-brand-dark">Vis\xEDtanos</h3> <p class="text-sm text-neutral-500">Descubre pr\xF3ximas reuniones, grupos y eventos para conectar con la comunidad Man\xE1.</p> <a href="/eventos/" class="btn-outline justify-center">Agenda de eventos</a> </div> </div> <div class="border-t border-[var(--mana-border)] py-6 text-center text-xs text-neutral-500">\n\xA9 ', " Ministerio Man\xE1 \xB7 Todos los derechos reservados.\n</div> </footer> <script", ">\n  const form = document.getElementById('newsletter-form');\n  if (form) {\n    form.addEventListener('submit', async (event) => {\n      event.preventDefault();\n      const fd = new FormData(form);\n      try {\n        const res = await fetch(form.action, {\n          method: 'POST',\n          body: fd,\n        });\n        const json = await res.json();\n        if (json?.ok) {\n          form.reset();\n          if (window.turnstile && typeof window.turnstile.reset === 'function') {\n            window.turnstile.reset();\n          }\n          alert('\xA1Gracias! Revisa tu correo para confirmar la suscripci\xF3n.');\n        } else {\n          alert(json?.error || 'No pudimos procesar tu suscripci\xF3n. Intenta de nuevo.');\n        }\n      } catch (err) {\n        alert('Error de red. Intenta nuevamente.');\n      }\n    });\n  }\n<\/script>"])), maybeRenderHead(), renderComponent($$result, "TurnstileWidget", $$TurnstileWidget, { "appearance": "interaction-only" }), (/* @__PURE__ */ new Date()).getFullYear(), addAttribute(cspNonce, "nonce"));
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/components/Footer.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.ejemplo-ministeriomana.org");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title, description, image, type = "website", structuredData, noindex = false } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="es" class="scroll-smooth"> <head>', '<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/src/styles/global.css"><!-- Turnstile: script global (NO inline) --><script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer><\/script>', "</head> <body> ", ' <main class="min-h-[60vh]">', "</main> ", " </body></html>"])), renderComponent($$result, "SEO", $$SEO, { "title": title, "description": description, "image": image, "type": type, "structuredData": structuredData, "noindex": noindex }), renderHead(), renderComponent($$result, "Header", $$Header, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}));
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $, $$TurnstileWidget as a };
