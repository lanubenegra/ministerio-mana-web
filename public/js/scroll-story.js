(() => {
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if (prefersReduced) return;

  const chapters = Array.from(document.querySelectorAll('[data-chapter]'));
  const chipsSection = document.querySelector('[data-chips-section]');
  const chipItems = chipsSection ? Array.from(chipsSection.querySelectorAll('[data-chip]')) : [];
  const chipPanels = chipsSection ? Array.from(chipsSection.querySelectorAll('[data-chip-panel]')) : [];

  let sizes = [];

  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }

  function recalc() {
    sizes = chapters.map((el) => {
      const rect = el.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      const height = el.offsetHeight;
      return { el, top, height };
    });
  }

  function onScroll() {
    const y = window.scrollY + window.innerHeight * 0.5;

    // Animaciones básicas por capítulo
    sizes.forEach(({ el, top, height }) => {
      const progress = clamp((y - top) / height, 0, 1);
      const anims = el.querySelectorAll('[data-animate]');
      anims.forEach((node) => {
        const type = node.dataset.animate;
        const ease = progress * progress * (3 - 2 * progress);
        if (type === 'fade-up') {
          node.style.opacity = ease;
          node.style.transform = `translateY(${18 * (1 - ease)}px)`;
        } else if (type === 'scale') {
          const s = 1 - 0.06 * (1 - ease);
          node.style.opacity = ease;
          node.style.transform = `scale(${s})`;
        }
      });
    });

    // Chips: calcular activo según progreso de la sección
    if (chipsSection && sizes.length) {
      const rect = chipsSection.getBoundingClientRect();
      const start = rect.top + window.scrollY;
      const end = start + rect.height;
      const p = clamp((window.scrollY + window.innerHeight * 0.35 - start) / (end - start), 0, 1);
      const idx = Math.min(chipItems.length - 1, Math.max(0, Math.floor(p * chipItems.length)));
      chipItems.forEach((el, i) => {
        el.classList.toggle('chip-active', i === idx);
      });
      chipPanels.forEach((el, i) => {
        el.style.opacity = i === idx ? '1' : '0';
        el.style.transform = i === idx ? 'translateY(0)' : 'translateY(12px)';
        el.style.pointerEvents = i === idx ? 'auto' : 'none';
      });
    }
  }

  function init() {
    if (!chapters.length) return;
    recalc();
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      recalc();
      onScroll();
    });
  }

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();
