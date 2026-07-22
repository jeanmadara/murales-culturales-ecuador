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
          <video autoplay muted loop playsinline controls preload="metadata">
            <source src="../${mural.videoUrl}" type="video/mp4">
            Tu navegador no soporta la etiqueta de video.
          </video>
          <div class="scroll-indicator">Desliza para ver más ↓</div>
        </div>

        <!-- Scrollytelling Section (sticky image + scrolling text) -->
        <div class="scrolly-inner">
          <!-- Sticky Background Image -->
          <div class="sticky-background">
            <picture>
              <!-- Variante full (1600px) para pantalla completa en paginas de detalle -->
              <source srcset="../${mural.image.replace(/\.png$/i, '-full.webp')}" type="image/webp">
              <!-- Fallback PNG original (alta resolución) -->
              <img
                src="../${mural.image}"
                alt="${mural.title}"
                class="bg-image"
                id="hero-image"
                width="1600"
                height="1067"
                decoding="async"
                fetchpriority="high"
              >
            </picture>
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
              <h3>Región: ${culture.region}</h3>
              ${culture && culture.generalDescription ? `<p style="text-align: left;">${culture.generalDescription}</p>` : ''}
            </article>
            ` : ''}

            <!-- Block 1: Description -->
            <article class="story-card" data-step="1">
              <h2>Descripción del bien</h2>
              <h3>${mural.title}</h3>
              <p>${mural.description}</p>
            </article>

            <!-- Block 2: Uso -->
            ${culture ? `
            <article class="story-card" data-step="2">
              <h2>Posible función y uso</h2>
              <p>${mural.uso}</p>
            </article>
            ` : ''}

            <!-- Block 3: Sources -->
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
          applyStepEffect(step);

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

    // Cache de referencias DOM — evitar querySelector en cada evento de scroll
    const heroImage = document.getElementById('hero-image');
    const introTitle = document.getElementById('intro-title');
    const heroOverlay = document.getElementById('hero-overlay');

    // Función que aplica efectos visuales por step (llamada desde el observer, no en scroll)
    function applyStepEffect(step) {
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
        // Sources View
        if (heroImage) {
          heroImage.style.filter = 'blur(6px) brightness(0.3)';
          heroImage.style.transform = 'scale(1.1)';
        }
      }
    }

    // -------------------------------------------------------------------------
    // Scroll listener optimizado:
    // 1. passive: true  → permite al navegador hacer scroll sin esperar al JS
    // 2. requestAnimationFrame → asegura que el trabajo corra en el frame correcto
    // 3. Flag de throttle → evita encolar múltiples frames en el mismo tick
    // -------------------------------------------------------------------------
    let rafPending = false;

    function onScrollTopReset() {
      // Solo actuar cuando el usuario vuelve al inicio de la página
      if (window.scrollY < 50) {
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
    }

    window.addEventListener('scroll', () => {
      if (rafPending) return; // Saltar si ya hay un frame pendiente
      rafPending = true;
      requestAnimationFrame(() => {
        onScrollTopReset();
        rafPending = false;
      });
    }, { passive: true }); // passive:true es clave para no bloquear el scroll
  }
});
