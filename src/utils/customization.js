import { config } from "../data/config.js";

// =============================================================
// DESCRIPCIONES LEGIBLES DE UNA CONFIGURACIÓN
// =============================================================
// Se usan tanto en el carrito como en el mensaje de WhatsApp, para
// no duplicar esta lógica en cada lugar.

// Hamburguesa personalizada: siempre muestra las cantidades de los
// steppers, y de los toggles solo lo que sea relevante para el
// cliente (lo que sacó de la base, o lo que agregó de más).
export function describeCustomBurgerLines(customization) {
  if (!customization) return [];
  const { steppers, toggles } = config.customBurger;
  const lines = [];

  steppers.forEach((stepper) => {
    const qty = customization[stepper.id] ?? stepper.base;
    lines.push(`${qty} ${stepper.label.toLowerCase()}`);
  });

  toggles.forEach((toggle) => {
    const isOn = customization[toggle.id] ?? toggle.includedInBase;
    if (toggle.includedInBase && !isOn) {
      lines.push(`Sin ${toggle.label.toLowerCase()}`);
    } else if (!toggle.includedInBase && isOn) {
      lines.push(`+ ${toggle.label}`);
    } else if (toggle.includedInBase && isOn) {
      lines.push(toggle.label);
    }
    // si no viene en la base y está apagado, no se menciona (es el default)
  });

  return lines;
}

// Extras sobre un producto ya armado del menú: solo se listan los
// ingredientes que el cliente efectivamente eligió agregar.
export function describeAddOnLines(selections) {
  if (!selections) return [];
  const { steppers, toggles } = config.customBurger;
  const lines = [];

  steppers.forEach((stepper) => {
    const qty = selections[stepper.id] || 0;
    if (qty > 0) lines.push(`+ ${qty} ${stepper.label.toLowerCase()}`);
  });

  toggles.forEach((toggle) => {
    if (selections[toggle.id]) lines.push(`+ ${toggle.label}`);
  });

  return lines;
}

export function hasSelectedAddOns(selections) {
  return describeAddOnLines(selections).length > 0;
}
