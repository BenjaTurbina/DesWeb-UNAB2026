(() => {
    'use strict';
    const form = document.getElementById('checkoutForm');
    if (!form) return;
    const $ = id => document.getElementById(id);
    const money = value => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
    const items = window.SandwichCart?.read() || [];
    let sessionConfirmed = false;
    let sessionRequest = 0;
    const branches = {
        recoleta: 'Av. Recoleta 450, Santiago. Lunes a sábado: 11:30–22:00 · Domingo: 12:00–20:00.',
        providencia: 'Av. Providencia 1240, Providencia. Lunes a domingo: 12:00–23:00.',
        centro: 'Paseo Huérfanos 890, Santiago. Lunes a viernes: 10:30–20:30.'
    };

    let subtotal = 0;
    let quantity = 0;
    for (const item of items) {
        subtotal += item.price * item.quantity;
        quantity += item.quantity;
        const row = document.createElement('li');
        row.className = 'checkout-item';
        if (item.image) {
            const image = document.createElement('img');
            image.className = 'checkout-item-image';
            image.src = item.image;
            image.alt = item.name;
            image.addEventListener('error', () => {
                const fallback = document.createElement('span');
                fallback.className = 'checkout-item-image checkout-item-fallback';
                fallback.textContent = '×' + item.quantity;
                fallback.setAttribute('aria-hidden', 'true');
                image.replaceWith(fallback);
            }, { once: true });
            row.append(image);
        } else {
            const fallback = document.createElement('span');
            fallback.className = 'checkout-item-image checkout-item-fallback';
            fallback.textContent = '×' + item.quantity;
            fallback.setAttribute('aria-hidden', 'true');
            row.append(fallback);
        }
        const details = document.createElement('div');
        const title = document.createElement('h3');
        title.textContent = item.name;
        const line = document.createElement('div');
        line.className = 'checkout-item-detail';
        const count = document.createElement('span');
        count.textContent = `${item.quantity} × ${money(item.price)}`;
        const total = document.createElement('strong');
        total.textContent = money(item.price * item.quantity);
        line.append(count, total);
        details.append(title, line);
        row.append(details);
        $('checkoutItems').append(row);
    }
    $('checkoutItemCount').textContent = `${quantity} ${quantity === 1 ? 'producto' : 'productos'}`;
    $('checkoutSubtotal').textContent = money(subtotal);
    $('checkoutTotal').textContent = money(subtotal);
    $('checkoutEmpty').hidden = items.length > 0;
    $('checkoutTotals').hidden = items.length === 0;
    $('checkoutShippingNote').hidden = items.length === 0;
    $('checkoutSubmit').disabled = items.length === 0;
    $('checkoutSubmit').hidden = items.length === 0;
    $('checkoutEdit').textContent = items.length ? 'Editar mi carrito' : 'Volver a la carta';

    function resetStatus() { $('checkoutStatus').hidden = true; }

    function renderSession(user) {
        sessionConfirmed = Boolean(user);
        document.querySelector('.checkout-account').classList.toggle('session-confirmed', sessionConfirmed);
        for (const id of ['checkoutDeliverySection', 'checkoutPaymentSection']) {
            const section = $(id);
            section.disabled = !sessionConfirmed;
            section.classList.toggle('checkout-locked', !sessionConfirmed);
            section.setAttribute('aria-disabled', String(!sessionConfirmed));
        }
        $('checkoutSummary').classList.toggle('checkout-locked', !sessionConfirmed);
        $('checkoutSubmit').disabled = !sessionConfirmed || items.length === 0;
        $('checkoutLoginNotice').hidden = sessionConfirmed || items.length === 0;
        $('checkoutAccountActions').hidden = sessionConfirmed;
        $('checkoutAccountStatus').textContent = user ? `Sesión iniciada: ${user.name}` : 'Identificación requerida';
        $('checkoutIdentityRequirement').textContent = user
            ? 'Tu cuenta está identificada. Completa la entrega y el método de pago.'
            : 'Para comprar necesitas una cuenta e iniciar sesión. Así podemos identificar tu pedido.';
        if (user) {
            const fields = { contactName: 'name', contactEmail: 'email', contactPhone: 'phone', deliveryAddress: 'address', deliveryCommune: 'commune' };
            for (const [id, key] of Object.entries(fields)) {
                if (!$(id).value.trim() && typeof user[key] === 'string') {
                    $(id).value = user[key];
                    $(id).setCustomValidity('');
                }
            }
        }
    }

    async function verifySession() {
        const request = ++sessionRequest;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        let user = null;
        try {
            // Contrato de integración: sesión confirmada por el backend, nunca por localStorage
            // ni por el envío del formulario. Respuesta: { authenticated: true, user: { id, name, ... } }.
            const response = await fetch('/api/v1/session', {
                credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'application/json' }, signal: controller.signal
            });
            if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
                const data = await response.json();
                const validId = typeof data.user?.id === 'string' ? data.user.id.trim().length > 0 : Number.isSafeInteger(data.user?.id) && data.user.id > 0;
                if (data.authenticated === true && validId && typeof data.user.name === 'string' && data.user.name.trim()) user = data.user;
            }
        } catch (_) {
            // Sin sesión válida o sin backend disponible, el checkout sigue bloqueado.
        } finally {
            clearTimeout(timeout);
        }
        if (request !== sessionRequest) return false;
        renderSession(user);
        return sessionConfirmed;
    }

    function updateDelivery() {
        const pickup = form.elements.deliveryMethod.value === 'pickup';
        $('pickupFields').hidden = !pickup;
        $('pickupFields').disabled = !pickup;
        $('deliveryFields').hidden = pickup;
        $('deliveryFields').disabled = pickup;
        $('checkoutShipping').textContent = pickup ? 'Sin costo' : 'Por confirmar';
        $('checkoutTotalLabel').textContent = pickup ? 'Total' : 'Total por confirmar';
        $('checkoutTotal').textContent = pickup ? money(subtotal) : '—';
        $('checkoutShippingNote').textContent = pickup
            ? 'Revisa tus productos y elige la sucursal donde quieres retirar.'
            : 'El costo del delivery se confirmará antes del pago. El subtotal corresponde solo a los productos.';
        resetStatus();
    }

    function updatePayment() {
        const card = form.elements.paymentMethod.value === 'card';
        $('cardFields').hidden = !card;
        $('webpayInfo').hidden = card;
        resetStatus();
    }

    form.querySelectorAll('[name="deliveryMethod"]').forEach(input => input.addEventListener('change', updateDelivery));
    form.querySelectorAll('[name="paymentMethod"]').forEach(input => input.addEventListener('change', updatePayment));
    $('pickupBranch').addEventListener('change', () => {
        $('pickupBranchInfo').textContent = branches[$('pickupBranch').value] || 'Selecciona una sucursal para ver su dirección y horario.';
    });
    form.addEventListener('input', resetStatus);
    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (!items.length) return;
        if (!sessionConfirmed || !await verifySession()) {
            $('checkoutLogin').focus();
            return;
        }
        const contactName = $('contactName');
        contactName.setCustomValidity(contactName.value.trim().length < 2 ? 'Escribe tu nombre para identificar el pedido.' : '');
        const phone = $('contactPhone');
        const phoneDigits = phone.value.replace(/\D/g, '');
        const validPhone = /^\+?[0-9 ()-]+$/.test(phone.value.trim()) && phoneDigits.length >= 8 && phoneDigits.length <= 15;
        phone.setCustomValidity(validPhone ? '' : 'Escribe un teléfono de contacto válido.');
        const delivery = form.elements.deliveryMethod.value === 'delivery';
        const address = $('deliveryAddress');
        address.setCustomValidity(delivery && address.value.trim().length < 5 ? 'Escribe la calle y el número de tu dirección.' : '');
        const commune = $('deliveryCommune');
        commune.setCustomValidity(delivery && commune.value.trim().length < 2 ? 'Escribe la comuna de entrega.' : '');
        if (!form.reportValidity()) return;
        // Aún no existe una pasarela: no enviar datos ni simular un pago aprobado.
        $('checkoutStatus').textContent = 'Los datos del pedido están completos. El pago en línea aún no está disponible; no se ha realizado ningún cobro. Tu carrito se conserva.';
        $('checkoutStatus').hidden = false;
        $('checkoutStatus').focus();
    });
    form.querySelectorAll('input, textarea').forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));
    window.addEventListener('pageshow', event => {
        // Las contraseñas pertenecen al modal existente; no guardar datos del formulario.
        $('checkoutStatus').hidden = true;
        if (event.persisted) {
            renderSession(null);
            verifySession();
        }
    });
    // Una integración de acceso puede solicitar una nueva verificación, sin afirmar identidad desde el navegador.
    document.addEventListener('auth:session-changed', verifySession);
    document.getElementById('perfilModal').addEventListener('hidden.bs.modal', verifySession);
    window.addEventListener('focus', () => { if (sessionConfirmed) verifySession(); });
    updateDelivery();
    updatePayment();
    renderSession(null);
    verifySession();
})();
