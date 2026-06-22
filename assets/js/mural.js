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
        ${isMobile ? `
        <!-- Mobile Fullscreen Video Hero -->
        <div class="mobile-video-hero">
          <video playsinline>
            <source src="../${mural.videoUrl}" type="video/mp4">
            Tu navegador no soporta la etiqueta de video.
          </video>
          <div class="play-overlay">
             <div class="play-btn">
                <span>▶</span>
             </div>
             <p class="play-text">Ver Video del Mural</p>
          </div>
          <div class="scroll-indicator">Desliza para ver más ↓</div>
        </div>
        ` : ''}

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

          <!-- Block 4: Video & Sources -->
          <article class="story-card" data-step="3">
            <h2>${isMobile ? 'Fuentes' : 'Multimedia y Fuentes'}</h2>
            
            ${!isMobile ? `
            <div class="video-container" style="margin-bottom: 1.5rem; position: relative;">
              <video controls style="width: 100%; height: auto; border-radius: 8px;">
                <source src="../${mural.videoUrl}" type="video/mp4">
                Tu navegador no soporta la etiqueta de video.
              </video>
              <div class="play-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); display: flex; justify-content: center; align-items: center; cursor: pointer; border-radius: 8px; transition: opacity 0.3s; opacity: 1;">
                 <div style="background: rgba(230, 57, 70, 0.9); width: 60px; height: 60px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                    <span style="font-size: 2rem; color: white; margin-left: 4px;">▶</span>
                 </div>
                 <p style="position: absolute; bottom: 20px; color: white; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">Dale Play</p>
              </div>
            </div>
            ` : ''}
            
            <ul class="sources-list" style="margin-bottom: 1.5rem;">
              ${mural.sources.map(source => `<li>${source}</li>`).join('')}
            </ul>

            <div style="text-align: center;">
              <a href="../index.html" class="btn">← Volver a Piezas</a>
            </div>
          </article>

          <!-- Block 5: Clean Image (Empty card to trigger view) -->
          <div class="story-card" data-step="4" style="opacity: 0; pointer-events: none; height: 50vh;"></div>

        </div>
      </div>
    `;

    // Initialize mobile player events if mobile
    if (isMobile) {
      const mobHero = document.querySelector('.mobile-video-hero');
      if (mobHero) {
        const video = mobHero.querySelector('video');
        const overlay = mobHero.querySelector('.play-overlay');
        if (video && overlay) {
          overlay.addEventListener('click', () => {
            if (video.paused) {
              video.play().then(() => {
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
                video.setAttribute('controls', 'true');
              }).catch(err => {
                console.error("Error playing video:", err);
              });
            }
          });
          video.addEventListener('play', () => {
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
            video.setAttribute('controls', 'true');
          });
        }
      }
    }

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

          // Check if it is the mobile video hero
          if (entry.target.classList.contains('mobile-video-hero')) {
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

          if (step === '4') {
            // Clean Image View
            if (heroImage) {
              heroImage.style.filter = 'none';
              heroImage.style.transform = 'scale(1)';
            }
            if (introTitle) {
              introTitle.style.opacity = '0'; // Keep title hidden
            }
            if (heroOverlay) {
              heroOverlay.style.opacity = '0'; // Hide overlay to see clear image
            }
          }
        } else {
          // Logic for when element leaves viewport
          if (entry.target.classList.contains('mobile-video-hero')) {
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

    document.querySelectorAll('.story-card, [data-step="4"], .mobile-video-hero').forEach(card => {
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
