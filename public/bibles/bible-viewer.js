// public/bibles/bible-viewer.js
// Visor de Biblia RVR1960 sin scripts inline (compatible con CSP).

(function () {
  'use strict';

  // Orden estándar de los 66 libros
  const BOOKS = [
    // Antiguo Testamento
    'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio',
    'Josué', 'Jueces', 'Rut', '1 Samuel', '2 Samuel',
    '1 Reyes', '2 Reyes', '1 Crónicas', '2 Crónicas', 'Esdras',
    'Nehemías', 'Ester', 'Job', 'Salmos', 'Proverbios',
    'Eclesiastés', 'Cantares', 'Isaías', 'Jeremías', 'Lamentaciones',
    'Ezequiel', 'Daniel', 'Oseas', 'Joel', 'Amós',
    'Abdías', 'Jonás', 'Miqueas', 'Nahúm', 'Habacuc',
    'Sofonías', 'Hageo', 'Zacarías', 'Malaquías',
    // Nuevo Testamento
    'Mateo', 'Marcos', 'Lucas', 'Juan', 'Hechos',
    'Romanos', '1 Corintios', '2 Corintios', 'Gálatas', 'Efesios',
    'Filipenses', 'Colosenses', '1 Tesalonicenses', '2 Tesalonicenses',
    '1 Timoteo', '2 Timoteo', 'Tito', 'Filemón', 'Hebreos',
    'Santiago', '1 Pedro', '2 Pedro',
    '1 Juan', '2 Juan', '3 Juan', 'Judas', 'Apocalipsis'
  ];

  const STATE = {
    data: null,
    dataPromise: null,
    overlay: null,
    body: null,
    bookSelect: null,
    chapterSelect: null,
    currentBook: 0,
    currentChapter: 1
  };

  // Normaliza texto: minúsculas, sin tildes, espacios simples.
  function normalize(str) {
    return str
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const ALIASES = new Map();

  function addAlias(index, ...names) {
    names.forEach((name) => {
      const key = normalize(name);
      if (!key) return;
      if (!ALIASES.has(key)) {
        ALIASES.set(key, index);
      }
    });
  }

  // Alias básicos: todos los nombres completos
  BOOKS.forEach((name, index) => addAlias(index, name));

  // Alias extra (abreviaturas frecuentes)
  (function addExtraAliases() {
    const idx = (nombreIncluye) =>
      BOOKS.findIndex((b) => b.indexOf(nombreIncluye) !== -1);

    addAlias(idx('Génesis'), 'gen', 'gn');
    addAlias(idx('Éxodo'), 'exo', 'ex');
    addAlias(idx('Levítico'), 'lev', 'lv');
    addAlias(idx('Números'), 'num', 'nm');
    addAlias(idx('Deuteronomio'), 'deu', 'dt');

    addAlias(idx('Josué'), 'jos');
    addAlias(idx('Jueces'), 'jue');
    addAlias(idx('1 Samuel'), '1 sam', '1 s', 'i samuel');
    addAlias(idx('2 Samuel'), '2 sam', '2 s', 'ii samuel');
    addAlias(idx('1 Reyes'), '1 re', '1 rey');
    addAlias(idx('2 Reyes'), '2 re', '2 rey');

    addAlias(idx('Esdras'), 'esd');
    addAlias(idx('Nehemías'), 'neh');
    addAlias(idx('Ester'), 'est');

    addAlias(idx('Salmos'), 'salmo', 'salmos', 'sal', 'ps', 'sl');
    addAlias(idx('Proverbios'), 'prov', 'pr');
    addAlias(idx('Eclesiastés'), 'ecl', 'ec');
    addAlias(idx('Cantares'), 'cnt', 'cant', 'cantar de los cantares');

    addAlias(idx('Isaías'), 'isa', 'is');
    addAlias(idx('Jeremías'), 'jer', 'jr');
    addAlias(idx('Lamentaciones'), 'lam');
    addAlias(idx('Ezequiel'), 'ez', 'ezeq');
    addAlias(idx('Daniel'), 'dan', 'dn');

    addAlias(idx('Mateo'), 'mt');
    addAlias(idx('Marcos'), 'mc', 'mr');
    addAlias(idx('Lucas'), 'lc', 'lk');
    addAlias(idx('Juan'), 'jn', 'joh', 'san juan');
    addAlias(idx('Hechos'), 'hch', 'act');

    addAlias(idx('Romanos'), 'rom', 'ro');
    addAlias(idx('Gálatas'), 'gal', 'ga');
    addAlias(idx('Efesios'), 'ef', 'eph');
    addAlias(idx('Filipenses'), 'fil', 'flp', 'php');
    addAlias(idx('Colosenses'), 'col');

    addAlias(idx('1 Tesalonicenses'), '1 ts', '1 th');
    addAlias(idx('2 Tesalonicenses'), '2 ts', '2 th');

    addAlias(idx('1 Timoteo'), '1 tm', '1 ti');
    addAlias(idx('2 Timoteo'), '2 tm', '2 ti');

    addAlias(idx('Hebreos'), 'heb', 'hb');
    addAlias(idx('Santiago'), 'stg', 'sant', 'jas');

    addAlias(idx('1 Pedro'), '1 pe', '1 ped');
    addAlias(idx('2 Pedro'), '2 pe', '2 ped');

    addAlias(idx('1 Juan'), '1 jn');
    addAlias(idx('2 Juan'), '2 jn');
    addAlias(idx('3 Juan'), '3 jn');

    addAlias(idx('Apocalipsis'), 'ap', 'apoc', 'rv', 'rev', 'revelación');
  })();

  function findBookIndex(bookNameRaw) {
    const key = normalize(bookNameRaw);
    if (!key) return null;
    if (ALIASES.has(key)) return ALIASES.get(key);
    // Quitar posibles prefijos tipo "san"
    const key2 = key.replace(/^s(an)?\s+/, '');
    if (ALIASES.has(key2)) return ALIASES.get(key2);

    // Fallback: coincidencia parcial
    for (const [k, i] of ALIASES.entries()) {
      if (k.startsWith(key) || key.startsWith(k)) {
        return i;
      }
    }
    return null;
  }

  // "Juan 3:16", "Salmo 23", "Filipenses 4:4-7,9"
  function parseReference(input) {
    if (!input) return null;
    const txt = input.replace(/\s+/g, ' ').trim();
    const match = txt.match(/^(.+?)\s+(\d{1,3})(?::([\d,\-\u2013\u2014 ]+))?$/);
    if (!match) return null;

    const bookRaw = match[1];
    const chap = parseInt(match[2], 10);
    if (!chap || chap < 1) return null;

    const versesSpec = match[3];
    const bookIndex = findBookIndex(bookRaw);
    if (bookIndex == null) return null;

    const highlights = new Set();
    if (versesSpec) {
      versesSpec.split(',').forEach((part) => {
        const p = part.trim();
        if (!p) return;
        const range = p.split(/[-\u2013\u2014]/).map((n) => parseInt(n.trim(), 10));
        if (range.length === 1) {
          if (range[0]) highlights.add(range[0]);
        } else {
          const start = range[0];
          const end = range[1] || start;
          if (start && end && end >= start) {
            for (let v = start; v <= end; v++) highlights.add(v);
          }
        }
      });
    }

    return { bookIndex, chapter: chap, highlights };
  }

  function loadBible() {
    if (STATE.dataPromise) return STATE.dataPromise;

    STATE.dataPromise = fetch('/bibles/rvr1960.json', { cache: 'force-cache' })
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo cargar rvr1960.json');
        return res.json();
      })
      .then((json) => {
        STATE.data = json;
        return json;
      })
      .catch((err) => {
        console.error('Error cargando la Biblia:', err);
        STATE.data = null;
        throw err;
      });

    return STATE.dataPromise;
  }

  function ensureModal() {
    if (STATE.overlay) return;

    const overlay = document.createElement('div');
    overlay.className = 'mana-bible-overlay';
    overlay.innerHTML =
      '<div class="mana-bible-dialog">' +
      '  <div class="mana-bible-header">' +
      '    <div class="mana-bible-title">BIBLIA RVR1960</div>' +
      '    <div class="mana-bible-controls">' +
      '      <select class="mana-bible-select" data-bible-book></select>' +
      '      <select class="mana-bible-select" data-bible-chapter></select>' +
      '      <button type="button" class="mana-bible-nav" data-bible-prev>&laquo;</button>' +
      '      <button type="button" class="mana-bible-nav" data-bible-next>&raquo;</button>' +
      '      <button type="button" class="mana-bible-close" data-bible-close>Cerrar</button>' +
      '    </div>' +
      '  </div>' +
      '  <div class="mana-bible-body" data-bible-body></div>' +
      '</div>';

    document.body.appendChild(overlay);

    STATE.overlay = overlay;
    STATE.body = overlay.querySelector('[data-bible-body]');
    STATE.bookSelect = overlay.querySelector('[data-bible-book]');
    STATE.chapterSelect = overlay.querySelector('[data-bible-chapter]');

    // Llenar select de libros
    BOOKS.forEach((name, index) => {
      const opt = document.createElement('option');
      opt.value = String(index);
      opt.textContent = name;
      STATE.bookSelect.appendChild(opt);
    });

    STATE.bookSelect.addEventListener('change', () => {
      const idx = parseInt(STATE.bookSelect.value, 10);
      if (Number.isNaN(idx)) return;
      renderChapter(idx, 1, new Set());
    });

    STATE.chapterSelect.addEventListener('change', () => {
      const chap = parseInt(STATE.chapterSelect.value, 10);
      if (!chap) return;
      renderChapter(STATE.currentBook, chap, new Set());
    });

    overlay.querySelector('[data-bible-prev]').addEventListener('click', () => {
      if (!STATE.data) return;
      let b = STATE.currentBook;
      let c = STATE.currentChapter - 1;
      if (c < 1) {
        b = Math.max(0, b - 1);
        const total = STATE.data[b].chapters.length;
        c = total;
      }
      renderChapter(b, c, new Set());
    });

    overlay.querySelector('[data-bible-next]').addEventListener('click', () => {
      if (!STATE.data) return;
      let b = STATE.currentBook;
      let c = STATE.currentChapter + 1;
      const total = STATE.data[b].chapters.length;
      if (c > total) {
        b = Math.min(STATE.data.length - 1, b + 1);
        c = 1;
      }
      renderChapter(b, c, new Set());
    });

    overlay.querySelector('[data-bible-close]').addEventListener('click', () => {
      overlay.classList.remove('is-open');
    });

    overlay.addEventListener('click', (ev) => {
      if (ev.target === overlay) overlay.classList.remove('is-open');
    });
  }

  function updateChapterSelect(bookIndex, chapter) {
    const book = STATE.data && STATE.data[bookIndex];
    if (!book) return;
    const total = book.chapters.length;

    STATE.chapterSelect.innerHTML = '';
    for (let c = 1; c <= total; c++) {
      const opt = document.createElement('option');
      opt.value = String(c);
      opt.textContent = String(c);
      if (c === chapter) opt.selected = true;
      STATE.chapterSelect.appendChild(opt);
    }
  }

  function renderChapter(bookIndex, chapter, highlights) {
    const data = STATE.data;
    if (!data) return;

    const book = data[bookIndex];
    if (!book || !book.chapters || !book.chapters[chapter - 1]) {
      showError('No encontramos ese capítulo. Revisa la cita.');
      return;
    }

    STATE.currentBook = bookIndex;
    STATE.currentChapter = chapter;

    STATE.bookSelect.value = String(bookIndex);
    updateChapterSelect(bookIndex, chapter);

    const verses = book.chapters[chapter - 1];
    const frag = document.createDocumentFragment();

    verses.forEach((text, idx) => {
      const vNum = idx + 1;
      const p = document.createElement('p');
      p.className = 'mana-bible-verse';
      if (highlights && highlights.has(vNum)) {
        p.classList.add('is-highlight');
      }

      const numSpan = document.createElement('span');
      numSpan.className = 'mana-bible-verse-num';
      numSpan.textContent = String(vNum);

      p.appendChild(numSpan);
      p.appendChild(document.createTextNode(' ' + text));
      frag.appendChild(p);
    });

    STATE.body.innerHTML = '';
    STATE.body.appendChild(frag);

    if (highlights && highlights.size > 0) {
      const first = STATE.body.querySelector('.mana-bible-verse.is-highlight');
      if (first) {
        setTimeout(() => {
          first.classList.add('is-focus');
          first.scrollIntoView({ block: 'center', behavior: 'smooth' });
          setTimeout(() => first.classList.remove('is-focus'), 1600);
        }, 0);
      }
    } else {
      STATE.body.scrollTop = 0;
    }

    STATE.overlay.classList.add('is-open');
  }

  function showError(msg) {
    ensureModal();
    STATE.body.innerHTML = '';
    const p = document.createElement('p');
    p.className = 'mana-bible-error';
    p.textContent = msg;
    STATE.body.appendChild(p);
    STATE.overlay.classList.add('is-open');
  }

  async function openBible(reference) {
    try {
      ensureModal();
      const parsed = parseReference(reference);
      if (!parsed) {
        showError('No entendimos la cita. Escribe algo como "Juan 3:16" o "Salmo 23".');
        return;
      }
      await loadBible();
      renderChapter(parsed.bookIndex, parsed.chapter, parsed.highlights);
    } catch (err) {
      console.error(err);
      showError('No se pudo cargar la Biblia. Intenta de nuevo más tarde.');
    }
  }

  // Conectar el visor con el formulario y los botones de acceso rápido
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('[data-bible-form]');
    if (!form) return;

    const input = form.querySelector('input[name="ref"]');

    if (input && !input.getAttribute('autocomplete')) {
      input.setAttribute('autocomplete', 'off');
    }

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      if (!input) return;
      const ref = input.value.trim();
      if (ref) openBible(ref);
    });

    const quick = document.querySelectorAll('[data-bible-ref]');
    quick.forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        const ref = btn.getAttribute('data-bible-ref');
        if (!ref) return;
        if (input) input.value = ref;
        openBible(ref);
      });
    });
  });

  // Por si lo quieres usar desde otros scripts
  window.manaOpenBible = openBible;
})();
