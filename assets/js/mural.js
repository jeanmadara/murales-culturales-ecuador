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
      renderScrollyMural(mural, culture);
    })
    .catch(error => {
      console.error('Error:', error);
      muralContainer.innerHTML = `
      <div class="error-container" style="text-align: center; padding: 2rem;">
        <h2>Mural no encontrado</h2>
        <p>Lo sentimos, no pudimos cargar la información de este mural.</p>
        <a href="../index.html" class="btn">Volver al inicio</a>
      </div>
    `;
    });

  function renderScrollyMural(mural, culture) {
    // Update Page Title
    document.title = `${mural.title} - Murales Culturales`;

    // Add scrolly mode class to body
    document.body.classList.add('scrolly-mode');

    // Render Content
    muralContainer.innerHTML = `
      <div class="scrolly-container">
        <!-- Sticky Background Image -->
        <div class="sticky-background">
          <img src="../${mural.image}" alt="${mural.title}" class="bg-image" id="hero-image">
          <div class="overlay" id="hero-overlay"></div>
          
          <div class="intro-title" id="intro-title">
            <span class="culture-tag" style="margin-bottom: 1rem; display: inline-block;">${culture ? culture.name : 'Cultura Desconocida'}</span>
            <h1>${mural.title}</h1>
            <p class="scroll-indicator">Desliza para descubrir ↓</p>
          </div>
        </div>

        <!-- Scrolling Content -->
        <div class="content-layer">
          
          <!-- Spacer for initial clean view -->
          <div style="height: 100vh;"></div>

          <!-- Block 2: Description -->
          <article class="story-card" data-step="1">
            <h2>El Mural</h2>
            <p>${mural.description}</p>
          </article>

          <!-- Block 3: Culture -->
          ${culture ? `
          <article class="story-card" data-step="2">
            <h2>La Cultura ${culture.name}</h2>
            <h3>Región: ${culture.region}</h3>
            <p>${culture.generalDescription}</p>
          </article>
          ` : ''}

          <!-- Block 4: Video & Sources -->
          <article class="story-card" data-step="3">
            <h2>Multimedia y Fuentes</h2>
            <div class="video-container" style="margin-bottom: 1.5rem;">
              <iframe src="${mural.videoUrl}" frameborder="0" allowfullscreen></iframe>
            </div>
            
            <h3>Fuentes:</h3>
            <ul class="sources-list" style="margin-bottom: 1.5rem;">
              ${mural.sources.map(source => `<li>${source}</li>`).join('')}
            </ul>

            <div style="text-align: center;">
              <a href="../index.html" class="btn">← Volver al Mapa</a>
            </div>
          </article>

          <!-- Block 5: Clean Image (Empty card to trigger view) -->
          <div class="story-card" data-step="4" style="opacity: 0; pointer-events: none; height: 50vh;"></div>

        </div>
      </div>
    `;

    // Initialize Intersection Observer
    initScrollyObserver();
  }

  function initScrollyObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Dynamic effects based on step
          const step = entry.target.dataset.step;
          const heroImage = document.getElementById('hero-image');
          const introTitle = document.getElementById('intro-title');
          const heroOverlay = document.getElementById('hero-overlay');

          if (step === '1') {
            // Description View
            heroImage.style.filter = 'blur(4px) brightness(0.6)';
            heroImage.style.transform = 'scale(1.1)';
            introTitle.style.opacity = '0';
            heroOverlay.style.opacity = '1';
          }

          if (step === '2') {
            // Culture View
            heroImage.style.filter = 'blur(8px) brightness(0.4) sepia(0.5)';
            heroImage.style.transform = 'scale(1.2)';
          }

          if (step === '3') {
            // Video View
            heroImage.style.filter = 'blur(6px) brightness(0.3)';
            heroImage.style.transform = 'scale(1.1)';
          }

          if (step === '4') {
            // Clean Image View
            heroImage.style.filter = 'none';
            heroImage.style.transform = 'scale(1)';
            introTitle.style.opacity = '0'; // Keep title hidden
            heroOverlay.style.opacity = '0'; // Hide overlay to see clear image
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll('.story-card, [data-step="4"]').forEach(card => {
      observer.observe(card);
    });

    // Reset view when scrolling to top
    window.addEventListener('scroll', () => {
      if (window.scrollY < 50) {
        const heroImage = document.getElementById('hero-image');
        const introTitle = document.getElementById('intro-title');
        const heroOverlay = document.getElementById('hero-overlay');

        if (heroImage) {
          heroImage.style.filter = 'none';
          heroImage.style.transform = 'scale(1)';
        }
        if (introTitle) {
          introTitle.style.opacity = '1';
        }
        if (heroOverlay) {
          heroOverlay.style.opacity = '1';
        }
      }
    });
  }
});
