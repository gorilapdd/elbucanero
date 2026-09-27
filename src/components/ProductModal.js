import { formatPrice, calculateAddOnsPrice } from "../utils/pricing.js";
import { createIngredientPicker } from "./IngredientPicker.js";

// Abre el modal de detalle de un producto simple dentro de `root`.
// Si `product.allowsExtras` es true, además muestra una sección para
// sumarle ingredientes extra (ej. "un smash más") a ese producto,
// usando el mismo catálogo de ingredientes que la personalizada.
// `onConfirm({ product, quantity, unitPrice, addOns })` se llama al
// agregar al carrito.
export function openProductModal(root, product, { onConfirm }) {
  root.innerHTML = "";

  const showAddOns = Boolean(product.allowsExtras);
  const picker = showAddOns ? createIngredientPicker({ mode: "addon" }) : null;

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", product.name);

  overlay.innerHTML = `
    <div class="modal-sheet">
      <button class="modal-close" type="button" aria-label="Cerrar">✕</button>
      <img src="${product.image}" alt="${product.name}" class="modal-image" />
      <div class="modal-body">
        <h2 class="modal-title">${product.name}</h2>
        <p class="modal-desc">${product.description}</p>
        <div class="qty-selector" role="group" aria-label="Cantidad">
          <button class="qty-btn" data-action="dec" type="button" aria-label="Disminuir cantidad">-</button>
          <span class="qty-value" aria-live="polite">1</span>
          <button class="qty-btn" data-action="inc" type="button" aria-label="Aumentar cantidad">+</button>
        </div>
        ${
          showAddOns
            ? `
          <div class="addons-section">
            <h3 class="addons-title">¿Le agregamos algo más?</h3>
            <div id="addons-slot"></div>
          </div>
        `
            : ""
        }
      </div>
      <div class="modal-footer">
        <span class="modal-total">${formatPrice(product.price)}</span>
        <button class="confirm-btn" type="button">Agregar al carrito</button>
      </div>
    </div>
  `;

  if (picker) {
    overlay.querySelector("#addons-slot").appendChild(picker.element);
  }

  let quantity = 1;
  const totalEl = overlay.querySelector(".modal-total");

  function currentUnitPrice() {
    const addOnsCost = picker ? calculateAddOnsPrice(picker.getState()) : 0;
    return product.price + addOnsCost;
  }

  function refreshTotal() {
    totalEl.textContent = formatPrice(currentUnitPrice() * quantity);
  }

  if (picker) picker.onChange(refreshTotal);

  const qtyValueEl = overlay.querySelector(".qty-value");
  function updateQuantity(delta) {
    quantity = Math.max(1, quantity + delta);
    qtyValueEl.textContent = quantity;
    refreshTotal();
  }

  overlay
    .querySelector('[data-action="dec"]')
    .addEventListener("click", () => updateQuantity(-1));
  overlay
    .querySelector('[data-action="inc"]')
    .addEventListener("click", () => updateQuantity(1));

  function close() {
    root.innerHTML = "";
  }

  overlay.querySelector(".modal-close").addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });

  overlay.querySelector(".confirm-btn").addEventListener("click", () => {
    onConfirm({
      product,
      quantity,
      unitPrice: currentUnitPrice(),
      addOns: picker ? picker.getState() : null,
    });
    close();
  });

  root.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("open"));
}
