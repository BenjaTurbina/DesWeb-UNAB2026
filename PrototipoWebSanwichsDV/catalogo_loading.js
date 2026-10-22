/* Estado visual del catálogo estático mientras cargan sus imágenes.
   No simula una petición a una API ni agrega una demora artificial. */
(() => {
    'use strict';
    const root = document.documentElement;
    root.classList.add('catalog-loading');
    let cards = [];
    let catalog;
    let status;

    function revealCard(card) {
        card.querySelector('.product-skeleton')?.remove();
        card.classList.add('product-ready');
        card.inert = false;
        card.setAttribute('aria-busy', 'false');
    }

    function finishLoading() {
        clearTimeout(safetyTimeout);
        cards.forEach(revealCard);
        root.classList.remove('catalog-loading');
        catalog?.setAttribute('aria-busy', 'false');
        if (status) status.textContent = 'Catálogo listo.';
    }

    // Si una imagen falla o tarda demasiado, el catálogo sigue siendo utilizable.
    const safetyTimeout = setTimeout(finishLoading, 10000);

    function waitForImage(image) {
        return new Promise(resolve => {
            const done = () => {
                image.removeEventListener('load', onLoad);
                image.removeEventListener('error', done);
                resolve();
            };
            const onLoad = () => {
                if (typeof image.decode === 'function') image.decode().catch(() => {}).then(done);
                else done();
            };
            if (image.complete) onLoad();
            else {
                image.addEventListener('load', onLoad, { once: true });
                image.addEventListener('error', done, { once: true });
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        catalog = document.getElementById('catalogoProductos');
        status = document.getElementById('catalogoLoadingStatus');
        const template = document.getElementById('productoSkeleton');
        if (!catalog || !template || !root.classList.contains('catalog-loading')) {
            finishLoading();
            return;
        }

        cards = [...catalog.querySelectorAll('.bloque_producto')];
        catalog.setAttribute('aria-busy', 'true');
        if (status) status.textContent = 'Cargando productos…';

        const ready = cards.map(card => {
            card.inert = true;
            card.setAttribute('aria-busy', 'true');
            const skeleton = template.content.cloneNode(true);
            if (!card.querySelector('.badge')) skeleton.querySelector('.skeleton-tags').remove();
            card.append(skeleton);
            return Promise.all([...card.querySelectorAll('img')].map(waitForImage))
                .then(() => revealCard(card));
        });
        Promise.all(ready).then(finishLoading);
    }, { once: true });
})();
