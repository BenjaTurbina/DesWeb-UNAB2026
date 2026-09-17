
function inicializarEventos() {
    const btnAplicar = document.getElementById('btnAplicarFiltros');
    if (btnAplicar) {
        btnAplicar.addEventListener('click', aplicarFiltros);
    } else {
        console.error("ERROR: No se encontro el botón con ID correspondiente");
    }
    inicializarBotonesCarrito();
}

function aplicarFiltros() {    
    const checkboxesMarcados = document.querySelectorAll('.Panel_filtro input[type="checkbox"]:checked');
    const filtrosSeleccionados = Array.from(checkboxesMarcados).map(cb => {
        const label = document.querySelector(`label[for="${cb.id}"]`);
        return label ? label.textContent.trim().toLowerCase() : "";
    }).filter(texto => texto !== ""); 
    const productos = document.querySelectorAll('.sandiwch-grid > .col, .pedido-grid > .col');
    if (productos.length === 0) return;

    productos.forEach(producto => {
        if (filtrosSeleccionados.length === 0) {
            producto.classList.remove('d-none');
            return;
        }

        const badges = producto.querySelectorAll('.badge');
        const etiquetasProducto = Array.from(badges).map(badge => 
            badge.textContent.trim().toLowerCase().trim()
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
}

function inicializarBotonesCarrito() {    
    const botonesAgregar = document.querySelectorAll('.bloque_producto .btn-dark');

    botonesAgregar.forEach(boton => {
        boton.style.transition = 'width 0.3s ease-in-out, border-radius 0.3s ease-in-out';
        boton.addEventListener('click', function(e) {
            if (this.classList.contains('expandido')) return;
            this.classList.add('expandido');
            this.classList.remove('rounded-circle');
            this.classList.add('rounded-pill');
    
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

            let cantidad = 1;

            setTimeout(() => {
                this.style.width = '100px'; 
                controlesExtra.style.width = '64px'; 
                controlesExtra.style.opacity = '1';
            }, 10);

            btnSumar.addEventListener('click', (eventoSumar) => {
                eventoSumar.stopPropagation();
                cantidad++;
                textoCantidad.textContent = cantidad;
            });

            btnRestar.addEventListener('click', (eventoRestar) => {
                eventoRestar.stopPropagation(); 
                
                if (cantidad > 1) {
                    cantidad--;
                    textoCantidad.textContent = cantidad;
                } else {
                    this.style.width = '36px';
                    controlesExtra.style.width = '0px'; 
                    controlesExtra.style.opacity = '0';
                    
                    setTimeout(() => {
                        this.classList.remove('expandido', 'rounded-pill');
                        this.classList.add('rounded-circle');
                        this.innerHTML = `<span class="fs-5 lh-1 mb-0">+</span>`;
                    }, 300); 
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', inicializarEventos);