// =============================================================
// ESTADO DEL CARRITO
// =============================================================
// Manejo simple de estado en memoria + persistencia en
// localStorage, con un pequeño sistema de "suscripción" para que
// la UI se vuelva a pintar cuando el carrito cambia.
//
// Cada ítem del carrito tiene esta forma:
// {
//   id: "item-...",            // id único de ESTA línea del carrito
//   productId: "personalizada", // id del producto original
//   name: "Hamburguesa Personalizada",
//   unitPrice: 250,             // precio ya calculado al momento de agregar
//   quantity: 1,
//   customization: { ... } | undefined   // solo para productos personalizables
// }
//
// Dos hamburguesas personalizadas con configuraciones distintas
// se guardan como ítems distintos (nunca se fusionan), porque
// cada una tiene su propio `id` generado con generateCartItemId().
// =============================================================

const STORAGE_KEY = "elbucanero_cart_v1";

let cart = loadCart();
let listeners = [];

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // localStorage no disponible (modo privado, cuota excedida, etc).
    // El carrito sigue funcionando en memoria durante la sesión.
  }
}

function notify() {
  listeners.forEach((fn) => fn(cart));
}

export function subscribe(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((listener) => listener !== fn);
  };
}

export function getCart() {
  return cart;
}

export function addItem(item) {
  if (!item || item.unitPrice < 0 || item.quantity <= 0) return;
  cart = [...cart, item];
  persist();
  notify();
}

export function updateQuantity(cartItemId, quantity) {
  const safeQuantity = Math.max(1, Math.floor(quantity) || 1);
  cart = cart.map((it) =>
    it.id === cartItemId ? { ...it, quantity: safeQuantity } : it
  );
  persist();
  notify();
}

export function removeItem(cartItemId) {
  cart = cart.filter((it) => it.id !== cartItemId);
  persist();
  notify();
}

export function clearCart() {
  cart = [];
  persist();
  notify();
}

export function getItemCount() {
  return cart.reduce((sum, it) => sum + it.quantity, 0);
}

export function getTotal() {
  return cart.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
}

export function generateCartItemId() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
