import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CQGkXEdq.mjs';
import { manifest } from './manifest_Bl95shPk.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/campus/reto/add.astro.mjs');
const _page2 = () => import('./pages/api/campus/reto/score.astro.mjs');
const _page3 = () => import('./pages/api/evangeliza/add.astro.mjs');
const _page4 = () => import('./pages/api/evangeliza/aggregate.astro.mjs');
const _page5 = () => import('./pages/api/evangeliza/stats.astro.mjs');
const _page6 = () => import('./pages/api/evangeliza/submit.astro.mjs');
const _page7 = () => import('./pages/api/newsletter/subscribe.astro.mjs');
const _page8 = () => import('./pages/api/prayer/list.astro.mjs');
const _page9 = () => import('./pages/api/prayer/prayed.astro.mjs');
const _page10 = () => import('./pages/api/prayer/submit.astro.mjs');
const _page11 = () => import('./pages/api/stripe/checkout.astro.mjs');
const _page12 = () => import('./pages/api/stripe/webhook.astro.mjs');
const _page13 = () => import('./pages/api/turnstile/verify.astro.mjs');
const _page14 = () => import('./pages/api/wompi/checkout.astro.mjs');
const _page15 = () => import('./pages/api/wompi/webhook.astro.mjs');
const _page16 = () => import('./pages/biblia.astro.mjs');
const _page17 = () => import('./pages/campus/reto.astro.mjs');
const _page18 = () => import('./pages/campus/_slug_.astro.mjs');
const _page19 = () => import('./pages/campus.astro.mjs');
const _page20 = () => import('./pages/devocional.astro.mjs');
const _page21 = () => import('./pages/donaciones.astro.mjs');
const _page22 = () => import('./pages/en-vivo/oracion.astro.mjs');
const _page23 = () => import('./pages/evangeliza.astro.mjs');
const _page24 = () => import('./pages/eventos/_slug_.astro.mjs');
const _page25 = () => import('./pages/eventos.astro.mjs');
const _page26 = () => import('./pages/galeria.astro.mjs');
const _page27 = () => import('./pages/iglesias.astro.mjs');
const _page28 = () => import('./pages/ministerio.astro.mjs');
const _page29 = () => import('./pages/mujeres.astro.mjs');
const _page30 = () => import('./pages/noticias/rss.xml.astro.mjs');
const _page31 = () => import('./pages/noticias.astro.mjs');
const _page32 = () => import('./pages/noticias/_---slug_.astro.mjs');
const _page33 = () => import('./pages/oracion.astro.mjs');
const _page34 = () => import('./pages/peregrinaciones/quiz-7-iglesias.astro.mjs');
const _page35 = () => import('./pages/peregrinaciones.astro.mjs');
const _page36 = () => import('./pages/plan-lectura.astro.mjs');
const _page37 = () => import('./pages/rss.xml.astro.mjs');
const _page38 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/campus/reto/add.ts", _page1],
    ["src/pages/api/campus/reto/score.ts", _page2],
    ["src/pages/api/evangeliza/add.ts", _page3],
    ["src/pages/api/evangeliza/aggregate.ts", _page4],
    ["src/pages/api/evangeliza/stats.ts", _page5],
    ["src/pages/api/evangeliza/submit.ts", _page6],
    ["src/pages/api/newsletter/subscribe.ts", _page7],
    ["src/pages/api/prayer/list.ts", _page8],
    ["src/pages/api/prayer/prayed.ts", _page9],
    ["src/pages/api/prayer/submit.ts", _page10],
    ["src/pages/api/stripe/checkout.ts", _page11],
    ["src/pages/api/stripe/webhook.ts", _page12],
    ["src/pages/api/turnstile/verify.ts", _page13],
    ["src/pages/api/wompi/checkout.ts", _page14],
    ["src/pages/api/wompi/webhook.ts", _page15],
    ["src/pages/biblia/index.astro", _page16],
    ["src/pages/campus/reto/index.astro", _page17],
    ["src/pages/campus/[slug].astro", _page18],
    ["src/pages/campus/index.astro", _page19],
    ["src/pages/devocional/index.astro", _page20],
    ["src/pages/donaciones/index.astro", _page21],
    ["src/pages/en-vivo/oracion.astro", _page22],
    ["src/pages/evangeliza/index.astro", _page23],
    ["src/pages/eventos/[slug].astro", _page24],
    ["src/pages/eventos/index.astro", _page25],
    ["src/pages/galeria/index.astro", _page26],
    ["src/pages/iglesias/index.astro", _page27],
    ["src/pages/ministerio/index.astro", _page28],
    ["src/pages/mujeres/index.astro", _page29],
    ["src/pages/noticias/rss.xml.ts", _page30],
    ["src/pages/noticias/index.astro", _page31],
    ["src/pages/noticias/[...slug].astro", _page32],
    ["src/pages/oracion/index.astro", _page33],
    ["src/pages/peregrinaciones/quiz-7-iglesias.astro", _page34],
    ["src/pages/peregrinaciones/index.astro", _page35],
    ["src/pages/plan-lectura/index.astro", _page36],
    ["src/pages/rss.xml.ts", _page37],
    ["src/pages/index.astro", _page38]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "7c0d6cfd-69b5-413e-a93a-5ed21f82e2fa",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
