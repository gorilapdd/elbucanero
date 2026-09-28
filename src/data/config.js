// =============================================================
// CONFIGURACIÓN CENTRAL — EL BUCANERO
// =============================================================
// Este es el único archivo que necesitás tocar para los ajustes
// más comunes del negocio: nombre, WhatsApp, precio base de la
// hamburguesa personalizada y precio de cada ingrediente.
//
// Los valores marcados como "PENDIENTE" deben ser reemplazados
// por Tiago con la información real. Mientras tanto, la app
// funciona con esos valores en $0 (no rompen la lógica de precios,
// simplemente ese ingrediente todavía no suma nada).
// =============================================================

export const config = {
  businessName: "El Bucanero",

  // PENDIENTE: número de WhatsApp en formato internacional, SIN "+" ni espacios.
  // Ejemplo Uruguay: "59899123456"
  whatsappNumber: "59892996576",

  currencySymbol: "$",

  // ------------------------------------------------------------
  // HAMBURGUESA PERSONALIZADA
  // ------------------------------------------------------------
  // El precio base ($250) incluye la configuración de "La Barbacoa":
  // 2 smash, 4 cheddar, cebolla y salsa barbacoa (ver `steppers` y
  // `toggles` más abajo: `base` / `includedInBase`).
  //
  // Regla de precio:
  // - Sacar algo que viene incluido en la base -> NO descuenta.
  // - Agregar más de lo que trae la base, o sumar un ingrediente que
  //   no viene incluido -> SÍ suma su `extraPrice`.
  // - El precio final NUNCA es menor a `basePrice`.
  //
  // Este mismo catálogo de ingredientes (steppers + toggles) se usa
  // también para agregarle extras a una hamburguesa YA ARMADA del
  // menú (ej. "quiero La Barbacoa pero con un smash más"): en ese
  // caso no hay "base", cada ingrediente elegido suma su `extraPrice`
  // completo.
  customBurger: {
    basePrice: 250,

    // Ingredientes que se eligen por CANTIDAD.
    steppers: [
      {
        id: "smash",
        label: "Smash",
        emoji: "🍔",
        base: 2, // cantidad incluida en la base de $250
        max: 6,
        extraPrice: 50, // precio de cada smash adicional por encima de la base
      },
      {
        id: "cheddar",
        label: "Cheddar",
        emoji: "🧀",
        base: 4, // cantidad incluida en la base de $250
        max: 8,
        extraPrice: 0, // PENDIENTE — precio de cada cheddar adicional
      },
    ],

    // Ingredientes que se eligen SÍ / NO.
    toggles: [
      { id: "muzza", label: "Muzza", emoji: "🧀", includedInBase: false, extraPrice: 10 }, // PENDIENTE
      { id: "provolone", label: "Provolone", emoji: "🧀", includedInBase: false, extraPrice: 0 }, // PENDIENTE
      { id: "catupiry", label: "Catupiry", emoji: "🧈", includedInBase: false, extraPrice: 0 }, // PENDIENTE
      { id: "bacon", label: "Bacon", emoji: "🥓", includedInBase: false, extraPrice: 0 }, // PENDIENTE
      { id: "huevo", label: "Huevo", emoji: "🍳", includedInBase: false, extraPrice: 0 }, // PENDIENTE
      { id: "lechuga", label: "Lechuga", emoji: "🥬", includedInBase: false, extraPrice: 0 }, // PENDIENTE
      { id: "tomate", label: "Tomate", emoji: "🍅", includedInBase: false, extraPrice: 0 }, // PENDIENTE
      { id: "cebolla", label: "Cebolla", emoji: "🧅", includedInBase: true, extraPrice: 0 },
      { id: "cebolla-caramelizada", label: "Cebolla caramelizada", emoji: "🧅", includedInBase: false, extraPrice: 0 }, // PENDIENTE
      { id: "cebolla-crispy", label: "Cebolla crispy", emoji: "🧅", includedInBase: false, extraPrice: 0 }, // PENDIENTE
      { id: "pepinillos", label: "Pepinillos", emoji: "🥒", includedInBase: false, extraPrice: 0 }, // PENDIENTE
      { id: "ketchup", label: "Ketchup", emoji: "🍅", includedInBase: false, extraPrice: 0 }, // PENDIENTE
      { id: "salsa-casa", label: "Salsa de la Casa", emoji: "🥫", includedInBase: false, extraPrice: 0 }, // PENDIENTE
      { id: "barbacoa", label: "Barbacoa", emoji: "🥫", includedInBase: true, extraPrice: 0 },
    ],
  },

  // ------------------------------------------------------------
  // COLORES (referencia)
  // ------------------------------------------------------------
  // Los colores reales que se aplican están definidos como
  // variables CSS en src/styles.css (bloque :root).
  colors: {
    bgDark: "#15110f",
    bgCard: "#1f1a17",
    accentOrange: "#ff6b35",
    accentGold: "#ffc145",
    cream: "#fff4e6",
  },
};
