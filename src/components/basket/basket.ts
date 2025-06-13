import "./basket.css";
import { SETTINGS } from "@/config/settings";

export class Basket {
  #basket: HTMLButtonElement;
  #icon: HTMLElement;
  #counter: HTMLSpanElement | undefined = undefined;
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

  private createBasket(): HTMLButtonElement {
    const basket = document.createElement("button");
    basket.classList.add("basket-button");
    basket.title = SETTINGS.label.basket.title;
    basket.append(this.#icon);

    return basket;
  }

  private createIcon(): HTMLElement {
    const icon = document.createElement("i");
    icon.classList.add("fas", "fa-shopping-cart");

    return icon;
  }
}
