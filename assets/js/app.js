document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('mural-grid');

  if (!grid) return;

  Promise.all([
    fetch('data/murales.json').then(r => { if (!r.ok) throw new Error('Error loading murales.json'); return r.json(); }),
    fetch('data/culturas.json').then(r => { if (!r.ok) throw new Error('Error loading culturas.json'); return r.json(); })
  ])
    .then(([murales, culturas]) => {
      const cultureNames = Object.fromEntries(
        Object.entries(culturas).map(([id, data]) => [id, data.name])
      );
      renderMurales(murales, cultureNames);
    })
    .catch(error => {
      console.error('Error:', error);
      grid.innerHTML = '<p class="error">Error cargando los datos. Por favor intenta más tarde.</p>';
    });

  function renderMurales(murales, cultureNames) {
    grid.innerHTML = murales.map(mural => `
      <article class="card">
        <div class="card-img-container">
          <img src="${mural.image}" alt="${mural.title}" class="card-img" loading="lazy">
        </div>
        <div class="card-content">
          <h2 class="card-title">${cultureNames[mural.cultureId] || mural.cultureId.toUpperCase().replace('-', ' ')}</h2>
          <p class="card-desc">${truncateText(mural.description, 100)}</p>
          <a href="murales/${mural.id.replace('-', '')}.html" class="btn">Ver Pieza</a>
        </div>
      </article>
    `).join('');
  }

  function truncateText(text, limit) {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
  }
});
