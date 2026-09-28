import { config } from "./config.js";

// =============================================================
// CATEGORÍAS
// =============================================================
export const categories = [
  { id: "hamburguesas", label: "Hamburguesas", emoji: "🍔" },
  { id: "papas", label: "Papas", emoji: "🍟" },
  { id: "bebidas", label: "Bebidas", emoji: "🥤" },
];

const smashStepper = config.customBurger.steppers.find((s) => s.id === "smash");
const cheddarStepper = config.customBurger.steppers.find((s) => s.id === "cheddar");

// =============================================================
// PRODUCTOS
// =============================================================
// ⚠️ ESTOS SON PRODUCTOS DE DEMOSTRACIÓN, únicamente para que la
// aplicación funcione de punta a punta. Tiago va a reemplazar
// esta información por la carta real.
//
// Estructura de un producto:
// {
//   id, name, description, price, category,
//   image: "/assets/images/x.svg",
//   customizable: false,   // true solo para la hamburguesa personalizada
//   allowsExtras: false,   // true si se le puede agregar ingredientes extra
//                          // (ej. "un smash más") sin pasar por el configurador completo
// }
export const products = [
  {
    id: "barbacoa",
    name: "La Barbacoa",
    description: "Doble smash, cheddar x4, cebolla y salsa barbacoa. (DEMO)",
    price: 250,
    category: "hamburguesas",
    image: "assets/images/placeholder-burger.svg",
    customizable: false,
    allowsExtras: true,
  },
  {
    id: "personalizada",
    name: "Hamburguesa Personalizada",
    description: `Armá tu propia hamburguesa. Base incluida: ${smashStepper.base} smash, ${cheddarStepper.base} cheddar, cebolla y barbacoa.`,
    price: config.customBurger.basePrice,
    category: "hamburguesas",
    image: "assets/images/placeholder-burger.svg",
    customizable: true,
  },
  {
    id: "papas-clasicas",
    name: "Papas Clásicas",
    description: "Papas fritas crocantes con sal de la casa. (DEMO)",
    price: 150,
    category: "papas",
    image: "assets/images/placeholder-fries.svg",
    customizable: false,
  },
  {
    id: "gaseosa",
    name: "Gaseosa 500ml",
    description: "A elección del cliente. (DEMO)",
    price: 100,
    category: "bebidas",
    image: "assets/images/placeholder-drink.svg",
    customizable: false,
  },
];
