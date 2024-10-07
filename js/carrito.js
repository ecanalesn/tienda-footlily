// Recupera los productos en el carrito desde el almacenamiento local
let productosEnCarrito = localStorage.getItem("productos-en-carrito");
// Convierte la cadena JSON de los productos en un objeto JavaScript
productosEnCarrito = JSON.parse(productosEnCarrito);

// Selección de elementos del DOM para mostrar el estado del carrito
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
// Selecciona los botones de eliminación de productos
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
// Selección del botón para vaciar el carrito
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
// Selección del elemento para mostrar el total
const contenedorTotal = document.querySelector("#total");
// Selección del botón para comprar
const botonComprar = document.querySelector("#carrito-acciones-comprar");

// Función para cargar los productos en el carrito
function cargarProductosCarrito() {
    // Verifica si hay productos en el carrito
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        // Muestra el contenedor de productos y oculta el de carrito vacío
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
        
        // Limpia el contenedor de productos del carrito
        contenedorCarritoProductos.innerHTML = "";

        // Recorre todos los productos que están en el carrito y los añade
        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.articulo}">
                <div class="carrito-producto-articulo">
                    <small>Producto</small>
                    <h3>${producto.articulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>${producto.precio} €</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>${producto.precio * producto.cantidad} €</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
            // Añade el producto al contenedor del carrito
            contenedorCarritoProductos.append(div);
        });

        // Actualiza los botones de eliminar y el total del carrito
        actualizarBotonesEliminar();
        actualizarTotal();
        
    } else {
        // Si no hay productos, muestra el contenedor del carrito vacío
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

// Llama a la función para cargar los productos al cargar la página
cargarProductosCarrito();

// Función para actualizar los botones de eliminación
function actualizarBotonesEliminar() {
    // Selecciona todos los botones de eliminar productos
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    // Añade un evento a cada botón para eliminar el producto
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(e) {
    // Muestra una notificación de que el producto ha sido eliminado
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, // Previene el cierre al pasar el raton
        style: {
          background: "white",
          color: "black",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // Eje horizontal
            y: '1.5rem' // Eje vertical
          },
        onClick: function(){} // Se ejecuta la funcion después de hacer clic (en este caso vacia)
    }).showToast();

    // Obtiene el ID del botón en el que se hizo clic
    const idBoton = e.currentTarget.id;
    // Encuentra el índice del producto que se va a eliminar
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    // Elimina el producto del carrito
    productosEnCarrito.splice(index, 1);
    // Carga nuevamente los productos en el carrito
    cargarProductosCarrito();

    // Actualiza el almacenamiento local con los productos restantes
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

// Añade un evento al botón para vaciar el carrito
botonVaciar.addEventListener("click", vaciarCarrito);

// Función para vaciar el carrito
function vaciarCarrito() {
    // Muestra una alerta de confirmación antes de vaciar el carrito
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        customClass: {
            confirmButton: 'boton-confirmar', 
            cancelButton: 'boton-cancelar'
        }
    }).then((result) => {
        // Si se confirma, vacía el carrito
        if (result.isConfirmed) {
            productosEnCarrito.length = 0; // Reinicia el array
            // Actualiza el almacenamiento local
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            // Carga los productos del carrito nuevamente
            cargarProductosCarrito();
        }
    });
}

// Función para calcular y mostrar el total del carrito
function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    // Actualiza el elemento que muestra el total
    contenedorTotal.innerText = `${totalCalculado} €`;
}

// Añade un evento al botón de comprar
botonComprar.addEventListener("click", comprarCarrito);

// Función para procesar la compra
function comprarCarrito() {
    // Vacía el carrito al confirmar la compra
    productosEnCarrito.length = 0;
    // Actualiza el almacenamiento local
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    
    // Cambia la visibilidad de los contenedores del carrito
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled"); // Muestra la confirmación de compra
}
