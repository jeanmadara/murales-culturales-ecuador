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

    const isMobile = window.innerWidth < 768;

    // Render Content
    muralContainer.innerHTML = `
      <div class="scrolly-container">
        <!-- Fullscreen Video Hero (Mobile & Desktop) -->
        <div class="video-hero">
          <video autoplay muted loop playsinline controls>
            <source src="../${mural.videoUrl}" type="video/mp4">
            Tu navegador no soporta la etiqueta de video.
          </video>
          <div class="scroll-indicator">Desliza para ver más ↓</div>
        </div>

        <!-- Scrollytelling Section (sticky image + scrolling text) -->
        <div class="scrolly-inner">
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

            ${isMobile ? `
            <!-- Block 0: Title & Culture (Mobile Only) -->
            <article class="story-card title-card-mobile" data-step="0">
              <span class="culture-tag">${culture ? culture.name : 'Cultura Desconocida'}</span>
              <h3>${mural.title}</h3>
            </article>
            ` : ''}

            <!-- Block 2: Description -->
            <article class="story-card" data-step="1">
              <h2>Arte</h2>
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

            <!-- Block 4: Sources -->
            <article class="story-card" data-step="3">
              <h2>Fuentes</h2>
              
              <ul class="sources-list" style="margin-bottom: 1.5rem;">
                ${mural.sources.map(source => `<li>${source}</li>`).join('')}
              </ul>

              <div style="text-align: center;">
                <a href="../index.html" class="btn">← Volver a Piezas</a>
              </div>
            </article>

          </div>
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

          // Check if it is the video hero
          if (entry.target.classList.contains('video-hero')) {
            return;
          }

          // Dynamic effects based on step
          const step = entry.target.dataset.step;
          const heroImage = document.getElementById('hero-image');
          const introTitle = document.getElementById('intro-title');
          const heroOverlay = document.getElementById('hero-overlay');

          if (step === '0') {
            // Title Card View (Mobile only)
            if (heroImage) {
              heroImage.style.filter = 'none';
              heroImage.style.transform = 'scale(1)';
            }
            if (heroOverlay) {
              heroOverlay.style.opacity = '0.5';
            }
            if (introTitle) {
              introTitle.style.opacity = '0';
            }
          }

          if (step === '1') {
            // Description View
            if (heroImage) {
              heroImage.style.filter = 'blur(4px) brightness(0.6)';
              heroImage.style.transform = 'scale(1.1)';
            }
            if (introTitle) {
              introTitle.style.opacity = '0';
            }
            if (heroOverlay) {
              heroOverlay.style.opacity = '1';
            }
          }

          if (step === '2') {
            // Culture View
            if (heroImage) {
              heroImage.style.filter = 'blur(8px) brightness(0.4) sepia(0.5)';
              heroImage.style.transform = 'scale(1.2)';
            }
          }

          if (step === '3') {
            // Video View (Desktop only)
            if (heroImage) {
              heroImage.style.filter = 'blur(6px) brightness(0.3)';
              heroImage.style.transform = 'scale(1.1)';
            }

            // Autoplay video logic
            const video = entry.target.querySelector('video');
            const overlay = entry.target.querySelector('.play-overlay');

            if (video && overlay) {
              // Setup manual click handler if not already present
              if (!overlay.hasAttribute('data-initialized')) {
                overlay.setAttribute('data-initialized', 'true');
                overlay.addEventListener('click', () => {
                  video.play();
                  overlay.style.opacity = '0';
                  overlay.style.pointerEvents = 'none';
                });
                // Also hide overlay if user plays via native controls
                video.addEventListener('play', () => {
                  overlay.style.opacity = '0';
                  overlay.style.pointerEvents = 'none';
                });
              }

              // Attempt autoplay
              video.play().then(() => {
                // Success: Hide overlay
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
              }).catch(e => {
                console.log('Autoplay prevented, showing play button:', e);
                // Fail: Keep overlay visible
                overlay.style.opacity = '1';
                overlay.style.pointerEvents = 'auto';
              });
            }
          }


        } else {
          // Logic for when element leaves viewport
          if (entry.target.classList.contains('video-hero')) {
            const video = entry.target.querySelector('video');
            if (video) {
              video.pause();
            }
            return;
          }

          const step = entry.target.dataset.step;
          if (step === '3') {
            const video = entry.target.querySelector('video');
            if (video) {
              video.pause();
            }
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll('.story-card, .video-hero').forEach(card => {
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
