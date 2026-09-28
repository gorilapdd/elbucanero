import { config } from "../data/config.js";
import { formatPrice } from "./pricing.js";
import { describeCustomBurgerLines, describeAddOnLines } from "./customization.js";

function itemDetailLines(item) {
  if (item.customization) {
    return describeCustomBurgerLines(item.customization).map((line) => `- ${line}`);
  }
  if (item.addOns) {
    return describeAddOnLines(item.addOns).map((line) => `- ${line}`);
  }
  return [];
}

export function buildOrderMessage(cartItems) {
  const header = `🍔 PEDIDO - ${config.businessName.toUpperCase()}`;
  const divider = "----------------";

  const blocks = cartItems.map((item) => {
    const lines = [
      `${item.quantity}x ${item.name}`,
      ...itemDetailLines(item),
      formatPrice(item.unitPrice * item.quantity),
    ];
    return lines.join("\n");
  });

  const total = cartItems.reduce(
    (sum, it) => sum + it.unitPrice * it.quantity,
    0
  );

  return [header, "", blocks.join("\n\n"), "", divider, `TOTAL: ${formatPrice(total)}`].join("\n");
}

// Devuelve el enlace de WhatsApp listo para abrir, o `null` si
// todavía no se configuró el número (config.whatsappNumber).
export function getWhatsappOrderUrl(cartItems) {
  if (!cartItems || cartItems.length === 0) return null;

  const number = (config.whatsappNumber || "").trim();
  if (!number) {
    return null; // PENDIENTE: falta configurar el número real en config.js
  }

  const message = buildOrderMessage(cartItems);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encodedMessage}`;
}
