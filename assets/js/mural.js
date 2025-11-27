document.addEventListener('DOMContentLoaded', () => {
  const muralContainer = document.getElementById('mural-detail');

  if (!muralContainer) return;

  // Extract ID from filename (e.g., "mural1.html" -> "mural-1")
  const path = window.location.pathname;
  const filename = path.split('/').pop(); // "mural1.html"
  const muralNumber = filename.match(/mural(\d+)\.html/)[1];
  const muralId = `mural-${muralNumber}`;

  Promise.all([
    fetch('../data/murales.json').then(res => res.json()),
    fetch('../data/culturas.json').then(res => res.json())
  ])
    .then(([murales, culturas]) => {
      const mural = murales.find(m => m.id === muralId);

      if (!mural) {
        throw new Error('Mural no encontrado');
      }

      const culture = culturas[mural.cultureId];
      renderMuralDetail(mural, culture);
    })
    .catch(error => {
      console.error('Error:', error);
      muralContainer.innerHTML = `
      <div class="error-container">
        <h2>Mural no encontrado</h2>
        <p>Lo sentimos, no pudimos cargar la información de este mural.</p>
        <a href="../index.html" class="btn">Volver al inicio</a>
      </div>
    `;
    });

  function renderMuralDetail(mural, culture) {
    // Update Page Title
    document.title = `${mural.title} - Murales Culturales`;

    // Render Content
    muralContainer.innerHTML = `
      <header class="mural-header">
        <span class="culture-tag">${culture ? culture.name : 'Cultura Desconocida'}</span>
        <h1 class="mural-title">${mural.title}</h1>
      </header>

      <div class="mural-media">
        <img src="../${mural.image}" alt="${mural.title}" class="mural-img-large">
      </div>

      <div class="mural-info">
        <div class="main-info">
          <div class="info-section">
            <h3>Descripción</h3>
            <p>${mural.description}</p>
          </div>
          
          ${culture ? `
            <div class="info-section">
              <h3>Sobre la Cultura</h3>
              <p><strong>Región:</strong> ${culture.region}</p>
              <p>${culture.generalDescription}</p>
            </div>
          ` : ''}

          <div class="info-section">
            <h3>Video Relacionado</h3>
            <div class="video-container">
              <iframe src="${mural.videoUrl}" frameborder="0" allowfullscreen></iframe>
            </div>
          </div>
        </div>

        <aside class="sidebar">
          <div class="info-section">
            <h3>Fuentes</h3>
            <ul class="sources-list">
              ${mural.sources.map(source => `<li>${source}</li>`).join('')}
            </ul>
          </div>
          
          <div style="margin-top: 2rem;">
            <a href="../index.html" class="btn" style="width: 100%">← Volver al Mapa</a>
          </div>
        </aside>
      </div>
    `;
  }
});
