import { config } from "../data/config.js";
import { calculateCustomBurgerPrice, formatPrice } from "../utils/pricing.js";
import { describeCustomBurgerLines } from "../utils/customization.js";
import { createIngredientPicker } from "./IngredientPicker.js";

// Abre el configurador de la hamburguesa personalizada dentro de `root`.
// `onConfirm({ product, quantity, unitPrice, customization })` se llama
// al agregar al carrito, con el precio ya calculado según la regla:
// nunca puede ser menor a config.customBurger.basePrice.
export function openCustomBurgerConfigurator(root, product, { onConfirm }) {
  root.innerHTML = "";

  const cfg = config.customBurger;
  const picker = createIngredientPicker({ mode: "base" });

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", product.name);

  overlay.innerHTML = `
    <div class="modal-sheet configurator-sheet">
      <button class="modal-close" type="button" aria-label="Cerrar">✕</button>
      <div class="modal-body configurator-body">
        <h2 class="modal-title">${product.name}</h2>
        <p class="configurator-baseprice">Precio base <strong>${formatPrice(cfg.basePrice)}</strong></p>
        <p class="configurator-hint">Podés sacar ingredientes de la base sin costo. Lo que agregues por encima de la base se cobra aparte.</p>

        <div id="picker-slot"></div>

        <div class="config-summary">
          <h3>Tu hamburguesa</h3>
          <ul class="summary-list" id="summary-list"></ul>
        </div>
      </div>
      <div class="modal-footer">
        <span class="modal-total" id="configurator-total">${formatPrice(cfg.basePrice)}</span>
        <button class="confirm-btn" type="button">Agregar al carrito</button>
      </div>
    </div>
  `;

  overlay.querySelector("#picker-slot").appendChild(picker.element);

  function refresh() {
    const state = picker.getState();
    const total = calculateCustomBurgerPrice(state);
    overlay.querySelector("#configurator-total").textContent = formatPrice(total);

    const lines = describeCustomBurgerLines(state);
    overlay.querySelector("#summary-list").innerHTML = lines
      .map((line) => `<li>${line}</li>`)
      .join("");
  }

  picker.onChange(refresh);

  function close() {
    root.innerHTML = "";
  }

  overlay.querySelector(".modal-close").addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });

  overlay.querySelector(".confirm-btn").addEventListener("click", () => {
    const state = picker.getState();
    const unitPrice = calculateCustomBurgerPrice(state);
    onConfirm({
      product,
      quantity: 1,
      unitPrice,
      customization: state,
    });
    close();
  });

  root.appendChild(overlay);
  refresh();
  requestAnimationFrame(() => overlay.classList.add("open"));
}
