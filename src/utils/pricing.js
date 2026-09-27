import { config } from "../data/config.js";

function sumSteppersCost(steppers, quantities) {
  return steppers.reduce((total, stepper) => {
    const qty = quantities[stepper.id] || 0;
    return total + qty * stepper.extraPrice;
  }, 0);
}

function sumTogglesCost(toggles, selections) {
  return toggles.reduce((total, toggle) => {
    return selections[toggle.id] ? total + toggle.extraPrice : total;
  }, 0);
}

// =============================================================
// PRECIO DE LA HAMBURGUESA PERSONALIZADA
// =============================================================
// - Sacar algo que viene incluido en la base -> NO descuenta nada.
// - Agregar más cantidad de la que trae la base (smash/cheddar), o
//   prender un ingrediente que NO viene incluido -> SÍ suma su precio.
// - El resultado nunca es menor a `basePrice`.
//
//   precioFinal = basePrice + extras_por_encima_de_la_base
//   precioFinal >= basePrice   (siempre)
// =============================================================
export function calculateCustomBurgerPrice(customization) {
  const { basePrice, steppers, toggles } = config.customBurger;

  // Solo cuenta como "extra" la cantidad que supera la base. Si el
  // cliente bajó la cantidad, esto da 0 y no genera ningún descuento.
  const extraStepperQuantities = {};
  steppers.forEach((stepper) => {
    const current = customization[stepper.id] ?? stepper.base;
    extraStepperQuantities[stepper.id] = Math.max(0, current - stepper.base);
  });

  // Solo cuenta como "extra" un toggle que está prendido Y que no
  // viene incluido en la base.
  const extraToggleSelections = {};
  toggles.forEach((toggle) => {
    const isOn = customization[toggle.id] ?? toggle.includedInBase;
    extraToggleSelections[toggle.id] = isOn && !toggle.includedInBase;
  });

  let total = basePrice;
  total += sumSteppersCost(steppers, extraStepperQuantities);
  total += sumTogglesCost(toggles, extraToggleSelections);

  // Cinturón de seguridad: nunca por debajo del precio base.
  return Math.max(total, basePrice);
}

// =============================================================
// PRECIO DE EXTRAS SOBRE UN PRODUCTO YA ARMADO DEL MENÚ
// =============================================================
// Acá no existe el concepto de "base": todo lo que el cliente elige
// es una suma directa. Se usa el mismo catálogo de ingredientes que
// la hamburguesa personalizada (config.customBurger), para que agregar
// "un smash más" a una hamburguesa del menú cueste lo mismo que en el
// configurador.
export function calculateAddOnsPrice(selections) {
  if (!selections) return 0;
  const { steppers, toggles } = config.customBurger;
  return sumSteppersCost(steppers, selections) + sumTogglesCost(toggles, selections);
}

export function formatPrice(amount) {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `${config.currencySymbol}${Math.round(safeAmount)}`;
}
