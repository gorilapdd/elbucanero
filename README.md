# 🏴‍☠️ El Bucanero — Carta Digital

Carta digital moderna e interactiva para la hamburguesería **El Bucanero**.
Pensada mobile-first: el cliente navega categorías, ve productos, personaliza
su hamburguesa (o le agrega extras a una que ya existe en el menú), arma el
carrito y envía el pedido por WhatsApp.

Proyecto construido en **HTML + CSS + JavaScript vanilla** (ES Modules),
servido con **Vite** para que sea fácil de ejecutar, modificar y desplegar.
No hay frameworks pesados: Vite es la única dependencia, y solo se usa como
servidor de desarrollo / empaquetador.

---

## 1. Cómo instalarlo y ejecutarlo

Necesitás [Node.js](https://nodejs.org/) 18 o superior.

```bash
cd el-bucanero
npm install
npm run dev
```

Vite muestra una URL local (normalmente `http://localhost:5173`). Abrila en
el navegador o en el celular (usando la IP que Vite muestra en la terminal)
para ver la carta funcionando.

```bash
npm run build     # genera dist/ lista para subir a un hosting estático
npm run preview    # sirve dist/ localmente para revisar antes de publicar
```

---

## 2. Estructura del proyecto

```text
el-bucanero/
│
├── index.html
├── package.json
├── README.md
│
├── src/
│   ├── main.js                          # Punto de entrada: conecta todo
│   ├── styles.css                        # Identidad visual y layout
│   │
│   ├── data/
│   │   ├── config.js                      # ⚙️ Config central: WhatsApp, precios, ingredientes
│   │   └── products.js                    # 🍔 Productos y categorías (carta)
│   │
│   ├── components/
│   │   ├── CategoryNav.js                 # Navegación horizontal de categorías
│   │   ├── ProductCard.js                 # Tarjeta de producto en la grilla
│   │   ├── ProductModal.js                # Detalle de un producto simple + extras opcionales
│   │   ├── CustomBurgerConfigurator.js    # Configurador de la hamburguesa personalizada
│   │   ├── IngredientPicker.js            # Selector de ingredientes reutilizable (steppers + chips)
│   │   └── Cart.js                        # Panel del carrito
│   │
│   └── utils/
│       ├── cart.js                        # Estado del carrito + localStorage
│       ├── pricing.js                     # Cálculo de precios
│       ├── customization.js               # Descripciones legibles de la personalización
│       └── whatsapp.js                    # Armado del mensaje y link de WhatsApp
│
└── assets/
    ├── images/                            # Imágenes de productos (placeholders SVG)
    └── icons/                             # Favicon
```

---

## 3. Cómo funciona la personalización

### 🍔 Hamburguesa Personalizada (desde cero)

Al abrirla se muestra el configurador completo, con **todos** los
ingredientes de la carta:

```text
Smash · Cheddar · Muzza · Provolone · Catupiry · Bacon · Huevo ·
Lechuga · Tomate · Cebolla · Cebolla caramelizada · Cebolla crispy ·
Pepinillos · Ketchup · Salsa de la Casa · Barbacoa
```

- **Smash** y **Cheddar** se eligen por cantidad (steppers `-`/`+`).
- El resto son chips que se prenden o apagan con un toque.

La base de **$250** incluye: 2 smash, 4 cheddar, cebolla y barbacoa
(la configuración de "La Barbacoa"). Reglas de precio:

- Sacar algo que viene en la base (ej. la cebolla) → **no descuenta nada**.
- Agregar más cantidad de la que trae la base (ej. un smash de más, o un
  cheddar de más) → **sí suma** el precio de ese ingrediente extra.
- Prender un ingrediente que no viene en la base (ej. bacon, provolone)
  → **sí suma** su precio.
- El precio final **nunca** es menor a $250.

### ➕ Agregarle extras a una hamburguesa que ya existe en el menú

Los productos del menú marcados con `allowsExtras: true` (por ahora, "La
Barbacoa") muestran, dentro de su modal de detalle, una sección **"¿Le
agregamos algo más?"** con el mismo selector de ingredientes. Ahí no hay
concepto de "base": cada ingrediente que el cliente elige suma su precio
completo. Por ejemplo, agregarle un smash extra a "La Barbacoa" suma
**+$50** al precio de esa hamburguesa.

Ya no existe una categoría separada de "Extras" en el menú — los extras
ahora se eligen desde el propio producto, no como un ítem aparte.

---

## 4. Qué modificar según lo que necesites

### 🍔 Agregar o editar productos del menú

Archivo: `src/data/products.js`. Cada producto:

```js
{
  id: "barbacoa",
  name: "La Barbacoa",
  description: "Doble smash, cheddar x4, cebolla y salsa barbacoa.",
  price: 250,
  category: "hamburguesas",
  image: "/assets/images/barbacoa.jpg",
  customizable: false,   // true solo para la Hamburguesa Personalizada
  allowsExtras: true,    // true si se le puede agregar ingredientes extra
}
```

Las categorías están en el mismo archivo, en el array `categories`.

### 🧀 Agregar, quitar o editar ingredientes

Archivo: `src/data/config.js`, dentro de `config.customBurger`:

- `steppers`: ingredientes por cantidad (hoy: Smash, Cheddar).
- `toggles`: ingredientes sí/no (el resto de la lista).

Cada ingrediente tiene `extraPrice` (lo que cuesta por encima de la base
o como extra sobre un producto del menú) y, en los toggles,
`includedInBase` (si viene incluido en la base de $250). Agregar un
ingrediente nuevo es sumar un objeto más a cualquiera de los dos arrays;
aparece automáticamente en el configurador y en la sección de extras.

### 💰 Cambiar precios

- Precio de un producto normal: campo `price` en `src/data/products.js`.
- Precio base de la personalizada y precio de cada ingrediente:
  `src/data/config.js` → `config.customBurger`.

### 📱 Cambiar el número de WhatsApp

`src/data/config.js` → `whatsappNumber`. Formato internacional, sin "+"
ni espacios (ej. `"59899123456"`). Hasta que no se configure, el botón
"Realizar pedido" muestra un aviso en vez de abrir WhatsApp.

### 🎨 Cambiar colores

`src/styles.css`, bloque `:root` al principio del archivo.

### 🖼️ Agregar imágenes reales

Colocá los archivos en `assets/images/` y actualizá el campo `image`
del producto correspondiente en `src/data/products.js`.

---

## 5. Pruebas realizadas

| Caso | Configuración | Resultado esperado | Verificado |
|---|---|---|---|
| 1 | Base (2 smash, 4 cheddar, cebolla, barbacoa) | $250 | ✅ |
| 2 | Base sin cebolla | $250 (no descuenta) | ✅ |
| 3 | Base sin cebolla y sin barbacoa | $250 (no descuenta) | ✅ |
| 4 | Base + 1 smash extra (3 smash) | $250 + $50 = $300 | ✅ |
| 5 | Base + ingrediente no incluido (ej. bacon) prendido | $250 + su `extraPrice` (hoy $0, pendiente) | ✅ |
| 6 | Dos personalizadas distintas en el carrito | Aparecen como líneas separadas, nunca se fusionan | ✅ |
| 7 | Agregar 1 smash extra a "La Barbacoa" (producto ya armado) | +$50 sobre el precio del producto | ✅ |
| 8 | Agregar 2 smash extra a un producto del menú | +$100 | ✅ |

También se verificó que las cantidades nunca bajan de 0 ni superan los
límites configurados, que el total del carrito nunca es negativo, y que
el carrito persiste en `localStorage` al recargar la página o cambiar de
categoría.

---

## 6. Pendientes (datos reales que hay que proporcionar)

- [ ] **Número de WhatsApp** real → `config.js` → `whatsappNumber`
- [ ] **Precio del cheddar extra** → `config.js` → `steppers` → `cheddar.extraPrice`
- [ ] **Precio de cada ingrediente extra** (Muzza, Provolone, Catupiry, Bacon,
      Huevo, Lechuga, Tomate, Cebolla caramelizada, Cebolla crispy,
      Pepinillos, Ketchup, Salsa de la Casa) → `config.js` → `toggles` →
      `extraPrice` de cada uno. Hoy están en $0 y marcados `// PENDIENTE`.
      ✅ Ya definido: el smash extra cuesta **$50** (`steppers` → `smash.extraPrice`).
- [ ] **Carta completa real** (nombres, descripciones, precios) →
      `src/data/products.js` — hoy hay productos de demostración.
- [ ] **Imágenes reales** de cada producto → `assets/images/`.
- [ ] Confirmar a qué otros productos del menú (además de "La Barbacoa")
      se les debería poder agregar extras (`allowsExtras: true`).

---

## 7. Arquitectura pensada para el futuro

La separación entre `data/` (productos, categorías, catálogo de
ingredientes), `utils/` (lógica pura de precios y descripciones) y
`components/` (interfaz) está pensada para poder agregar sin romper nada:

- Panel administrativo de productos, precios e ingredientes
- Gestión de pedidos y sus estados
- Historial de pedidos
- Promociones y combos
- Control de stock
- Estadísticas de ventas
