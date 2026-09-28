import { products, categories } from "./data/products.js";
import { renderCategoryNav } from "./components/CategoryNav.js";
import { createProductCard } from "./components/ProductCard.js";
import { openProductModal } from "./components/ProductModal.js";
import { openCustomBurgerConfigurator } from "./components/CustomBurgerConfigurator.js";
import { renderCart } from "./components/Cart.js";
import {
  addItem,
  subscribe,
  getItemCount,
  getTotal,
  generateCartItemId,
} from "./utils/cart.js";
import { formatPrice } from "./utils/pricing.js";
import { hasSelectedAddOns } from "./utils/customization.js";

// -------------------------------------------------------------
// ESTADO DE LA APP (UI)
// -------------------------------------------------------------
const state = {
  activeCategory: categories[0].id,
  cartOpen: false,
};

// -------------------------------------------------------------
// REFERENCIAS AL DOM
// -------------------------------------------------------------
const productListEl = document.getElementById("product-list");
const categoryNavEl = document.getElementById("category-nav");
const modalRootEl = document.getElementById("modal-root");
const cartRootEl = document.getElementById("cart-root");
const cartToggleBtn = document.getElementById("cart-toggle-btn");
const cartBadge = document.getElementById("cart-count-badge");
const floatingCartBtn = document.getElementById("floating-cart-btn");
const fcCount = document.getElementById("fc-count");
const fcTotal = document.getElementById("fc-total");

// -------------------------------------------------------------
// RENDER: LISTA DE PRODUCTOS
// -------------------------------------------------------------
function renderProducts() {
  productListEl.innerHTML = "";

  const filtered = products.filter((p) => p.category === state.activeCategory);

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "products-empty";
    empty.textContent = "Todavía no hay productos en esta categoría.";
    productListEl.appendChild(empty);
    return;
  }

  filtered.forEach((product) => {
    const card = createProductCard(product, {
      onAdd: handleQuickAdd,
      onOpen: handleOpenProduct,
    });
    productListEl.appendChild(card);
  });
}

// -------------------------------------------------------------
// RENDER: NAVEGACIÓN DE CATEGORÍAS
// -------------------------------------------------------------
function renderNav() {
  renderCategoryNav(categoryNavEl, {
    activeCategory: state.activeCategory,
    onSelect: setActiveCategory,
  });
}

function setActiveCategory(categoryId) {
  state.activeCategory = categoryId;
  renderNav();
  renderProducts();
}

// -------------------------------------------------------------
// AGREGAR AL CARRITO
// -------------------------------------------------------------
function handleQuickAdd(product) {
  addItem({
    id: generateCartItemId(),
    productId: product.id,
    name: product.name,
    unitPrice: product.price,
    quantity: 1,
  });
}

function handleOpenProduct(product) {
  if (product.customizable) {
    openCustomBurgerConfigurator(modalRootEl, product, {
      onConfirm: handleConfirmCustom,
    });
  } else {
    openProductModal(modalRootEl, product, {
      onConfirm: handleConfirmSimple,
    });
  }
}

function handleConfirmSimple({ product, quantity, unitPrice, addOns }) {
  addItem({
    id: generateCartItemId(),
    productId: product.id,
    name: product.name,
    unitPrice,
    quantity,
    // Solo guardamos los extras si realmente eligió algo, para no
    // llenar el carrito de datos vacíos.
    addOns: addOns && hasSelectedAddOns(addOns) ? addOns : undefined,
  });
}

function handleConfirmCustom({ product, quantity, unitPrice, customization }) {
  // Cada hamburguesa personalizada se agrega como un ítem NUEVO e
  // independiente (id único), aunque otra ya esté en el carrito con
  // una configuración distinta. Nunca se fusionan automáticamente.
  addItem({
    id: generateCartItemId(),
    productId: product.id,
    name: product.name,
    unitPrice,
    quantity,
    customization,
  });
}

// -------------------------------------------------------------
// CARRITO: INDICADORES Y PANEL
// -------------------------------------------------------------
function updateCartIndicators() {
  const count = getItemCount();
  const total = getTotal();

  cartBadge.hidden = count === 0;
  cartBadge.textContent = String(count);

  floatingCartBtn.hidden = count === 0;
  fcCount.textContent = String(count);
  fcTotal.textContent = formatPrice(total);
}

function renderCartPanel() {
  renderCart(cartRootEl, { isOpen: state.cartOpen, onClose: closeCart });
}

function openCart() {
  state.cartOpen = true;
  renderCartPanel();
}

function closeCart() {
  state.cartOpen = false;
  renderCartPanel();
}

// -------------------------------------------------------------
// EVENTOS GLOBALES
// -------------------------------------------------------------
cartToggleBtn.addEventListener("click", openCart);
floatingCartBtn.addEventListener("click", openCart);

subscribe(() => {
  updateCartIndicators();
  if (state.cartOpen) renderCartPanel();
});

// -------------------------------------------------------------
// RENDER INICIAL
// -------------------------------------------------------------
renderNav();
renderProducts();
updateCartIndicators();
