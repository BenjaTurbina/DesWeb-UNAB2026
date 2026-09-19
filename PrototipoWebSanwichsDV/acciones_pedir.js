
let carrito = {}; 

function inicializarEventos() {

    // Conectar boton de Filtros
    const btnAplicar = document.getElementById('btnAplicarFiltros');
    if (btnAplicar) {
        btnAplicar.style.transition = 'all 0.4s cubic-bezier(.35,-0.01,.63,.99)';
        btnAplicar.addEventListener('click', manejarFiltros);
    }

    // Conectar la mutacion fluida de los botones y el carrito
    inicializarBotonesCarrito();

    // Conectar boton de Promoción 2x1
    const btnPromo1 = document.getElementById('btnPromo2x1');
    if (btnPromo1) {
        btnPromo1.addEventListener('click', agregarPromo2x1);
    }
}

function manejarFiltros() {
    const btnAplicar = document.getElementById('btnAplicarFiltros');
    const checkboxes = document.querySelectorAll('.Panel_filtro input[type="checkbox"]');
    const productos = document.querySelectorAll('.sandiwch-grid > .col, .pedido-grid > .col');
    
    const filtrosEstanAplicados = btnAplicar.classList.contains('btn-danger');

    if (filtrosEstanAplicados) {
        // MODO: ELIMINAR FILTROS
        checkboxes.forEach(cb => cb.checked = false);
        if (productos.length > 0) {
            productos.forEach(producto => producto.classList.remove('d-none'));
        }
        btnAplicar.classList.remove('btn-danger', 'text-white');
        btnAplicar.classList.add('btn-dark', 'text-dark');
        btnAplicar.textContent = 'Aplicar filtros';
    } else {
        // MODO: APLICAR FILTROS
        const checkboxesMarcados = Array.from(checkboxes).filter(cb => cb.checked);
        if (checkboxesMarcados.length === 0) return;

        const filtrosSeleccionados = checkboxesMarcados.map(cb => {
            const label = document.querySelector(`label[for="${cb.id}"]`);
            return label ? label.textContent.trim().toLowerCase() : "";
        }).filter(texto => texto !== ""); 

        productos.forEach(producto => {
            const badges = producto.querySelectorAll('.badge');
            const etiquetasProducto = Array.from(badges).map(badge => 
                badge.textContent.trim().toLowerCase().replace(/🌱/g, '').trim()
            );

            const cumpleFiltros = filtrosSeleccionados.every(filtro => {
                return etiquetasProducto.some(etiqueta => 
                    etiqueta.includes(filtro) || filtro.includes(etiqueta)
                );
            });

            if (cumpleFiltros) {
                producto.classList.remove('d-none'); 
            } else {
                producto.classList.add('d-none'); 
            }
        });

        btnAplicar.classList.remove('btn-dark', 'text-dark');
        btnAplicar.classList.add('btn-danger', 'text-white');
        btnAplicar.textContent = 'Eliminar filtros';
    }
}

