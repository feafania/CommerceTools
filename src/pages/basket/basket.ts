import "./basket.css";
import { InLineItem, InCart } from "@/types/interfaces";
import { SETTINGS } from "@/config/settings";
import BasketService from "@/api/services/basket-service";
import { removeAllChildren } from "@/utils/helpers";

const Basket = {
  products: [] as InLineItem[],
  cartData: undefined as InCart | undefined,
  container: document.createElement("div"),
  basketItemsContainer: document.createElement("div"),
  basketSummaryContainer: document.createElement("div"),
  isLoading: false, // to check did we load new basket list
  clearButton: document.createElement("button"), // to delete clear btn if deleted all items

  setLoadingState(loading: boolean): void {
    this.isLoading = loading;
    this.updateLoadingUI();
  },

  updateLoadingUI(): void {
    const allButtons = this.container.querySelectorAll("button");
    const allInputs = this.container.querySelectorAll("input");

    if (this.isLoading) {
      for (const button of allButtons) {
        button.disabled = true;
        button.classList.add("loading-disabled");
      }
      for (const input of allInputs) {
        (input as HTMLInputElement).disabled = true;
        input.classList.add("loading-disabled");
      }

      if (this.basketItemsContainer) {
        this.basketItemsContainer.classList.add("loading");
      }
    } else {
      for (const button of allButtons) {
        button.disabled = false;
        button.classList.remove("loading-disabled");
      }
      for (const input of allInputs) {
        (input as HTMLInputElement).disabled = false;
        input.classList.remove("loading-disabled");
      }

      if (this.basketItemsContainer) {
        this.basketItemsContainer.classList.remove("loading");
      }
    }
  },

  async initializeWithBasketService(): Promise<void> {
    try {
      console.log("get cart");
      const cartResponse = await BasketService.getCart();
      console.log(cartResponse);
      this.cartData = cartResponse;

      this.products = [];
      if (cartResponse?.lineItems) {
        for (const lineItem of cartResponse.lineItems) {
          const basketProduct: InLineItem = {
            id: lineItem.id,
            productId: lineItem.productId,
            name: lineItem.name,
            price: lineItem.price,
            totalPrice: lineItem.totalPrice,
            sku: lineItem.sku,
            variantId: lineItem.variantId,
            quantity: lineItem.quantity,
            image: lineItem.image,
          };
          this.products.push(basketProduct);
        }
      }
    } catch (error) {
      console.error("Failed to initialize basket from BasketService:", error);
      this.products = [];
      this.cartData = undefined;
    }
  },

  createEmptyBasketHTML(): string {
    return `
      <div class="empty-basket">
        <h2>${SETTINGS.label.basket.emptyText}</h2>
        <a href="/#catalog">Catalog</a>
      </div>
    `;
  },

  createProductItemHTML(product: InLineItem): string {
    const effectivePrice = this.getEffectivePrice(product);
    const itemTotal = effectivePrice * product.quantity;
    const currentPriceHTML = `<span class="current-price">
      ${this.formatPrice(effectivePrice)}
    </span>`;

    const productName =
      product.name[SETTINGS.currentLang] || product.name.en || "Product";

    const imageHTML = product.image
      ? `<img src="${product.image}" alt="${productName}" 
          class="product-image" 
          style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">`
      : "";

    return `
      <div class="basket-item" data-product-id="${product.id}">
        ${imageHTML}
        <div class="item-details">
          <h3>${productName}</h3>
          <div class="sku-info">
            <small>SKU: ${product.sku}</small>
          </div>
          <div class="price-info">
            ${currentPriceHTML}
          </div>
        </div>
        <div class="quantity-controls">
          <button class="quantity-btn minus" data-action="decrease">-</button>
          <input 
            type="number" 
            class="quantity-input" 
            value="${product.quantity}" 
            min="0" 
            data-product-id="${product.id}"
          >
          <button class="quantity-btn plus" data-action="increase">+</button>
        </div>
        <div class="item-total">
          <span>${this.formatPrice(itemTotal)}</span>
        </div>
        <button class="remove-btn" data-product-id="${product.id}">
          ${SETTINGS.label.basket.remove}
        </button>
      </div>
    `;
  },

  createBasketSummaryHTML(): string {
    return `
      <div class="basket-summary">
        <div class="summary-line">
          <span>${SETTINGS.label.basket.totalItems}: ${this.getTotalItems()}</span>
        </div>
        <div class="summary-total">
          <strong>${SETTINGS.label.basket.total}: ${this.getTotalFormatted()}</strong>
        </div>
      </div>
    `;
  },

  renderBasketItems(): void {
    if (!this.basketItemsContainer) return;

    removeAllChildren(this.basketItemsContainer);

    if (this.isEmpty()) {
      this.basketItemsContainer.innerHTML = this.createEmptyBasketHTML();
      return;
    }

    for (const product of this.products) {
      const itemElement = document.createElement("div");
      itemElement.innerHTML = this.createProductItemHTML(product);
      this.basketItemsContainer.append(itemElement.firstElementChild!);
    }
  },

  renderBasketSummary(): void {
    if (!this.basketSummaryContainer) return;

    removeAllChildren(this.basketSummaryContainer);

    if (!this.isEmpty()) {
      this.basketSummaryContainer.innerHTML = this.createBasketSummaryHTML();
    }
  },

  updateBasketDisplay(): void {
    this.renderBasketItems();
    this.renderBasketSummary();
    if (this.clearButton) {
      this.clearButton.style.display = this.isEmpty() ? "none" : "";
    }
    this.attachEventListeners(this.container);

    this.updateLoadingUI();
  },

  async render(): Promise<HTMLElement | undefined> {
    await this.initializeWithBasketService();

    if (!this.container.hasChildNodes()) {
      this.container.className = "basket-container";

      const header = document.createElement("div");
      header.className = "basket-header";
      header.innerHTML = "<h2>" + SETTINGS.label.basket.title + "</h2>";

      this.basketItemsContainer = document.createElement("div");
      this.basketItemsContainer.className = "basket-items";

      this.basketSummaryContainer = document.createElement("div");

      this.clearButton = document.createElement("button");
      this.clearButton.className = "clear-basket-btn";
      this.clearButton.textContent = SETTINGS.label.basket.clear;
      this.clearButton.addEventListener("click", () => this.clearBasket());

      this.container.append(
        header,
        this.basketItemsContainer,
        this.basketSummaryContainer,
        this.clearButton,
      );
    }

    // Always update the display with current data
    this.updateBasketDisplay();

    return this.container;
  },

  handleQuantityInputChange(container: HTMLElement): void {
    const quantityInputs = container.querySelectorAll(".quantity-input");
    for (const input of quantityInputs) {
      input.removeEventListener("change", this.quantityInputHandler);
      input.addEventListener("change", this.quantityInputHandler.bind(this));
    }
  },

  async quantityInputHandler(event: Event): Promise<void> {
    if (this.isLoading) {
      return;
    }

    const target = event.target as HTMLInputElement;
    const productId = target.dataset.productId;
    const newQuantity = Number.parseInt(target.value, 10);

    if (productId && !Number.isNaN(newQuantity)) {
      this.setLoadingState(true);
      try {
        const success = await this.updateQuantity(productId, newQuantity);
        if (success) {
          this.updateBasketDisplay();
        }
      } finally {
        this.setLoadingState(false);
      }
    }
  },

  handleQuantityButtonClick(container: HTMLElement): void {
    const quantityButtons = container.querySelectorAll(".quantity-btn");
    for (const button of quantityButtons) {
      button.removeEventListener("click", this.quantityButtonHandler);
      button.addEventListener("click", this.quantityButtonHandler.bind(this));
    }
  },

  async quantityButtonHandler(event: Event): Promise<void> {
    if (this.isLoading) {
      return;
    }

    const clickedButton = event.target as HTMLButtonElement;
    const action = clickedButton.dataset.action;
    const itemElement = clickedButton.closest(".basket-item") as HTMLElement;
    const productId = itemElement.dataset.productId;
    const input = itemElement.querySelector(
      ".quantity-input",
    ) as HTMLInputElement;
    const currentQuantity = Number.parseInt(input.value, 10);

    if (productId) {
      this.setLoadingState(true);
      try {
        const newQuantity = this.calculateNewQuantity(action, currentQuantity);
        const success = await this.updateQuantity(productId, newQuantity);
        if (success) {
          this.updateBasketDisplay();
        }
      } finally {
        this.setLoadingState(false);
      }
    }
  },

  calculateNewQuantity(
    action: string | undefined,
    currentQuantity: number,
  ): number {
    if (action === "increase") {
      return currentQuantity + 1;
    }
    if (action === "decrease" && currentQuantity > 0) {
      return currentQuantity - 1;
    }
    return currentQuantity;
  },

  handleRemoveButtonClick(container: HTMLElement): void {
    const removeButtons = container.querySelectorAll(".remove-btn");
    for (const button of removeButtons) {
      button.removeEventListener("click", this.removeButtonHandler);
      button.addEventListener("click", this.removeButtonHandler.bind(this));
    }
  },

  async removeButtonHandler(event: Event): Promise<void> {
    if (this.isLoading) {
      return;
    }

    const clickedButton = event.target as HTMLButtonElement;
    const productId = clickedButton.dataset.productId;

    if (productId) {
      this.setLoadingState(true);
      try {
        const success = await this.removeProduct(productId);
        if (success) {
          this.updateBasketDisplay();
        }
      } finally {
        this.setLoadingState(false);
      }
    }
  },

  attachEventListeners(container: HTMLElement): void {
    this.handleQuantityInputChange(container);
    this.handleQuantityButtonClick(container);
    this.handleRemoveButtonClick(container);
  },

  getProducts(): InLineItem[] {
    return this.products;
  },

  async updateQuantity(
    productId: string,
    newQuantity: number,
  ): Promise<boolean> {
    try {
      const productIndex = this.products.findIndex((p) => p.id === productId);

      if (productIndex === -1) {
        console.error(`Product with ID ${productId} not found in basket`);
        return false;
      }

      if (newQuantity < 0) {
        console.error("Quantity cannot be negative");
        return false;
      }

      const product = this.products[productIndex];
      const lineItemId = product.id;

      const updatedCart = await BasketService.changeItemQuantity(
        lineItemId,
        newQuantity,
      );

      if (updatedCart) {
        this.cartData = updatedCart;

        if (newQuantity === 0) {
          this.products.splice(productIndex, 1);
        } else {
          this.products[productIndex].quantity = newQuantity;
          this.products[productIndex].totalPrice =
            this.products[productIndex].price * newQuantity;
        }

        return true;
      } else {
        console.error(
          `Failed to update quantity for product with ID ${productId}`,
        );
        return false;
      }
    } catch (error) {
      console.error(
        `Error updating quantity for product with ID ${productId}:`,
        error,
      );
      return false;
    }
  },

  async removeProduct(productId: string): Promise<boolean> {
    try {
      const productIndex = this.products.findIndex((p) => p.id === productId);

      if (productIndex === -1) {
        console.error(`Product with ID ${productId} not found in basket`);
        return false;
      }

      const product = this.products[productIndex];
      const lineItemId = product.id;
      const updatedCart = await BasketService.changeItemQuantity(lineItemId, 0);

      if (updatedCart) {
        this.cartData = updatedCart;
        this.products.splice(productIndex, 1);
        return true;
      } else {
        console.error(
          `Failed to remove product with ID ${productId} from cart via API`,
        );
        return false;
      }
    } catch (error) {
      console.error(`Error removing product with ID ${productId}:`, error);
      return false;
    }
  },

  calculateTotal(): number {
    return this.products.reduce((total, product) => {
      return total + product.totalPrice;
    }, 0);
  },

  getTotalFormatted(currencyCode?: string): string {
    const currency =
      currencyCode || this.cartData?.currency || SETTINGS.currentCurrency;
    const total = this.calculateTotal();
    return this.formatPrice(total, currency);
  },

  getTotalItems(): number {
    return this.products.reduce(
      (total, product) => total + product.quantity,
      0,
    );
  },

  getProduct(productId: string): InLineItem | undefined {
    return this.products.find((p) => p.id === productId);
  },

  isEmpty(): boolean {
    return this.products.length === 0;
  },

  async clearBasket(): Promise<boolean> {
    if (this.isLoading) {
      return false;
    }

    try {
      if (this.products.length === 0) {
        return true;
      }

      this.setLoadingState(true);

      for (const product of this.products) {
        const result = await BasketService.changeItemQuantity(product.id, 0);
        if (!result) {
          console.error(`Failed to remove product ${product.id} from basket`);
          return false;
        }
      }

      this.products = [];
      this.cartData = undefined;

      this.updateBasketDisplay();
      return true;
    } catch (error) {
      console.error("Error clearing basket:", error);
      return false;
    } finally {
      this.setLoadingState(false);
    }
  },

  getSummary(): {
    totalItems: number;
    totalPrice: number;
    totalPriceFormatted: string;
    cartId?: string;
    currency?: string;
    createdAt?: string;
    products: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
      total: number;
      sku: string;
    }>;
  } {
    return {
      totalItems: this.getTotalItems(),
      totalPrice: this.calculateTotal(),
      totalPriceFormatted: this.getTotalFormatted(),
      cartId: this.cartData?.id,
      currency: this.cartData?.currency,
      createdAt: this.cartData?.createdAt,
      products: this.products.map((product) => {
        const productName =
          product.name[SETTINGS.currentLang] || product.name.en || "Product";
        const productSku = product.sku || "";
        return {
          id: product.id,
          name: productName,
          quantity: product.quantity,
          price: this.getEffectivePrice(product),
          total: product.totalPrice,
          sku: productSku,
        };
      }),
    };
  },

  formatPrice(priceInCents: number, currencyCode?: string): string {
    const currency =
      currencyCode || this.cartData?.currency || SETTINGS.currentCurrency;
    const dollars = priceInCents / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(dollars);
  },

  getEffectivePrice(product: InLineItem): number {
    return product.price;
  },

  getCartData(): InCart | undefined {
    return this.cartData;
  },

  async reloadFromBasketService(): Promise<void> {
    this.setLoadingState(true);
    try {
      await this.initializeWithBasketService();
      this.updateBasketDisplay();
    } finally {
      this.setLoadingState(false);
    }
  },
};

export default Basket;
