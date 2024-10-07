// Inicializa la variable 'productos' como un array vacío
let productos = [];

// Se obtienen los datos del archivo JSON local que contiene los productos
fetch("./js/productos.json")
    .then(response => response.json()) // Convierte la respuesta a formato JSON
    .then(data => {
        productos = data; // Asigna los datos del JSON al array 'productos'
        cargarProductos(productos); // Llama a la función que cargará los productos en la interfaz
    })

// Selecciona los elementos del DOM que se van a usar para mostrar y gestionar los productos
const contenedorProductos = document.querySelector("#contenedor-productos"); 
const botonesCategorias = document.querySelectorAll(".boton-categoria"); 
const tituloPrincipal = document.querySelector("#titulo-principal"); 
let botonesAñadir = document.querySelectorAll(".producto-añadir"); 
const numero = document.querySelector("#numero"); 

// Añade un evento a cada botón de categoría para cerrar el menú cuando se selecciona una categoría
botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible"); 
}))

// Función para cargar los productos en el contenedor
function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = ""; // Vacía el contenedor de productos antes de añadir los nuevos

    // Recorre el array de productos elegidos y los inserta en el DOM
    productosElegidos.forEach(producto => {

        const div = document.createElement("div"); // Crea un div para cada producto
        div.classList.add("producto"); // Añade la clase 'producto' al div
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-articulo">${producto.articulo}</h3>
                <p class="producto-precio">${producto.precio} €</p>
                <button class="producto-añadir" id="${producto.id}">Añadir</button>
            </div>
        `;

        contenedorProductos.append(div); // Añade el producto al contenedor
    })

    actualizarBotonesAñadir(); 
}

// Evento para filtrar productos por categoría cuando se hace clic en un botón de categoría
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active")); 
        e.currentTarget.classList.add("active");

        // Si la categoría seleccionada no es "todos"
        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre; // Cambia el título según la categoría
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id); // Filtra los productos por categoría
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos"; // Si la categoría es "todos", muestra todos los productos
            cargarProductos(productos); 
        }

    })
});

// Función para actualizar los botones de "Añadir" después de cargar los productos
function actualizarBotonesAñadir() {
    botonesAñadir = document.querySelectorAll(".producto-añadir"); // Selecciona todos los botones de "Añadir"

    // Añade el evento 'click' a cada botón de "Añadir" para ejecutar la función 'añadirAlCarrito'
    botonesAñadir.forEach(boton => {
        boton.addEventListener("click", añadirAlCarrito);
    });
}

// Inicializa el array de productos en el carrito
let productosEnCarrito;

// Verifica si hay productos en el carrito guardados en el localStorage
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS); // Si existen, los recupera del localStorage
    actualizarNumero(); // Actualiza el contador de productos en el carrito
} else {
    productosEnCarrito = []; // Si no existen, inicializa el carrito vacío
}

// Función que añade un producto al carrito
function añadirAlCarrito(e) {

    // Muestra una notificación cuando se añade un producto al carrito
    Toastify({ //Añadimos la biblioteca de JS para mostrar notificaciones emergentes
        text: "Artículo añadido",
        duration: 3000, 
        close: true, 
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, // Evita que se cierre cuando se pasa el raton por encima
        style: {
          background: "white",
          color: "black",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem",
          boxShadow: "rgba(0, 0, 0, 0.12) 0px 0px 0px 0px, rgba(12, 12, 14, 0.3) 0px 5px 15px -4px"
        },
        offset: {
            x: '1.5rem', // Desplazamiento horizontal
            y: '1.5rem' // Desplazamiento vertical
          },
        onClick: function(){} // Se ejecuta la funcion después de hacer clic (en este caso vacia)
      }).showToast();

    const idBoton = e.currentTarget.id; 
    const productoAñadido = productos.find(producto => producto.id === idBoton); 

    // Si el producto ya está en el carrito, aumenta su cantidad
    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAñadido.cantidad = 1; // Si no está, lo añade al carrito con cantidad 1
        productosEnCarrito.push(productoAñadido); // Añade el producto al array del carrito
    }

    actualizarNumero(); // Actualiza el número de productos en el carrito

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito)); // Guarda el carrito en el localStorage
}

// Función que actualiza el número de productos en el carrito en la interfaz
function actualizarNumero() {
    let nuevoNumero = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0); // Suma las cantidades de todos los productos en el carrito
    numero.innerText = nuevoNumero; // Actualiza el contador visual en la interfaz
}
