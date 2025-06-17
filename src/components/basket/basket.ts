import "./basket.css";
import { SETTINGS } from "@/config/settings";
import basketStore from "@/stores/basket-store";

export class Basket {
  #basket: HTMLButtonElement;
  #icon: HTMLElement;
  #counter: HTMLSpanElement | undefined = undefined;
  #isInCart: boolean = false;
  constructor(public onClick?: (event: MouseEvent) => void) {
    this.#icon = this.createIcon();
    this.#basket = this.createBasket();
    if (onClick) {
      this.#basket.addEventListener("click", onClick);
    }
  }

  get element(): HTMLButtonElement {
    return this.#basket;
  }
  get icon(): HTMLElement {
    return this.#icon;
  }

  get counter(): HTMLSpanElement | undefined {
    return this.#counter;
  }

  get isInCart(): boolean {
    return this.#isInCart;
  }

  set isInCart(value: boolean) {
    this.#isInCart = value;
  }

  subscribeOnCount() {
    this.setCartCount();
    basketStore.subscribe(() => {
      this.setCartCount();
    });
  }

  setCartCount() {
    const cart = basketStore.getCart();
    const count =
      cart?.lineItems?.reduce((total, item) => total + item.quantity, 0) ?? 0;
    this.updateCounter(count);
  }

  addItem() {
    this.#basket.classList.add("add-to-cart-btn");
    this.setDisabled();
    this.replaceIcon("fa-cart-plus");
    if (this.#isInCart) {
      this.#basket.classList.add("in-cart");
      this.#basket.title = SETTINGS.label.basketButton.alreadyInCard;
    } else {
      this.#basket.title = SETTINGS.label.basketButton.addToCard;
    }
  }

  addedToCart() {
    this.replaceIcon("fa-check");
    this.isInCart = true;
    this.#basket.classList.add("in-cart");
    this.#basket.title = SETTINGS.label.basketButton.addedToCard;
    this.setDisabled();
  }

  errorAddingToCart() {
    this.replaceIcon("fa-times");
    this.#basket.title = SETTINGS.label.basketButton.errorAddingToCart;
    this.isInCart = false;
    this.setDisabled();
  }

  setDisabled() {
    this.#basket.disabled = this.#isInCart;
  }

  load() {
    this.#basket.disabled = true;
    const spinner = document.createElement("span");
    spinner.className = "loading-spinner";
    this.#basket.replaceChild(spinner, this.#icon);
    this.#icon = spinner;
  }

  updateCounter(count: number) {
    if (count > 0) {
      if (!this.#counter) {
        this.#counter = document.createElement("span");
        this.#counter.classList.add("basket-count");
        this.#basket.append(this.#counter);
      }
      this.#counter.textContent = count.toString();
    } else if (this.#counter) {
      this.#counter.remove();
      this.#counter = undefined;
    }
  }

  private replaceIcon(newIconClass: string) {
    const newIcon = document.createElement("i");
    newIcon.className = `fas ${newIconClass}`;
    this.#basket.replaceChild(newIcon, this.#icon);
    this.#icon = newIcon;
  }

  private createBasket(): HTMLButtonElement {
    const basket = document.createElement("button");
    basket.classList.add("basket-button");
    basket.title = SETTINGS.label.basketButton.title;
    basket.append(this.#icon);

    return basket;
  }

  private createIcon(): HTMLElement {
    const icon = document.createElement("i");
    icon.classList.add("fas", "fa-shopping-cart");

    return icon;
  }
}