function inicializarBotonesCarrito() {
    const botonesAgregar = document.querySelectorAll('.bloque_producto .btn-dark');

    botonesAgregar.forEach(boton => {
        boton.style.transition = 'width 0.3s ease-in-out, border-radius 0.3s ease-in-out';

        boton.addEventListener('click', function(e) {
            if (this.classList.contains('expandido')) return;

            const tarjeta = this.closest('.card-body');
            const nombre = tarjeta.querySelector('.card-title').textContent.trim();
            const precioTexto = tarjeta.querySelector('p.fw-bold').textContent;
            const precioNumero = parseInt(precioTexto.replace('$', '').replace(/\./g, '').trim());

            this.classList.add('expandido', 'rounded-pill');
            this.classList.remove('rounded-circle');
            
            this.innerHTML = `
                <div class="d-flex align-items-center justify-content-end w-100 h-100" style="padding: 0;">
                    <div class="controles-extra d-flex align-items-center justify-content-start" style="width: 0px; opacity: 0; overflow: hidden; transition: all 0.3s ease-in-out; white-space: nowrap;">
                        <span class="fs-5 lh-1 btn-restar fw-bold text-white d-flex align-items-center justify-content-center h-100" style="cursor: pointer; width: 32px; flex-shrink: 0; user-select: none;">-</span>
                        <span class="fw-bold mb-0 cantidad-texto fs-6 text-white d-flex align-items-center justify-content-center h-100" style="width: 32px; flex-shrink: 0; user-select: none;">1</span>
                    </div>
                    <span class="fs-5 lh-1 btn-sumar fw-bold text-white d-flex align-items-center justify-content-center h-100" style="cursor: pointer; width: 36px; flex-shrink: 0; user-select: none;">+</span>
                </div>
            `;

            const btnSumar = this.querySelector('.btn-sumar');
            const btnRestar = this.querySelector('.btn-restar');
            const textoCantidad = this.querySelector('.cantidad-texto');
            const controlesExtra = this.querySelector('.controles-extra');

            setTimeout(() => {
                this.style.width = '100px'; 
                controlesExtra.style.width = '64px'; 
                controlesExtra.style.opacity = '1';
                
                // Aseguramos que se lea del carrito global
                if(!carrito[nombre]) {
                    carrito[nombre] = { precio: precioNumero, cantidad: 1 };
                }
                textoCantidad.textContent = carrito[nombre].cantidad;
                renderizarCarrito(); 
            }, 10);

            // Botón SUMAR en la Tarjeta
            btnSumar.addEventListener('click', (eventoSumar) => {
                eventoSumar.stopPropagation(); 
                carrito[nombre].cantidad++; // Actualizamos la memoria central
                textoCantidad.textContent = carrito[nombre].cantidad;
                renderizarCarrito();
            });

            // Botón RESTAR en la Tarjeta
            btnRestar.addEventListener('click', (eventoRestar) => {
                eventoRestar.stopPropagation(); 
                if (carrito[nombre].cantidad > 1) {
                    carrito[nombre].cantidad--;
                    textoCantidad.textContent = carrito[nombre].cantidad;
                    renderizarCarrito();
                } else {
                    eliminarDelCarrito(nombre);
                }
            });
        });
    });
}

function agregarPromo2x1() {
    const nombrePromo = "Promo 2x1: Churrasco Italiano";
    const precioPromo = 6500;

    if (carrito[nombrePromo]) {
        carrito[nombrePromo].cantidad++;
    } else {
        carrito[nombrePromo] = { precio: precioPromo, cantidad: 1 };
    }

    renderizarCarrito();

    const elementoCarrito = document.getElementById('carritoOffcanvas');
    if (elementoCarrito) {
        const carritoOffcanvas = bootstrap.Offcanvas.getInstance(elementoCarrito) || new bootstrap.Offcanvas(elementoCarrito);
        carritoOffcanvas.show();
    }
}

