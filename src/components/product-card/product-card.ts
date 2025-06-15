import "./product-card.css";
import { InProduct } from "@/types/interfaces";
import { formatPriceWithCurrency, localizeName } from "@/utils/helpers";
import { CARD_SETTINGS } from "@/config/constants";
import { CurrencyCode, PageType, SliderType } from "@/types/enum";
import CatalogView from "@/pages/catalog/catalog";
import basketStore from "@/stores/basket-store";
import { Basket } from "@/components/basket/basket";
import basketService from "@/api/services/basket-service";
import globalOverlay from "@/components/global-overlay/global-overlay";

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
      img.loading = "lazy";
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
    if (!this.#basket) return document.createElement("button");

    const button = this.#basket.element;

    const cart = basketStore.getCart();
    this.#basket.isInCart = !!cart?.lineItems?.some(
      (item) => item.productId === this.product.id,
    );
    this.#basket.addItem();

    button.addEventListener("click", async (event_) => {
      event_.stopPropagation();
      globalOverlay.show();
      this.#basket?.load();

      try {
        await basketService.addItemToCart(this.product.key!);
        this.#basket?.addedToCart();
      } catch (error) {
        console.error("Error adding item:", error);
        this.#basket?.errorAddingToCart();
      } finally {
        setTimeout(() => {
          globalOverlay.hide();
          if (!button.classList.contains("in-cart")) {
            this.#basket?.addItem();
          }
        }, 1000);
      }
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
