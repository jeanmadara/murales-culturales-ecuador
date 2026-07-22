document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('mural-grid');

  if (!grid) return;

  Promise.all([
    fetch('data/murales.json', { headers: { 'Accept': 'application/json; charset=utf-8' } })
      .then(r => { if (!r.ok) throw new Error('Error loading murales.json'); return r.json(); }),
    fetch('data/culturas.json', { headers: { 'Accept': 'application/json; charset=utf-8' } })
      .then(r => { if (!r.ok) throw new Error('Error loading culturas.json'); return r.json(); })
  ])
    .then(([murales, culturas]) => {
      const cultureNames = Object.fromEntries(
        Object.entries(culturas).map(([id, data]) => [id, data.name])
      );
      renderMurales(murales, cultureNames);
    })
    .catch(error => {
      console.error('Error:', error);
      grid.innerHTML = '<p class="error" style="text-align:center;grid-column:1/-1;">Error cargando los datos. Por favor intenta más tarde.</p>';
    });

  function renderMurales(murales, cultureNames) {
    // Construir el HTML de forma eficiente con un solo innerHTML
    // Las primeras 3 tarjetas tienen fetchpriority="high" (above the fold en desktop)
    // El resto usa loading="lazy" + fetchpriority="low" para diferir su descarga
    const html = murales.map((mural, index) => {
      const isAboveFold = index < 3;
      const cultureName = cultureNames[mural.cultureId]
        || mural.cultureId.toUpperCase().replace('-', ' ');

      // Usar <picture> para servir WebP si está disponible, con fallback a PNG
      // Esto permite adoptar WebP progressivamente sin romper el sitio
      const imgHtml = `
        <picture>
          <source srcset="${mural.image.replace(/\.png$/i, '.webp')}" type="image/webp">
          <img
            src="${mural.image}"
            alt="${cultureName} — ${mural.title}"
            class="card-img"
            width="600"
            height="220"
            loading="${isAboveFold ? 'eager' : 'lazy'}"
            decoding="async"
            fetchpriority="${isAboveFold ? 'high' : 'low'}"
          >
        </picture>`;

      return `
        <article class="card">
          <div class="card-img-container">
            ${imgHtml}
          </div>
          <div class="card-content">
            <h2 class="card-title">${cultureName}</h2>
            <p class="card-desc">${truncateText(mural.description, 100)}</p>
            <a href="murales/${mural.id.replace('-', '')}.html" class="btn">Ver Pieza</a>
          </div>
        </article>`;
    }).join('');

    grid.innerHTML = html;
  }

  function truncateText(text, limit) {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
  }
});
