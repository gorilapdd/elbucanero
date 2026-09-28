import { config } from "../data/config.js";

// =============================================================
// SELECTOR DE INGREDIENTES (reutilizable)
// =============================================================
// Renderiza los "steppers" (Smash, Cheddar) y los ingredientes de
// tipo sí/no como chips tocables, usando siempre el mismo catálogo
// definido en config.customBurger.
//
// mode: "base"  -> arranca en la configuración de la base (para la
//                  hamburguesa personalizada): steppers en su cantidad
//                  base, toggles prendidos si `includedInBase`.
// mode: "addon" -> arranca en cero (para agregarle extras a un
//                  producto ya armado del menú): todo apagado/en 0.
//
// Devuelve { element, getState, onChange } para que el componente
// que lo usa pueda insertar `element` en el DOM, leer el estado
// actual con `getState()`, y reaccionar a cambios con `onChange(cb)`.
export function createIngredientPicker({ mode }) {
const { steppers, toggles: allToggles } = config.customBurger;

const addonIngredientIds = [
  "huevo",
  "pepinillos",
  "cebolla",
  "tomate",
  "lechuga",
];

const toggles =
  mode === "addon"
    ? allToggles.filter((toggle) => addonIngredientIds.includes(toggle.id))
    : allToggles;
      const state = {};

  steppers.forEach((stepper) => {
    state[stepper.id] = mode === "base" ? stepper.base : 0;
  });
  toggles.forEach((toggle) => {
    state[toggle.id] = mode === "base" ? toggle.includedInBase : false;
  });

  const container = document.createElement("div");
  container.className = "ingredient-picker";

const steppersToShow = steppers;

const steppersHtml = steppersToShow
  .map(
    (stepper) => `
      <div class="config-row">
        <span class="config-label">${stepper.emoji} ${stepper.label}</span>
        <div class="stepper">
          <button class="qty-btn" data-field="${stepper.id}" data-delta="-1" type="button" aria-label="Quitar ${stepper.label}">-</button>
          <span class="stepper-value" data-field="${stepper.id}">${state[stepper.id]}</span>
          <button class="qty-btn" data-field="${stepper.id}" data-delta="1" type="button" aria-label="Agregar ${stepper.label}">+</button>
        </div>
      </div>
    `
  )
  .join("");

  const chipsHtml = `
    <div class="ingredient-chips">
      ${toggles
        .map(
          (toggle) => `
        <button
          type="button"
          class="ingredient-chip${state[toggle.id] ? " active" : ""}"
          data-toggle="${toggle.id}"
          aria-pressed="${state[toggle.id] ? "true" : "false"}"
        >
          <span aria-hidden="true">${toggle.emoji}</span> ${toggle.label}
        </button>
      `
        )
        .join("")}
    </div>
  `;

  container.innerHTML = steppersHtml + chipsHtml;

  function clamp(field, value) {
    const stepper = steppers.find((s) => s.id === field);
    if (!stepper) return value;
    return Math.max(0, Math.min(stepper.max, value));
  }

  let onChangeCallback = () => {};

  container.querySelectorAll(".qty-btn[data-field]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const field = btn.dataset.field;
      const delta = Number(btn.dataset.delta);
      state[field] = clamp(field, state[field] + delta);
      container.querySelector(`.stepper-value[data-field="${field}"]`).textContent = state[field];
      onChangeCallback({ ...state });
    });
  });

  container.querySelectorAll(".ingredient-chip[data-toggle]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const field = chip.dataset.toggle;
      state[field] = !state[field];
      chip.classList.toggle("active", state[field]);
      chip.setAttribute("aria-pressed", state[field] ? "true" : "false");
      onChangeCallback({ ...state });
    });
  });

  return {
    element: container,
    getState: () => ({ ...state }),
    onChange: (callback) => {
      onChangeCallback = callback;
    },
  };
}
