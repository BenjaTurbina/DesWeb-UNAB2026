/* Prototipo local: datos ficticios y cambios solo en memoria.
   No realiza peticiones al backend ni modifica Pedir.html. */
(() => {
    'use strict';
    const initialProducts = [
    {
        "id": 1,
        "name": "Pollito Koreano",
        "price": 10950,
        "description": "Pollo crocante, glaseado de miel y especias, kimchi, pepinillos, cilantro fresco y mayonesa.",
        "image": "imagenes/Sandwiches/korean-chicken-sandwich.jpg",
        "category": "S\u00e1ndwiches",
        "tags": [
            "Marraqueta",
            "Pollo Crispy",
            "Pepinillos"
        ],
        "active": true
    },
    {
        "id": 2,
        "name": "El revolucionario",
        "price": 11950,
        "description": "Carne mechada braseada, queso mantecoso, cebolla caramelizada, tomates confitados y lechuga.",
        "image": "imagenes/Sandwiches/MECHADA.png",
        "category": "S\u00e1ndwiches",
        "tags": [
            "Ciabatta",
            "Mechada",
            "Queso Fundido",
            "Cebolla"
        ],
        "active": true
    },
    {
        "id": 3,
        "name": "Churrasco Italiano",
        "price": 6500,
        "description": "Finas l\u00e1minas de vacuno a la plancha, palta hass molida, tomate fresco y mayonesa casera.",
        "image": "imagenes/Sandwiches/Churrasco_Italiano1.jpg",
        "category": "S\u00e1ndwiches",
        "tags": [
            "Vacuno",
            "Italiano",
            "Palta",
            "Pan Frica"
        ],
        "active": true
    },
    {
        "id": 4,
        "name": "Mechada Barros Luco",
        "price": 7200,
        "description": "Carne mechada deshilachada en su jugo con abundante queso mantecoso fundido.",
        "image": "imagenes/Sandwiches/Barros-luco01.jpg",
        "category": "S\u00e1ndwiches",
        "tags": [
            "Mechada",
            "Luco",
            "Queso Fundido",
            "Marraqueta"
        ],
        "active": true
    },
    {
        "id": 5,
        "name": "Pollo Crispy BBQ",
        "price": 6800,
        "description": "Pechuga de pollo frita y crujiente, tocino ahumado, queso cheddar, pepinillos y salsa BBQ.",
        "image": "imagenes/Sandwiches/KFC-CRISPY-BBQ.webp",
        "category": "S\u00e1ndwiches",
        "tags": [
            "Pollo",
            "Tocino",
            "Cheddar",
            "Pan Brioche",
            "Pepinillos"
        ],
        "active": false
    },
    {
        "id": 6,
        "name": "Lomito Chacarero",
        "price": 6900,
        "description": "Finas lonjas de lomo de cerdo horneado, porotos verdes, tomate, aj\u00ed verde y mayonesa.",
        "image": "imagenes/Sandwiches/Chacarero-edit.jpg",
        "category": "S\u00e1ndwiches",
        "tags": [
            "Cerdo",
            "Chacarero",
            "Porotos Verdes",
            "Aj\u00ed Verde",
            "Pan Frica"
        ],
        "active": true
    },
    {
        "id": 7,
        "name": "Not Burger Vegana",
        "price": 7500,
        "description": "Hamburguesa plant-based con palta, tomate y mayonesa 100% vegana en pan de masa madre.",
        "image": "imagenes/Sandwiches/temp_image_20210806_214030_30d8e9a7-911f-47ad-bcbe-0b257e6a63d4-Cropped.jpg",
        "category": "S\u00e1ndwiches",
        "tags": [
            "Vegano",
            "Not Meat",
            "Italiano",
            "Masa Madre"
        ],
        "active": true
    },
    {
        "id": 8,
        "name": "Guaton Loyola",
        "price": 8500,
        "description": "Doble hamburguesa, queso cheddar y queso mantecoso, tocino ahumado de la casa, cebollas caramelizadas al vino tinto, pepinillos, lechuga, tomate y salsa dijonesa.",
        "image": "imagenes/Sandwiches/rWAYQ5rJwMqgErSzJ-300-x.webp",
        "category": "S\u00e1ndwiches",
        "tags": [
            "Hamburgesa de Res",
            "Tocino",
            "Cebolla",
            "Focaccia",
            "Lechuga"
        ],
        "active": true
    },
    {
        "id": 9,
        "name": "Wrap de Pollo",
        "price": 5900,
        "description": "Tiras de pollo crujiente, lechuga fresca, tomate y suave mayonesa casera envueltos en una tortilla tostada.",
        "image": "imagenes/Wraps/images.jfif",
        "category": "Wraps",
        "tags": [
            "Wrap/Tortilla",
            "Pollo Crispy",
            "Lechuga",
            "Tomate"
        ],
        "active": true
    },
    {
        "id": 10,
        "name": "Wrap Falafel Vegano",
        "price": 6200,
        "description": "Bolitas de falafel horneadas, palta, tomate, lechuga y aderezo de hummus en tortilla de espinaca.",
        "image": "imagenes/Wraps/Vegan-Baked-Falafel-resize.webp",
        "category": "Wraps",
        "tags": [
            "Vegano",
            "Wrap/Tortilla",
            "Falafel",
            "Palta"
        ],
        "active": false
    },
    {
        "id": 11,
        "name": "Wrap Mechada Luco",
        "price": 6800,
        "description": "Toda la potencia de nuestra mechada deshilachada envuelta con abundante queso mantecoso fundido.",
        "image": "imagenes/Wraps/8249b22dfca4e8fc258674c71f2e212f.webp",
        "category": "Wraps",
        "tags": [
            "Wrap/Tortilla",
            "Mechada",
            "Queso Fundido",
            "Luco"
        ],
        "active": true
    },
    {
        "id": 12,
        "name": "Coca-Cola Original",
        "price": 1500,
        "description": "Lata 350ml",
        "image": "imagenes/Bebestibles/istockphoto-458120031-612x612.jpg",
        "category": "Bebidas",
        "tags": [],
        "active": true
    },
    {
        "id": 13,
        "name": "Coca-Cola Zero",
        "price": 1500,
        "description": "Lata 350ml",
        "image": "imagenes/Bebestibles/coca-cola-sazucar-lata-6x350-cc.jpg",
        "category": "Bebidas",
        "tags": [],
        "active": true
    },
    {
        "id": 14,
        "name": "Jugo de Naranja",
        "price": 2900,
        "description": "Natural, reci\u00e9n exprimido 400ml",
        "image": "imagenes/Bebestibles/jugo-de-naranja-destacado.jpg",
        "category": "Bebidas",
        "tags": [],
        "active": true
    },
    {
        "id": 15,
        "name": "Cerveza Austral Calafate",
        "price": 3200,
        "description": "Botella 330ml",
        "image": "imagenes/Bebestibles/frontal-5158.webp",
        "category": "Bebidas",
        "tags": [],
        "active": true
    },
    {
        "id": 16,
        "name": "Sprite Original",
        "price": 1500,
        "description": "Lata 350ml",
        "image": "imagenes/Bebestibles/4835_0_sprite-lata-350cc.png",
        "category": "Bebidas",
        "tags": [],
        "active": true
    },
    {
        "id": 17,
        "name": "Fanta Original",
        "price": 1500,
        "description": "Lata 350ml",
        "image": "imagenes/Bebestibles/1110073.png",
        "category": "Bebidas",
        "tags": [],
        "active": true
    }
];
    let products = initialProducts.map(product => ({ ...product, tags: [...product.tags] }));
    let editingId = null;
    let selectedImage = '';
    let imageReadVersion = 0;
    let imageLoading = false;
    let toastTimer;
    const $ = id => document.getElementById(id);
    const money = amount => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount);
    const normalize = value => value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const todayParts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const today = ['year', 'month', 'day'].map(type => todayParts.find(part => part.type === type).value).join('-');
    const calendarDay = offset => { const date = new Date(today + 'T12:00:00Z'); date.setUTCDate(date.getUTCDate() + offset); return date.toISOString().slice(0, 10); };
    const demoSales = [
        { time: '11:24', state: 'Pagada', items: [[3, 2], [12, 2]] },
        { time: '12:08', state: 'Pagada', items: [[1, 1], [3, 2], [13, 1]] },
        { time: '12:42', state: 'Pagada', items: [[4, 2], [14, 1]] },
        { time: '13:16', state: 'Pendiente', items: [[8, 1], [9, 1], [12, 1]] },
        { time: '13:38', state: 'Pagada', items: [[3, 3], [16, 2]] },
        { time: '14:05', state: 'Anulada', items: [[2, 1], [15, 1]] },
        { time: '15:12', state: 'Pagada', items: [[11, 2], [17, 2]] },
        { time: '16:31', state: 'Pagada', items: [[7, 1], [3, 1], [14, 1]] }
    ];
    const invoices = [0, -1, -2].flatMap((offset, dayIndex) => demoSales.slice(0, dayIndex === 0 ? 8 : dayIndex === 1 ? 6 : 4).map((sale, index) => ({
        ...sale, date: calendarDay(offset), id: `F-${String(184 - dayIndex * 8 + index).padStart(5, '0')}`,
        // Precio histórico de la factura: editar el catálogo no altera las ventas emitidas.
        items: sale.items.map(([id, quantity]) => { const product = initialProducts.find(item => item.id === id); return { productId: id, name: product.name, image: product.image, quantity, unitPrice: product.price }; }),
        total: sale.items.reduce((sum, [id, quantity]) => sum + initialProducts.find(item => item.id === id).price * quantity, 0)
    })));

    function icon(name) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('icon'); svg.setAttribute('aria-hidden', 'true');
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttribute('href', '#i-' + name); svg.append(use); return svg;
    }
    function element(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }
    function showToast(title, message) {
        clearTimeout(toastTimer);
        $('toastTitle').textContent = title;
        $('toastMessage').textContent = message;
        $('adminToast').hidden = false;
        toastTimer = setTimeout(() => { $('adminToast').hidden = true; }, 7500);
    }

    function renderReport() {
        const selectedDate = $('reportDate').value || today;
        const daily = invoices.filter(invoice => invoice.date === selectedDate);
        const paid = daily.filter(invoice => invoice.state === 'Pagada');
        const pending = daily.filter(invoice => invoice.state === 'Pendiente');
        const revenue = paid.reduce((sum, invoice) => sum + invoice.total, 0);
        const billed = daily.filter(invoice => invoice.state !== 'Anulada');
        const formattedDate = new Intl.DateTimeFormat('es-CL', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(selectedDate + 'T12:00:00Z'));
        $('reportDateLabel').textContent = (selectedDate === today ? 'Hoy, ' : '') + formattedDate;
        $('dailyRevenue').textContent = money(revenue);
        $('dailyInvoices').textContent = daily.length;
        const cancelled = daily.length - billed.length;
        $('invoiceSummary').textContent = `${paid.length} ${paid.length === 1 ? 'pagada' : 'pagadas'} · ${pending.length} ${pending.length === 1 ? 'pendiente' : 'pendientes'}${cancelled ? ` · ${cancelled} ${cancelled === 1 ? 'anulada' : 'anuladas'}` : ''}`;
        $('averageSale').textContent = money(paid.length ? Math.round(revenue / paid.length) : 0);
        $('invoicesBadge').textContent = `${daily.length} documentos`;
        $('invoiceRows').replaceChildren();
        if (!daily.length) {
            const row = element('tr'); const cell = element('td', 'empty-state', 'No hay facturas de ejemplo para esta fecha. Prueba hoy o uno de los dos días anteriores.');
            cell.colSpan = 5; row.append(cell); $('invoiceRows').append(row);
        }
        daily.slice().reverse().forEach(invoice => {
            const row = element('tr');
            row.append(element('td', '', invoice.id), element('td', '', invoice.time), element('td', '', `${invoice.items.reduce((sum, item) => sum + item.quantity, 0)} unidades`), element('td', '', money(invoice.total)));
            const cell = element('td');
            cell.append(element('span', 'status status-' + (invoice.state === 'Pagada' ? 'paid' : invoice.state === 'Pendiente' ? 'pending' : 'cancelled'), invoice.state));
            row.append(cell); $('invoiceRows').append(row);
        });
        const billedTotal = billed.reduce((sum, invoice) => sum + invoice.total, 0);
        $('invoiceTotals').textContent = `Facturado: ${money(billedTotal)} · Cobrado: ${money(revenue)} · Las anuladas se excluyen de los totales.`;

        // Cubrir toda la jornada y cualquier movimiento fuera de ese horario.
        const paidHours = paid.map(invoice => Number(invoice.time.slice(0, 2)));
        const firstHour = Math.min(10, ...paidHours);
        const lastHour = Math.max(23, ...paidHours);
        const hourly = Array.from({ length: lastHour - firstHour + 1 }, (_, index) => ({ hour: firstHour + index, amount: 0 }));
        paid.forEach(invoice => { const bucket = hourly.find(item => item.hour === Number(invoice.time.slice(0, 2))); if (bucket) bucket.amount += invoice.total; });
        const max = Math.max(...hourly.map(bucket => bucket.amount), 1);
        $('salesChart').replaceChildren();
        $('salesChart').setAttribute('aria-label', 'Ingresos cobrados por hora: ' + hourly.map(bucket => `${bucket.hour} horas, ${money(bucket.amount)}`).join('; '));
        hourly.forEach(bucket => {
            const column = element('div', 'chart-column' + (bucket.amount === max ? ' is-peak' : ''));
            column.setAttribute('aria-hidden', 'true');
            const track = element('div', 'chart-track');
            track.style.setProperty('--bar-height', `${bucket.amount / max * 80}%`);
            const bar = element('div', 'chart-bar');
            track.title = `${bucket.hour}:00 · ${money(bucket.amount)}`;
            if (bucket.amount === max) track.append(element('span', 'chart-value', money(bucket.amount)));
            track.append(bar); column.append(track, element('small', '', `${bucket.hour}:00`)); $('salesChart').append(column);
        });
        const sold = new Map();
        paid.flatMap(invoice => invoice.items).forEach(item => { const previous = sold.get(item.productId); sold.set(item.productId, { ...item, quantity: (previous?.quantity || 0) + item.quantity }); });
        const best = [...sold.values()].sort((a, b) => b.quantity - a.quantity)[0];
        $('bestSeller').replaceChildren();
        if (best) {
            const image = element('img'); image.src = best.image; image.alt = best.name;
            const details = element('div'); details.append(element('strong', '', best.name), element('p', '', 'El favorito de tus clientes.'), element('span', 'best-count', `${best.quantity} unidades vendidas`));
            $('bestSeller').append(image, details);
        } else $('bestSeller').append(element('p', '', 'Aún no hay ventas pagadas en esta fecha.'));
    }

    function updateCatalogSummary() {
        const visible = products.filter(product => product.active).length;
        $('navProductCount').textContent = products.length;
        $('productCount').textContent = products.length;
        $('productSummary').textContent = `${visible} visibles · ${products.length - visible} ocultos`;
        $('availabilityLabel').textContent = `${visible} de ${products.length} visibles`;
        $('availabilityBar').style.setProperty('--active-width', `${products.length ? visible / products.length * 100 : 0}%`);
        $('catalogSummary').textContent = `${products.length} productos · ${visible} visibles · ${products.length - visible} ocultos.`;
    }

    function renderCatalog(focusId = null) {
        const search = normalize($('productSearch').value.trim());
        const category = $('categoryFilter').value;
        const state = $('visibilityFilter').value;
        const matching = products.filter(product => (!search || normalize(product.name + ' ' + product.tags.join(' ')).includes(search)) && (!category || product.category === category) && (!state || product.active === (state === 'active')));
        $('productList').replaceChildren();
        $('catalogEmpty').hidden = matching.length !== 0;
        $('catalogResultCount').textContent = `${matching.length} de ${products.length} productos`;
        matching.forEach(product => {
            const row = element('article', 'product-row' + (product.active ? '' : ' is-inactive'));
            const identity = element('div', 'product-identity');
            const image = element('img', 'product-thumbnail'); image.src = product.image; image.alt = product.name; image.loading = 'lazy';
            const details = element('div', 'product-details');
            const title = element('h4', '', product.name); title.id = 'product-title-' + product.id;
            row.setAttribute('aria-labelledby', title.id);
            details.append(title, element('p', '', product.category));
            details.append(element('p', 'product-description', product.description));
            const tags = element('div', 'product-tags'); product.tags.forEach(tag => tags.append(element('span', '', tag))); details.append(tags);
            identity.append(image, details);
            const toggle = element('div', 'product-toggle');
            const label = element('label', 'switch');
            const input = element('input'); input.type = 'checkbox'; input.checked = product.active; input.id = 'product-toggle-' + product.id;
            input.setAttribute('role', 'switch'); input.setAttribute('aria-label', 'Mostrar ' + product.name);
            input.addEventListener('change', () => {
                product.active = input.checked;
                updateCatalogSummary(); renderCatalog(product.id);
                showToast(product.active ? 'Producto visible' : 'Producto oculto', `${product.name}: cambio aplicado solo en este catálogo de prueba.`);
            });
            label.append(input, element('span', 'switch-track')); toggle.append(label, element('span', '', product.active ? 'Visible' : 'Oculto'));
            const edit = element('button', 'icon-button'); edit.type = 'button'; edit.setAttribute('aria-label', 'Editar ' + product.name); edit.append(icon('edit')); edit.addEventListener('click', () => editProduct(product));
            row.append(identity, element('span', 'product-price', money(product.price)), toggle, edit); $('productList').append(row);
        });
        if (focusId !== null) {
            const toggle = $('product-toggle-' + focusId);
            if (toggle) toggle.focus({ preventScroll: true });
            else $('visibilityFilter').focus({ preventScroll: true });
        }
    }

    function tagsFromInput() { return [...new Set($('productTags').value.split(',').map(tag => tag.trim()).filter(Boolean))]; }
    function updatePreview() {
        $('previewName').textContent = $('productName').value.trim() || 'Nombre de tu producto';
        $('previewCategory').textContent = $('productCategory').value;
        $('previewDescription').textContent = $('productDescription').value.trim() || 'Aquí aparecerá la descripción que hará que tus clientes quieran probarlo.';
        const price = $('productPrice').valueAsNumber;
        $('previewPrice').textContent = money(Number.isFinite(price) && price >= 0 ? price : 0);
        $('descriptionCount').textContent = `${$('productDescription').value.length} / 280`;
        $('previewTags').replaceChildren();
        const tags = tagsFromInput();
        (tags.length ? tags.slice(0, 8) : ['Ingredientes y etiquetas']).forEach(tag => $('previewTags').append(element('span', '', tag)));
        $('previewImage').hidden = !selectedImage;
        $('previewImageEmpty').hidden = !!selectedImage;
        if (selectedImage) $('previewImage').src = selectedImage;
        else $('previewImage').removeAttribute('src');
        const active = $('productActive').checked;
        $('previewState').textContent = active ? 'Visible' : 'Oculto';
        $('previewState').className = 'preview-state ' + (active ? 'is-visible' : 'is-hidden');
        $('formAvailabilityLabel').textContent = active ? 'Visible en el catálogo' : 'Oculto en el catálogo';
    }

    async function readImage(file) {
        const version = ++imageReadVersion;
        imageLoading = false;
        $('imageError').hidden = true;
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
        if (!file || !allowed.includes(file.type) || file.size > 5 * 1024 * 1024) {
            $('imageError').textContent = 'Elige una imagen JPG, PNG, WEBP o AVIF de hasta 5 MB.';
            $('imageError').hidden = false; $('productImage').value = ''; return;
        }
        imageLoading = true;
        $('imageFileName').textContent = 'Preparando fotografía…';
        try {
            const data = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
            const image = new Image(); image.src = data;
            await image.decode();
            if (version !== imageReadVersion) return;
            selectedImage = data;
            $('imageError').hidden = true;
            $('imageFileName').textContent = file.name;
            updatePreview();
        } catch (_) {
            if (version !== imageReadVersion) return;
            $('imageError').textContent = 'No pudimos abrir esa imagen. Prueba con otra fotografía.';
            $('imageError').hidden = false; $('productImage').value = '';
            $('imageFileName').textContent = selectedImage ? 'Se conserva la fotografía anterior.' : 'Selecciona otra fotografía.';
        } finally {
            if (version === imageReadVersion) imageLoading = false;
        }
    }

    function resetForm() {
        imageReadVersion++; imageLoading = false;
        $('productForm').reset(); editingId = null; selectedImage = '';
        $('imageError').hidden = true;
        $('imageFileName').textContent = 'JPG, PNG, WEBP o AVIF · hasta 5 MB';
        $('formTitle').textContent = 'Agregar un producto';
        $('saveProductLabel').textContent = 'Agregar producto';
        $('resetForm').textContent = 'Limpiar';
        ['productName', 'productDescription', 'productTags'].forEach(id => $(id).setCustomValidity(''));
        updatePreview();
    }
    function editProduct(product) {
        resetForm(); editingId = product.id; selectedImage = product.image;
        $('productName').value = product.name; $('productDescription').value = product.description;
        $('productCategory').value = product.category; $('productPrice').value = product.price;
        $('productTags').value = product.tags.join(', '); $('productActive').checked = product.active;
        $('formTitle').textContent = 'Editar producto'; $('saveProductLabel').textContent = 'Guardar cambios'; $('resetForm').textContent = 'Cancelar edición';
        $('imageFileName').textContent = 'Fotografía actual · puedes reemplazarla';
        updatePreview(); $('nuevoProducto').scrollIntoView({ behavior: 'smooth', block: 'start' }); $('productName').focus({ preventScroll: true });
    }

    $('reportDate').value = today;
    $('reportDate').addEventListener('change', () => { if (!$('reportDate').value) $('reportDate').value = today; renderReport(); });
    $('todayButton').addEventListener('click', () => { $('reportDate').value = today; renderReport(); });
    $('reviewInactive').addEventListener('click', () => {
        $('productSearch').value = ''; $('categoryFilter').value = ''; $('visibilityFilter').value = 'inactive';
        renderCatalog(); $('catalogoAdmin').scrollIntoView({ behavior: 'smooth' });
    });
    $('closeToast').addEventListener('click', () => { $('adminToast').hidden = true; });
    $('productSearch').addEventListener('input', () => renderCatalog());
    ['categoryFilter', 'visibilityFilter'].forEach(id => $(id).addEventListener('change', () => renderCatalog()));
    $('productForm').addEventListener('input', event => { if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity(''); updatePreview(); });
    $('productForm').addEventListener('change', updatePreview);
    $('resetForm').addEventListener('click', resetForm);
    $('chooseImage').addEventListener('click', () => $('productImage').click());
    $('productImage').addEventListener('change', event => { if (event.target.files[0]) readImage(event.target.files[0]); });
    ['dragenter', 'dragover'].forEach(type => $('imageDropzone').addEventListener(type, event => { event.preventDefault(); $('imageDropzone').classList.add('is-dragging'); }));
    ['dragleave', 'drop'].forEach(type => $('imageDropzone').addEventListener(type, event => { event.preventDefault(); $('imageDropzone').classList.remove('is-dragging'); }));
    $('imageDropzone').addEventListener('drop', event => { if (event.dataTransfer.files[0]) readImage(event.dataTransfer.files[0]); });
    document.querySelectorAll('[data-tag]').forEach(button => button.addEventListener('click', () => {
        const tags = tagsFromInput();
        if (tags.length < 8 && !tags.some(tag => normalize(tag) === normalize(button.dataset.tag))) tags.push(button.dataset.tag);
        $('productTags').value = tags.join(', '); $('productTags').setCustomValidity(''); updatePreview();
    }));
    $('productForm').addEventListener('submit', event => {
        event.preventDefault();
        const name = $('productName').value.trim(); const description = $('productDescription').value.trim(); const tags = tagsFromInput();
        $('productName').setCustomValidity(name.length < 3 ? 'Escribe un nombre de al menos 3 caracteres.' : '');
        $('productDescription').setCustomValidity(description.length < 5 ? 'Escribe una descripción de al menos 5 caracteres.' : '');
        $('productTags').setCustomValidity(tags.length > 8 || tags.some(tag => tag.length > 24) ? 'Usa hasta 8 etiquetas de 24 caracteres como máximo.' : '');
        if (!$('productForm').reportValidity()) return;
        if (imageLoading) { $('imageError').textContent = 'Espera a que termine de cargar la fotografía.'; $('imageError').hidden = false; return; }
        if (!selectedImage) { $('imageError').textContent = 'Agrega una fotografía para completar el producto.'; $('imageError').hidden = false; $('chooseImage').focus(); return; }
        const wasEditing = editingId !== null;
        const product = { id: editingId ?? Math.max(0, ...products.map(item => item.id)) + 1, name, description, price: Number($('productPrice').value), category: $('productCategory').value, tags, active: $('productActive').checked, image: selectedImage };
        if (wasEditing) products = products.map(item => item.id === editingId ? product : item);
        else products.unshift(product);
        $('productSearch').value = ''; $('categoryFilter').value = ''; $('visibilityFilter').value = '';
        updateCatalogSummary(); renderCatalog(); resetForm();
        showToast(wasEditing ? 'Cambios guardados con éxito' : '¡Producto agregado con éxito!', `${product.name} ya aparece en este panel. Guardado de demostración; la conexión a la base de datos está pendiente.`);
    });
    document.querySelectorAll('.side-nav a').forEach(link => link.addEventListener('click', () => {
        document.querySelectorAll('.side-nav a').forEach(item => { item.classList.toggle('is-current', item === link); if (item === link) item.setAttribute('aria-current', 'location'); else item.removeAttribute('aria-current'); });
    }));
    renderReport(); updateCatalogSummary(); renderCatalog(); updatePreview();
})();
