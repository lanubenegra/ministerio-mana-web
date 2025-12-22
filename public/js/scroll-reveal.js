(() => {
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if (prefersReduced) return;

  const els = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!els.length) return;

  for (const el of els) el.classList.add('mana-reveal');

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('mana-in');
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12 }
  );

  for (const el of els) io.observe(el);
})();
