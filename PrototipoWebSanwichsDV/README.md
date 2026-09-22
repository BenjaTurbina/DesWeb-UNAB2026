# SandwichDV - Prototipo E-Commerce (Front-End)

Bienvenido al repositorio de **SandwichDV**, una aplicación web responsiva diseñada para la venta de sándwiches y wraps. Este proyecto es un prototipo Front-End construido para ofrecer una experiencia en dispositivos móviles y de escritorio.

## Tecnologías Utilizadas
* **HTML5**: Estructura semántica.
* **CSS3**: Estilos personalizados y variables de color.
* **Bootstrap 5**: Framework de diseño para el sistema de grillas, carrusel, navbar responsivo, paneles (Offcanvas) y utilidades.
* **JavaScript (Vanilla)**: Lógica de interacción, filtrado y carrito de compras.

---

## Lógica de JavaScript (`acciones_pedir.js`)

El corazón interactivo de la página se maneja a través del archivo `acciones_pedir.js`, el cual centraliza el estado de la aplicación. Aquí se encapsulan las funciones principales de manera sencilla:

### 1. Sistema de Memoria Central
* **`carrito = {}`**: Un objeto global que actúa como la "memoria" temporal de la página. Guarda qué productos elije el usuario, su precio y la cantidad.

### 2. Motor de Filtros (`manejarFiltros`)
* Actúa como un interruptor. Al seleccionar opciones (tipo de pan, proteína, ingredientes) y presionar "Aplicar filtros", el script lee las etiquetas (`badges`) de cada sándwich. Si el producto coincide con lo buscado, se mantiene en pantalla; si no, se oculta. Al volver a presionar el botón, se limpia la búsqueda y muestra todo el menú nuevamente.

### 3. Gestión del Carrito de Compras
* **`inicializarBotonesCarrito()`**: Cambia visualmente el botón "+" de las tarjetas a un selector dinámico de cantidad ("- 1 +") con una transición fluida, agregando el producto a la memoria.
* **`renderizarCarrito()`**: Dibuja dinámicamente el panel lateral (Offcanvas). Multiplica precios, calcula el total general de la compra, y actualiza el **indicador numérico (globo rojo)** en el ícono del carrito en la barra de navegación.
* **`sincronizarBotonTarjeta()` y `eliminarDelCarrito()`**: Mantienen la página conectada. Si sumas, restas o eliminas un producto desde el panel lateral del carrito, el botón original en la tienda se actualiza mágicamente para reflejar esa misma cantidad (o volver a su estado original de "+").

### 4. Inyección de Promociones (`agregarPromo2x1`)
* Permite que los botones del Carrusel principal (ej. "Pedir promoción 2x1") inyecte el producto directamente en el carrito y abran el panel lateral automáticamente para darle retroalimentación visual al usuario.

---

##  Limitaciones y Trabajo Futuro (Back-End)

Este proyecto actualmente es una maqueta de interfaz de usuario (**Front-End**). Esto significa que toda la información vive temporalmente en el navegador del usuario y se borra al recargar la página.

Las siguientes funcionalidades son componentes visuales (**Placeholders**) que están maquetados y listos, pero su lógica de negocio queda destinada para una futura integración con un sistema **Back-End** (bases de datos, servidores de pago, autenticación):

* 💳 **Botón "Ir a pagar" (Carrito)**: Actualmente no procesa pagos. A futuro, debe conectarse a pasarelas de pago como Transbank (Webpay), MercadoPago o Stripe.
* 👤 **"Iniciar Sesión" y "Crear Cuenta"**: Formularios visuales. Requerirán una base de datos (SQL/NoSQL) y un sistema de autenticación (ej. JWT, Firebase o Node.js) para guardar historial de pedidos, direcciones y usuarios reales.
* 📦 **Gestión de Inventario**: Los precios y nombres de los sándwiches y wraps están escritos directamente en el HTML. A futuro, el catálogo se consumirá dinámicamente desde una API.
* ✉️ **Enlaces del Footer**: Los botones de "Trabaja con nosotros", "Contacto" y redes sociales redirigen a enlaces vacíos (`#`) por el momento.

---

## 💻 Cómo visualizar el proyecto

Puedes ver la versión en vivo del prototipo alojada en GitHub Pages haciendo clic en el siguiente enlace:
👉 **[Ver SandwichDV en Vivo](https://benjaturbina.github.io/DesWeb-UNAB2026/PrototipoWebSanwichsDV/Pedir.html)**

*(Si descargas el código fuente, se recomienda abrir el archivo `Pedir.html` utilizando la extensión **Live Server** en Visual Studio Code para el correcto funcionamiento de las importaciones y del sistema responsivo).*
