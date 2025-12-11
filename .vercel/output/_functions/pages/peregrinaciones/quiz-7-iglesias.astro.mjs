/* empty css                                    */
import { d as createAstro, c as createComponent, a as renderTemplate, r as renderComponent, m as maybeRenderHead } from '../../chunks/astro/server_BHL5z7kF.mjs';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_31eN-IV8.mjs';
import 'clsx';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.ejemplo-ministeriomana.org");
const $$MiniQuiz = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MiniQuiz;
  return renderTemplate(_a || (_a = __template([`const id = 'quiz-' + Math.random().toString(36).slice(2);
const title = Astro.props.title || 'Mini\u2011quiz'
<div id={id} class="card p-4">
  <h3 class="font-semibold text-lg mb-2">{title}</h3>
  <ol class="list-decimal ml-5 space-y-3">
    {questions.map((q, qi) => (
      <li>
        <div class="font-medium">{q.q}</div>
        <div class="mt-2 grid gap-2">
          {q.options.map((opt, oi) => (
            <label class="inline-flex items-center gap-2">
              <input type="radio" name={\`q\${qi}\`} value={oi} />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </li>
    ))}
  </ol>
  <div class="mt-4 flex gap-2">
    <button class="btn-primary" on:click={() => check()}>Revisar</button>
    <button class="btn-outline" on:click={() => share()}>Compartir</button>
  </div>
  <p id="res" class="text-sm mt-2"></p>
</div>

<script nonce={cspNonce}>
  const ans = (Astro.props.questions || []).map(q => q.a);
  function check() {
    const root = document.getElementById('\${id}');
    const inputs = root.querySelectorAll('input[type=radio]:checked');
    let score = 0;
    inputs.forEach((i, idx) => { if (Number(i.value) === ans[idx]) score++; });
    root.querySelector('#res').textContent = \`Tu puntaje: \${score}/\${ans.length}\`;
  }
  async function share() {
    const text = document.title + ' \u2014 \xA1Hice el mini\u2011quiz en Ministeriomana.org!';
    try { await navigator.clipboard.writeText(text); alert('Texto copiado, p\xE9galo para compartir.'); } catch {}
  }
<\/script>`], [`const id = 'quiz-' + Math.random().toString(36).slice(2);
const title = Astro.props.title || 'Mini\u2011quiz'
<div id={id} class="card p-4">
  <h3 class="font-semibold text-lg mb-2">{title}</h3>
  <ol class="list-decimal ml-5 space-y-3">
    {questions.map((q, qi) => (
      <li>
        <div class="font-medium">{q.q}</div>
        <div class="mt-2 grid gap-2">
          {q.options.map((opt, oi) => (
            <label class="inline-flex items-center gap-2">
              <input type="radio" name={\\\`q\\\${qi}\\\`} value={oi} />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </li>
    ))}
  </ol>
  <div class="mt-4 flex gap-2">
    <button class="btn-primary" on:click={() => check()}>Revisar</button>
    <button class="btn-outline" on:click={() => share()}>Compartir</button>
  </div>
  <p id="res" class="text-sm mt-2"></p>
</div>

<script nonce={cspNonce}>
  const ans = (Astro.props.questions || []).map(q => q.a);
  function check() {
    const root = document.getElementById('\\\${id}');
    const inputs = root.querySelectorAll('input[type=radio]:checked');
    let score = 0;
    inputs.forEach((i, idx) => { if (Number(i.value) === ans[idx]) score++; });
    root.querySelector('#res').textContent = \\\`Tu puntaje: \\\${score}/\\\${ans.length}\\\`;
  }
  async function share() {
    const text = document.title + ' \u2014 \xA1Hice el mini\u2011quiz en Ministeriomana.org!';
    try { await navigator.clipboard.writeText(text); alert('Texto copiado, p\xE9galo para compartir.'); } catch {}
  }
<\/script>`])));
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/components/MiniQuiz.astro", void 0);

const $$Quiz7Iglesias = createComponent(($$result, $$props, $$slots) => {
  const qs = [
    { q: "\xBFCu\xE1les son las siete iglesias del Apocalipsis?", options: ["\xC9feso, Esmirna, P\xE9rgamo, Tiatira, Sardes, Filadelfia, Laodicea", "Roma, Antioqu\xEDa, Jerusal\xE9n, Corinto, Tesal\xF3nica, \xC9feso, Esmirna"], a: 0 },
    { q: "\xBFEn qu\xE9 isla escribi\xF3 Juan el Apocalipsis?", options: ["Malta", "Patmos", "Chipre"], a: 1 },
    { q: "En Capadocia se puede dormir en:", options: ["Barcos", "Hotel cueva", "Palacio romano"], a: 1 }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Mini\u2011quiz: 7 Iglesias del Apocalipsis", "description": "Pon a prueba lo que sabes de la ruta Turqu\xEDa + Islas Griegas." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section"> ${renderComponent($$result2, "MiniQuiz", $$MiniQuiz, { "title": "Mini\u2011quiz: 7 Iglesias del Apocalipsis", "questions": qs, "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/MiniQuiz.astro", "client:component-export": "default" })} </section> ` })}`;
}, "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/peregrinaciones/quiz-7-iglesias.astro", void 0);

const $$file = "/Users/santiagoquincenosilva/Proyectos/ministerio-mana-web/src/pages/peregrinaciones/quiz-7-iglesias.astro";
const $$url = "/peregrinaciones/quiz-7-iglesias";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Quiz7Iglesias,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
