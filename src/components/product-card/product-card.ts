import "./product-card.css";
import { InProduct } from "@/types/interfaces";
import { formatPriceWithCurrency, localizeName } from "@/utils/helpers";
import { CARD_SETTINGS } from "@/config/constants";
import { CurrencyCode, SliderType } from "@/types/enum";

export default class ProductCard {
  card: HTMLDivElement;

  constructor(
    private product: InProduct,
    private variant: SliderType = SliderType.Cards,
  ) {
    this.card = document.createElement("div");
  }
  create(): HTMLDivElement {
    this.card.className = "product-card";
    this.card.style.width = `${CARD_SETTINGS.cardWidth}px`;
    this.card.style.height = `${CARD_SETTINGS.cardHeight}px`;

    if (this.variant === SliderType.Img) {
      this.card.classList.add("img-only");

      const img = document.createElement("img");
      img.src = this.product.images[0]?.url;
      img.alt = localizeName(this.product.name);
      img.className = "img-only-content";

      this.card.append(img);
    } else {
      const img = document.createElement("img");
      img.src = this.product.images[0]?.url;
      img.alt = localizeName(this.product.name);

      this.card.addEventListener("click", () => {
        globalThis.location.hash = `product/${this.product.key}`;
      });

      this.card.append(img, ProductCard.renderProductInformation(this.product));
    }

    return this.card;
  }

  static renderProductInformation(product: InProduct): HTMLElement {
    const cardInformaion = document.createElement("div");
    const title = document.createElement("h3");
    title.className = "product-title";
    title.textContent = localizeName(product.name);

    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = localizeName(product.description || {});

    const price = document.createElement("div");
    price.className = "price";

    const currency = product.currencyCode as CurrencyCode;

    price.innerHTML =
      product.isDiscounted && product.discountedPrice
        ? `
        <span class="price-discounted">
          ${formatPriceWithCurrency(product.discountedPrice, currency)}
        </span>
        <span class="price-original">
          ${formatPriceWithCurrency(product.price, currency)}
        </span>
      `
        : `<span class="price-regular">
          ${formatPriceWithCurrency(product.price, currency)}
          </span>`;
    cardInformaion.append(title, description, price);
    return cardInformaion;
  }
}
