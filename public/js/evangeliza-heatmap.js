(function () {
  function init() {
    if (typeof window === 'undefined') return;
    const L = window.L;
    if (!L) return;

    const container = document.getElementById('evangeliza-map');
    if (!container) return;

    let pts = [];
    try {
      pts = container.dataset.points ? JSON.parse(container.dataset.points) : [];
    } catch (err) {
      console.warn('No se pudieron leer los puntos del mapa', err);
    }

    const map = L.map('evangeliza-map', {
      center: [6.2442, -75.5812],
      zoom: 5,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    pts.forEach((p) => {
      addMarker(p);
    });

    function addMarker(p) {
      if (typeof p.lat !== 'number' || typeof p.lng !== 'number') return;
      const count = Number(p.count || 1);
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: 6 + count / 2,
        color: '#1d4ed8',
        fillColor: '#1d4ed8',
        fillOpacity: 0.7,
      })
        .addTo(map)
        .bindPopup(`${p.label || 'Evangelización'} · ${count} persona${count === 1 ? '' : 's'}`);
      return marker;
    }

    // Exponer una función para agregar puntos cuando se envía el formulario.
    window.addEvangelizaPoint = function (p) {
      addMarker(p);
    };
  }

  window.addEventListener('load', init);
})();
