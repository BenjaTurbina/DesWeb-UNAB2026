/* Solo conserva el resumen del carrito durante esta pestaña.
   No almacena datos personales ni de pago. El backend debe recalcular importes. */
(() => {
    'use strict';
    const key = 'sandwichdv.checkoutCart';

    function validItem(item) {
        return item && typeof item.name === 'string' && item.name.trim().length > 0 &&
            item.name.length <= 160 && Number.isSafeInteger(item.price) && item.price >= 0 &&
            Number.isSafeInteger(item.quantity) && item.quantity > 0 &&
            Number.isSafeInteger(item.price * item.quantity);
    }

    function clean(item) {
        const image = typeof item.image === 'string' && item.image.startsWith('imagenes/') &&
            !item.image.split('/').includes('..') ? item.image : '';
        return { name: item.name.trim(), price: item.price, quantity: item.quantity, image };
    }

    function read() {
        try {
            const data = JSON.parse(sessionStorage.getItem(key));
            if (data?.version !== 1 || !Array.isArray(data.items) || data.items.length > 100) return [];
            return data.items.filter(validItem).map(clean);
        } catch (_) {
            return [];
        }
    }

    function save(items) {
        if (!Array.isArray(items) || items.length > 100 || !items.every(validItem)) return false;
        try {
            sessionStorage.setItem(key, JSON.stringify({ version: 1, items: items.map(clean) }));
            return true;
        } catch (_) {
            return false;
        }
    }

    window.SandwichCart = Object.freeze({ read, save });
})();
