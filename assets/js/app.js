document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('mural-grid');

    if (!grid) return;

    fetch('data/murales.json')
        .then(response => {
            if (!response.ok) throw new Error('Error loading murales.json');
            return response.json();
        })
        .then(murales => {
            renderMurales(murales);
        })
        .catch(error => {
            console.error('Error:', error);
            grid.innerHTML = '<p class="error">Error cargando los murales. Por favor intenta más tarde.</p>';
        });

    function renderMurales(murales) {
        grid.innerHTML = murales.map(mural => `
      <article class="card">
        <div class="card-img-container">
          <img src="${mural.image}" alt="${mural.title}" class="card-img" loading="lazy">
        </div>
        <div class="card-content">
          <h2 class="card-title">${mural.title}</h2>
          <p class="card-desc">${truncateText(mural.description, 100)}</p>
          <a href="murales/${mural.id.replace('-', '')}.html" class="btn">Ver Mural</a>
        </div>
      </article>
    `).join('');
    }

    function truncateText(text, limit) {
        if (text.length <= limit) return text;
        return text.slice(0, limit) + '...';
    }
});
