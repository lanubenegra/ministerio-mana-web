(() => {
  if (typeof window === 'undefined') return;

  const scenes = Array.from(document.querySelectorAll('[data-history-scene]'));
  const pins = Array.from(document.querySelectorAll('[data-history-pin]'));
  const globe = document.querySelector('[data-history-globe]');
  const globeMap = globe?.querySelector('.history-globe-map');

  if (!scenes.length) return;

  const setActive = (year, rotate) => {
    scenes.forEach((el) => {
      el.classList.toggle('is-active', el.dataset.year === year);
    });
    pins.forEach((el) => {
      el.classList.toggle('is-active', el.dataset.year === year);
    });
    if (globeMap && rotate) {
      globeMap.style.setProperty('--globe-rotate', rotate);
    }
  };

  // Default: first active
  setActive(scenes[0].dataset.year, scenes[0].dataset.rotate);

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const { year, rotate } = entry.target.dataset;
          if (year) setActive(year, rotate);
        }
      });
    },
    { threshold: 0.35 }
  );

  scenes.forEach((el) => io.observe(el));
})();
