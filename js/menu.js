// Selecciona el botón de abrir menú en el DOM
const openMenu = document.querySelector("#open-menu");

// Selecciona el botón de cerrar menú en el DOM
const closeMenu = document.querySelector("#close-menu");

// Selecciona el elemento 'aside' que contiene el menú
const aside = document.querySelector("aside");

// Añade un evento de click al botón de abrir menú
openMenu.addEventListener("click", () => {
    // Al hacer clic en el botón de abrir, se añade la clase 'aside-visible' para mostrar el menú
    aside.classList.add("aside-visible");
});

// Añade un evento de click al botón de cerrar menú
closeMenu.addEventListener("click", () => {
    // Al hacer clic en el botón de cerrar, se quita la clase 'aside-visible' para ocultar el menú
    aside.classList.remove("aside-visible");
});
