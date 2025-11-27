// Inject head content first (before DOMContentLoaded)
(function () {
    const isRoot = window.location.pathname.endsWith('index.html') ||
        window.location.pathname.endsWith('/') ||
        !window.location.pathname.includes('/murales/');
    const basePath = isRoot ? '' : '../';

    // Inject meta tags and stylesheets into head
    const headContent = `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="${basePath}assets/css/style.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    `;

    document.head.insertAdjacentHTML('beforeend', headContent);
})();

// Inject header and footer after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const isRoot = window.location.pathname.endsWith('index.html') ||
        window.location.pathname.endsWith('/') ||
        !window.location.pathname.includes('/murales/');
    const basePath = isRoot ? '' : '../';

    const headerHTML = `
        <header>
            <div class="container">
                <h1><a href="${basePath}index.html">Murales Culturales</a></h1>
            </div>
        </header>
    `;

    const footerHTML = `
        <footer>
            <div class="container">
                <p>&copy; 2025 Murales Culturales. Proyecto Educativo.</p>
            </div>
        </footer>
    `;

    // Insert Header at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // Insert Footer at the end of body
    document.body.insertAdjacentHTML('beforeend', footerHTML);
});
