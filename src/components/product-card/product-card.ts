import "./product-card.css";
import { InProduct } from "@/types/interfaces";
import { localizeName } from "@/utils/helpers";

const ProductCard = {
  create(product: InProduct): HTMLElement {
    const card = document.createElement("div");
    card.className = "product-card";

    const img = document.createElement("img");
    img.src = product.images[0]?.url;
    img.alt = localizeName(product.name);

    const title = document.createElement("h3");
    title.textContent = localizeName(product.name);

    const description = document.createElement("p");
    description.textContent = localizeName(product.description || {});

    const price = document.createElement("div");
    price.className = "price";

    price.innerHTML =
      product.isDiscounted && product.discountedPrice
        ? `
        <span class="discounted">${(product.discountedPrice / 100).toFixed(2)} 
          ${product.currencyCode}</span>
        <span class="original">${(product.price / 100).toFixed(2)} ${product.currencyCode}</span>
      `
        : `<span class="regular">${(product.price / 100).toFixed(2)}
          ${product.currencyCode}</span>`;

    card.addEventListener("click", () => {
      globalThis.location.hash = `/product/${product.key}`;
    });

    card.append(img, title, description, price);
    return card;
  },
};

export default ProductCard;
