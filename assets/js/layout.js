// layout.js — Solo para páginas de murales (/murales/*.html)
// El index.html tiene su propio header/footer estático para evitar CLS.
(function () {
  // Detectar si estamos en una página de mural (siempre tiene /murales/ en la ruta)
  const isMuralPage = window.location.pathname.includes('/murales/');

  if (!isMuralPage) return; // Salir si es el index — no necesitamos hacer nada

  const basePath = '../';

  // Inyectar meta tags y hoja de estilos en el <head>
  // Esto va antes de DOMContentLoaded para que el CSS bloquee el render
  // y evitar que el usuario vea contenido sin estilos (FOUC)
  const headContent = `
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preload" href="${basePath}assets/fonts/Optima-Bold.otf" as="font" type="font/otf" crossorigin="anonymous">
    <link rel="stylesheet" href="${basePath}assets/css/style.css">
  `;
  document.head.insertAdjacentHTML('beforeend', headContent);

  // Inyectar header y footer después de que el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    const headerHTML = `
      <header>
        <div class="container">
          <h1><a href="${basePath}index.html">Herencia Ancestral</a></h1>
        </div>
      </header>
    `;

    const footerHTML = `
      <footer>
        <div class="container">
          <p>&copy; 2026 <a href="https://jeancorrea.com" target="_blank" rel="noopener">jeancorrea.com</a>. Proyecto Educativo.</p>
        </div>
      </footer>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    document.body.insertAdjacentHTML('beforeend', footerHTML);
  });
})();
