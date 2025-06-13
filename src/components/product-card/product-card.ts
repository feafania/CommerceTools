import "./product-card.css";
import { InProduct } from "@/types/interfaces";
import { formatPriceWithCurrency, localizeName } from "@/utils/helpers";
import { CARD_SETTINGS } from "@/config/constants";
import { CurrencyCode, PageType, SliderType } from "@/types/enum";
import CatalogView from "@/pages/catalog/catalog";
import basketStore from "@/stores/basket-store";
import { Basket } from "@/components/basket/basket";
import basketService from "@/api/services/basket-service";

export default class ProductCard {
  card: HTMLDivElement;
  #basket: Basket | undefined;

  constructor(
    private product: InProduct,
    private variant: SliderType = SliderType.Cards,
  ) {
    this.card = document.createElement("div");
    this.#basket = undefined;
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
      const imgWrapper = document.createElement("div");
      imgWrapper.className = "product-card-img";
      const img = document.createElement("img");
      img.src = this.product.images[0]?.url;
      img.alt = localizeName(this.product.name);
      imgWrapper.append(img);
      this.card.addEventListener("click", () => {
        CatalogView.isSamePage = false;
        globalThis.location.hash = `${PageType.product}/${this.product.key}`;
      });

      const infoBlock = ProductCard.renderProductInformation(this.product);
      const addToCartButton = this.createAddToCartButton();

      this.card.append(imgWrapper, infoBlock, addToCartButton);
    }

    return this.card;
  }

  private createAddToCartButton(): HTMLButtonElement {
    this.#basket = new Basket();
    const button = this.#basket!.element;

    const cart = basketStore.getCart();
    const alreadyInCart = cart?.lineItems?.some(
      (item) => item.productId === this.product.id,
    );

    if (alreadyInCart) {
      button.disabled = true;
      button.classList.add("in-cart");
      button.title = "Already in cart";
    }

    button.addEventListener("click", async (event_) => {
      event_.stopPropagation();

      button.disabled = true;
      button.innerHTML = `<span class="loading-spinner"></span>`;

      try {
        await basketService.addItemToCart(this.product.key!);
        button.innerHTML = `<i class="fas fa-check"></i>`;
        button.classList.add("in-cart");
        button.title = "Added to cart";
      } catch (error) {
        console.error("Error adding item:", error);
        button.innerHTML = `<i class="fas fa-times"></i>`;
        button.title = "Error adding to cart";
        button.disabled = false;
      }

      setTimeout(() => {
        if (!button.classList.contains("in-cart")) {
          button.innerHTML = `<i class="fas fa-cart-plus"></i>`;
        }
      }, 2000);
    });

    return button;
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
