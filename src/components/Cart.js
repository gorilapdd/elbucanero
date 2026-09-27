import { getCart, updateQuantity, removeItem, getTotal } from "../utils/cart.js";
import { formatPrice } from "../utils/pricing.js";
import { getWhatsappOrderUrl } from "../utils/whatsapp.js";
import { describeCustomBurgerLines, describeAddOnLines } from "../utils/customization.js";

function renderItemDetailLines(item) {
  let lines = [];
  if (item.customization) lines = describeCustomBurgerLines(item.customization);
  else if (item.addOns) lines = describeAddOnLines(item.addOns);

  if (lines.length === 0) return "";
  return `<p class="cart-item-custom">${lines.join(" · ")}</p>`;
}

// Pinta (o vacía) el panel del carrito dentro de `root`.
// Si `isOpen` es false, el panel se limpia y no se muestra nada.
export function renderCart(root, { isOpen, onClose }) {
  root.innerHTML = "";
  if (!isOpen) return;

  const cart = getCart();
  const empty = cart.length === 0;

  const overlay = document.createElement("div");
  overlay.className = "cart-overlay open";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Tu pedido");

  overlay.innerHTML = `
    <div class="cart-panel">
      <div class="cart-header">
        <h2>Tu pedido</h2>
        <button class="modal-close" type="button" aria-label="Cerrar carrito">✕</button>
      </div>
      <div class="cart-items">
        ${empty ? `<p class="cart-empty">Tu carrito está vacío.<br />Agregá algo delicioso 🍔</p>` : ""}
      </div>
      ${
        empty
          ? ""
          : `
        <div class="cart-footer">
          <div class="cart-total-row">
            <span>TOTAL</span>
            <span id="cart-total-amount">${formatPrice(getTotal())}</span>
          </div>
          <button class="order-btn" id="order-btn" type="button">Realizar pedido</button>
          <p class="whatsapp-hint" id="whatsapp-hint" hidden>
            Falta configurar el número de WhatsApp en <code>src/data/config.js</code> para poder enviar el pedido.
          </p>
        </div>
      `
      }
    </div>
  `;

  const itemsContainer = overlay.querySelector(".cart-items");

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-item-info">
        <p class="cart-item-name">${item.quantity}x ${item.name}</p>
        ${renderItemDetailLines(item)}
        <p class="cart-item-price">${formatPrice(item.unitPrice * item.quantity)}</p>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" data-action="dec" type="button" aria-label="Disminuir cantidad de ${item.name}">-</button>
        <span class="qty-value">${item.quantity}</span>
        <button class="qty-btn" data-action="inc" type="button" aria-label="Aumentar cantidad de ${item.name}">+</button>
        <button class="remove-btn" data-action="remove" type="button" aria-label="Eliminar ${item.name} del carrito">🗑</button>
      </div>
    `;

    row.querySelector('[data-action="dec"]').addEventListener("click", () => {
      if (item.quantity <= 1) {
        removeItem(item.id);
      } else {
        updateQuantity(item.id, item.quantity - 1);
      }
    });

    row.querySelector('[data-action="inc"]').addEventListener("click", () => {
      updateQuantity(item.id, item.quantity + 1);
    });

    row.querySelector('[data-action="remove"]').addEventListener("click", () => {
      removeItem(item.id);
    });

    itemsContainer.appendChild(row);
  });

  overlay.querySelector(".modal-close").addEventListener("click", onClose);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) onClose();
  });

  const orderBtn = overlay.querySelector("#order-btn");
  if (orderBtn) {
    orderBtn.addEventListener("click", () => {
      const url = getWhatsappOrderUrl(cart);
      if (!url) {
        overlay.querySelector("#whatsapp-hint").hidden = false;
        return;
      }
      window.open(url, "_blank");
    });
  }

  root.appendChild(overlay);
}
