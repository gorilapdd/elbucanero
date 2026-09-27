import { formatPrice } from "../utils/pricing.js";

// Crea el elemento DOM de una tarjeta de producto.
// `onAdd(product)`  -> agregar directo al carrito (productos simples).
// `onOpen(product)` -> abrir detalle/configurador.
export function createProductCard(product, { onAdd, onOpen }) {
  const card = document.createElement("article");
  card.className = "product-card";

  card.innerHTML = `
    <button class="product-card-image-btn" type="button" aria-label="Ver detalle de ${product.name}">
      <img src="${product.image}" alt="${product.name}" class="product-card-image" loading="lazy" />
    </button>
    <div class="product-card-body">
      <h3 class="product-card-name">${product.name}</h3>
      <p class="product-card-desc">${product.description}</p>
      <div class="product-card-footer">
        <span class="product-card-price">${formatPrice(product.price)}</span>
        <button class="add-btn" type="button" aria-label="Agregar ${product.name} al carrito">+ Agregar</button>
      </div>
    </div>
  `;

  const imageBtn = card.querySelector(".product-card-image-btn");
  const nameEl = card.querySelector(".product-card-name");
  const addBtn = card.querySelector(".add-btn");

  const openDetail = () => onOpen(product);
  imageBtn.addEventListener("click", openDetail);
  nameEl.addEventListener("click", openDetail);

  addBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (product.customizable) {
      // Los productos personalizables siempre pasan por el configurador,
      // nunca se agregan "directo" porque necesitan su configuración.
      onOpen(product);
    } else {
      onAdd(product);
    }
  });

  return card;
}
