import { categories } from "../data/products.js";

// Pinta la navegación de categorías dentro de `container`.
// `onSelect(categoryId)` se llama cuando el usuario toca una categoría.
export function renderCategoryNav(container, { activeCategory, onSelect }) {
  container.innerHTML = "";
  container.setAttribute("role", "tablist");

  categories.forEach((cat) => {
    const isActive = cat.id === activeCategory;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "category-btn" + (isActive ? " active" : "");
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
    btn.innerHTML = `<span class="cat-emoji" aria-hidden="true">${cat.emoji}</span><span>${cat.label}</span>`;

    btn.addEventListener("click", () => onSelect(cat.id));

    container.appendChild(btn);
  });
}