function renderizarCarrito() {
    const contenedor = document.getElementById('contenido-carrito');
    const totalElemento = document.querySelector('.offcanvas-body .mt-auto span:last-child');
    
    // Contador del carrito
    const badgeCarrito = document.getElementById('contador-carrito'); 
    let totalItems = 0; // Contador de la cantidad de productos

    // Si borraron todo se indica
    if (Object.keys(carrito).length === 0) {
        contenedor.innerHTML = '<p class="text-muted text-center mt-5">Tu carrito está vacío.</p>';
        totalElemento.textContent = '$ 0';
        
        // Si no hay productos, ocultamos el circulo rojo
        if (badgeCarrito) badgeCarrito.classList.add('d-none');
        return;
    }

    let htmlCarrito = '';
    let totalPrecio = 0;

    // Recorremos cada producto guardado en la memoria
    for (const [nombre, datos] of Object.entries(carrito)) {
        const subtotal = datos.precio * datos.cantidad;
        totalPrecio += subtotal;
        
        // Sumamos la cantidad de este sándwich al total general
        totalItems += datos.cantidad; 
        
        htmlCarrito += `
            <div class="d-flex flex-column mb-3 pb-3 border-bottom">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="mb-0 fw-bold lh-sm pe-2">${nombre}</h6>
                    <span class="fw-bold text-nowrap">$ ${subtotal.toLocaleString('es-CL')}</span>
                </div>
                
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center border rounded-pill bg-light shadow-sm" style="width: 85px; height: 32px; justify-content: space-between;">
                        <span class="fw-bold text-dark px-2 fs-5 lh-1 btn-restar-carrito" data-nombre="${nombre}" style="cursor: pointer; user-select: none;">-</span>
                        <span class="fw-bold text-dark fs-6">${datos.cantidad}</span>
                        <span class="fw-bold text-dark px-2 fs-5 lh-1 btn-sumar-carrito" data-nombre="${nombre}" style="cursor: pointer; user-select: none;">+</span>
                    </div>
                    
                    <button class="btn btn-sm text-danger p-0 btn-eliminar-item" data-nombre="${nombre}" aria-label="Eliminar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    // Inyecccion del HTML en los productos
    contenedor.innerHTML = htmlCarrito;
    totalElemento.textContent = '$ ' + totalPrecio.toLocaleString('es-CL');

    // Mostramos el circulo rojo
    if (badgeCarrito) {
        badgeCarrito.textContent = totalItems;
        badgeCarrito.classList.remove('d-none'); // Quita la clase que lo ocultaba
    }

    // Acciones de escucha
    contenedor.querySelectorAll('.btn-eliminar-item').forEach(boton => {
        boton.addEventListener('click', function() {
            eliminarDelCarrito(this.getAttribute('data-nombre'));
        });
    });

    contenedor.querySelectorAll('.btn-sumar-carrito').forEach(boton => {
        boton.addEventListener('click', function() {
            const nombre = this.getAttribute('data-nombre');
            carrito[nombre].cantidad++;
            sincronizarBotonTarjeta(nombre, carrito[nombre].cantidad);
            renderizarCarrito();
        });
    });

    contenedor.querySelectorAll('.btn-restar-carrito').forEach(boton => {
        boton.addEventListener('click', function() {
            const nombre = this.getAttribute('data-nombre');
            if (carrito[nombre].cantidad > 1) {
                carrito[nombre].cantidad--;
                sincronizarBotonTarjeta(nombre, carrito[nombre].cantidad);
                renderizarCarrito(); 
            } else {
                eliminarDelCarrito(nombre);
            }
        });
    });
}

function sincronizarBotonTarjeta(nombre, nuevaCantidad) {
    const tarjetas = document.querySelectorAll('.card-body');
    tarjetas.forEach(tarjeta => {
        const tituloElemento = tarjeta.querySelector('.card-title');
        if (tituloElemento && tituloElemento.textContent.trim() === nombre) {
            const textoCantidad = tarjeta.parentElement.querySelector('.cantidad-texto');
            if (textoCantidad) {
                textoCantidad.textContent = nuevaCantidad;
            }
        }
    });
}

function eliminarDelCarrito(nombre) {
    delete carrito[nombre];
    renderizarCarrito();

    // Visual del boton en la tarjeta de la tienda
    const tarjetas = document.querySelectorAll('.card-body');
    tarjetas.forEach(tarjeta => {
        const tituloElemento = tarjeta.querySelector('.card-title');
        
        if (tituloElemento && tituloElemento.textContent.trim() === nombre) {
            const botonExpandido = tarjeta.parentElement.querySelector('.btn-dark.expandido');
            
            if (botonExpandido) {
                botonExpandido.style.width = '36px';
                botonExpandido.classList.remove('expandido', 'rounded-pill');
                botonExpandido.classList.add('rounded-circle');
                
                setTimeout(() => {
                    botonExpandido.innerHTML = `<span class="fs-5 lh-1 mb-0">+</span>`;
                }, 300);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', inicializarEventos);