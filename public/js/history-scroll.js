(() => {
  if (typeof window === 'undefined') return;
  const items = Array.from(document.querySelectorAll('[data-history-item]'));
  const dots = Array.from(document.querySelectorAll('[data-history-dot]'));
  if (!items.length) return;

  const setActive = (id) => {
    items.forEach((el) => {
      el.classList.toggle('is-active', el.dataset.id === id);
    });
    dots.forEach((el) => {
      el.classList.toggle('is-active', el.dataset.id === id);
    });
  };

  // Default: first active
  setActive(items[0].dataset.id);

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.dataset.id;
          setActive(id);
        }
      });
    },
    { threshold: 0.3 }
  );

  items.forEach((el) => io.observe(el));
})();
