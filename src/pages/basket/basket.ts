import "./basket.css";
import { InLineItem, InCart, InProduct } from "@/types/interfaces";
import { SETTINGS } from "@/config/settings";
import {
  formatPriceWithCurrency,
  localizeName,
  removeAllChildren,
} from "@/utils/helpers";
import showModalMessage from "@/components/modal-window/modal-window";
import basketService from "@/api/services/basket-service";
import productService from "@/api/services/product-service";
import { CurrencyCode } from "@/types/enum";
import globalOverlay from "@/components/global-overlay/global-overlay";

const Basket = {
  products: [] as InLineItem[],
  cartData: undefined as InCart | undefined,
  container: document.createElement("div"),
  basketItemsContainer: document.createElement("div"),
  basketSummaryContainer: document.createElement("div"),
  isLoading: false, // to check did we load new basket list
  clearButton: document.createElement("button"), // to delete clear btn if deleted all items
  promocodeInput: document.createElement("input"),
  promocodeButton: document.createElement("button"),
  promocodeContainer: document.createElement("div"),
  promocodeDiscount: 0, // discount percentage

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
      const cartResponse = await basketService.getCart();
      this.cartData = cartResponse;

      this.products = [];
      if (cartResponse?.lineItems) {
        for (const lineItem of cartResponse.lineItems) {
          const basketProduct: InLineItem = {
            id: lineItem.id,
            productId: lineItem.productId,
            name: lineItem.name,
            price: lineItem.price,
            originalPrice: lineItem.originalPrice,
            totalPrice: lineItem.totalPrice,
            sku: lineItem.sku,
            variantId: lineItem.variantId,
            quantity: lineItem.quantity,
            image: lineItem.image,
          };
          this.products.push(basketProduct);
        }
      }
    } catch {
      // console.error("Failed to initialize basket from basketService:", error);
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

  async createProductItemHTML(product: InLineItem): Promise<string> {
    const effectivePrice = product.price;
    const originalPrice = product.originalPrice;
    const itemTotal = product.totalPrice;
    const currentPriceHTML = `<span class="current-price">
    ${this.formatPrice(effectivePrice)}
  </span>`;

    const originalPriceHTML =
      originalPrice && originalPrice !== effectivePrice
        ? `<span class="original-price">
        <span class="line-through">${this.formatPrice(originalPrice)}</span>
      </span>`
        : "";

    const parent = await productService.getProductById(product.productId);
    let image = product.image;
    if (!image && parent) {
      image = parent.images[0].url;
    }

    const productName = localizeName(product.name);
    const options = await this.getOptions(parent, product);

    const imageHTML = image
      ? `<img src="${image}" alt="${productName}" class="product-image">`
      : `<div class="product-image placeholder"></div>`;

    return `
    <div class="basket-item" data-product-id="${product.id}">
      ${imageHTML}
      <div class="item-details">
        <h3>${productName}</h3>
        <div class="sku-info">
          <small>SKU: ${product.sku}</small>
        </div>
        <div class="variant-options">${options}</div>
        <div class="price-info">
          ${currentPriceHTML}
          ${originalPriceHTML}
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

  async getOptions(
    parent: InProduct | undefined,
    product: InLineItem,
  ): Promise<string> {
    if (parent) {
      const variant = productService.getVariantById(product.variantId, parent);
      const productType = await productService.getProductTypeByKey(
        parent.productTypeKey,
      );
      return productService.getVariantDescription(variant, productType);
    }
    return "";
  },

  createPromocodeHTML(): string {
    return `
      <div class="promocode-section">
        <div class="promocode-input-group">
          <input 
            type="text" 
            class="promocode-input" 
            placeholder="${SETTINGS.label.basket.promocodeInput}"
            value=""
          >
          <button class="promocode-btn">${SETTINGS.label.basket.applyPromocode}</button>
        </div>
      </div>
    `;
  },

  async createBasketSummaryHTML(): Promise<string> {
    const cart = await basketService.getCart(); // cart: InCart
    if (!cart) return "";
    const currency = cart.currency || SETTINGS.currentCurrency;
    const totalItems = cart.lineItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    const isPromocodeApplied = cart.discountCodes
      ? cart.discountCodes.length > 0
      : false;

    const originalTotal = cart.subtotalPrice;
    const finalTotal = cart.totalPrice;

    let appliedPromoCodesHTML = "";

    if (isPromocodeApplied && cart.discountCodes?.length) {
      const promoDetails = await Promise.all(
        cart.discountCodes.map(async (dc) => {
          const promo = await basketService.getDiscountCodeById(dc.id);
          const name = localizeName(promo?.description ?? promo?.name ?? "");
          const status = dc.matchesCart
            ? ""
            : ` (${SETTINGS.label.basket.notMatched})`;
          return `<li>${name}${status}</li>`;
        }),
      );
      appliedPromoCodesHTML = `<ul class="applied-promocodes-list">${promoDetails.join("")}</ul>`;
    }

    const originalPriceHTML = isPromocodeApplied
      ? `<div class="original-price">
          ${SETTINGS.label.basket.total}: 
        <span class="line-through">${this.formatPrice(originalTotal, currency)}</span>
      </div>`
      : "";

    const discountInfoHTML = isPromocodeApplied
      ? `<div class="discount-info">
         <span class="discounted-price">
           ${SETTINGS.label.basket.discountedTotal}: 
           <strong>${this.formatPrice(finalTotal, currency)}</strong>
         </span>
         <div class="applied-promocode">
           ${SETTINGS.label.basket.appliedPromocode}: 
           <span>${appliedPromoCodesHTML}</span>
         </div>
       </div>`
      : `<div class="summary-total">
         <strong>${SETTINGS.label.basket.total}: ${this.formatPrice(finalTotal, currency)}</strong>
       </div>`;

    return `
    <div class="basket-summary">
      <div class="summary-line">
        <span>${SETTINGS.label.basket.totalItems}: ${totalItems}</span>
      </div>
      ${originalPriceHTML}
      ${discountInfoHTML}
    </div>
  `;
  },

  async renderBasketItems(): Promise<void> {
    if (!this.basketItemsContainer) return;

    removeAllChildren(this.basketItemsContainer);

    if (this.isEmpty()) {
      this.basketItemsContainer.innerHTML = this.createEmptyBasketHTML();
      return;
    }
    if (this.cartData) {
      for (const product of this.cartData?.lineItems) {
        const itemElement = document.createElement("div");
        itemElement.innerHTML = await this.createProductItemHTML(product);
        this.basketItemsContainer.append(itemElement.firstElementChild!);
      }
    }
  },

  renderPromocode(): void {
    if (!this.promocodeContainer) return;

    removeAllChildren(this.promocodeContainer);

    if (!this.isEmpty()) {
      this.promocodeContainer.innerHTML = this.createPromocodeHTML();
      this.attachPromocodeEventListeners();
    }
  },

  async renderBasketSummary(): Promise<void> {
    if (!this.basketSummaryContainer) return;

    removeAllChildren(this.basketSummaryContainer);

    if (!this.isEmpty()) {
      this.basketSummaryContainer.innerHTML =
        await this.createBasketSummaryHTML();
    }
  },

  async updateBasketDisplay(): Promise<void> {
    await this.renderBasketItems();
    this.renderPromocode();
    await this.renderBasketSummary();
    if (this.clearButton) {
      this.clearButton.style.display = this.isEmpty() ? "none" : "";
    }
    this.attachEventListeners(this.container);

    this.updateLoadingUI();
  },

  async render(): Promise<HTMLElement | undefined> {
    globalOverlay.show();
    await this.initializeWithBasketService();
    removeAllChildren(this.container);
    this.container.className = "basket-container";

    const header = document.createElement("div");
    header.className = "basket-header";
    header.innerHTML = "<h2>" + SETTINGS.label.basket.title + "</h2>";

    this.basketItemsContainer = document.createElement("div");
    this.basketItemsContainer.className = "basket-items";

    this.promocodeContainer = document.createElement("div");
    this.promocodeContainer.className = "promocode-container";

    this.basketSummaryContainer = document.createElement("div");

    this.clearButton = document.createElement("button");
    this.clearButton.className = "clear-basket-btn";
    this.clearButton.textContent = SETTINGS.label.basket.clear;
    this.clearButton.addEventListener("click", () => this.clearBasket());

    this.container.append(
      header,
      this.basketItemsContainer,
      this.promocodeContainer,
      this.basketSummaryContainer,
      this.clearButton,
    );

    // Always update the display with current data
    await this.updateBasketDisplay();
    globalOverlay.hide();

    return this.container;
  },

  attachPromocodeEventListeners(): void {
    const promocodeButton =
      this.promocodeContainer.querySelector(".promocode-btn");
    const promocodeInput = this.promocodeContainer.querySelector(
      ".promocode-input",
    ) as HTMLInputElement;

    if (promocodeButton && promocodeInput) {
      promocodeButton.addEventListener("click", () =>
        this.handlePromocodeSubmit(),
      );
      promocodeInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          this.handlePromocodeSubmit();
        }
      });
    }
  },
  async handlePromocodeSubmit(): Promise<void> {
    const promocodeInput = this.promocodeContainer.querySelector(
      ".promocode-input",
    ) as HTMLInputElement;

    if (!promocodeInput) return;

    const enteredCode = promocodeInput.value.trim();

    try {
      const updatedCart = await basketService.applyDiscountCode(enteredCode);
      if (updatedCart) {
        this.cartData = updatedCart;
        await this.initializeWithBasketService();
        promocodeInput.value = "";
        showModalMessage(SETTINGS.label.basket.success);
        await this.updateBasketDisplay();
      }
    } catch {
      // console.error("Error applying promocode:", error);
    } finally {
      this.setLoadingState(false);
    }
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
          await this.updateBasketDisplay();
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
          await this.updateBasketDisplay();
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
          await this.updateBasketDisplay();
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

  async updateQuantity(
    productId: string,
    newQuantity: number,
  ): Promise<boolean> {
    try {
      const productIndex = this.products.findIndex((p) => p.id === productId);

      if (productIndex === -1) {
        // console.error(`Product with ID ${productId} not found in basket`);
        return false;
      }

      if (newQuantity < 0) {
        // console.error("Quantity cannot be negative");
        return false;
      }

      const product = this.products[productIndex];
      const lineItemId = product.id;

      const updatedCart = await basketService.changeItemQuantity(
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
        // console.error(
        //   `Failed to update quantity for product with ID ${productId}`,
        // );
        return false;
      }
    } catch {
      // console.error(
      //   `Error updating quantity for product with ID ${productId}:`,
      //   error,
      // );
      return false;
    }
  },

  async removeProduct(productId: string): Promise<boolean> {
    try {
      const productIndex = this.products.findIndex((p) => p.id === productId);

      if (productIndex === -1) {
        // console.error(`Product with ID ${productId} not found in basket`);
        return false;
      }

      const product = this.products[productIndex];
      const lineItemId = product.id;
      const updatedCart = await basketService.changeItemQuantity(lineItemId, 0);

      if (updatedCart) {
        this.cartData = updatedCart;
        this.products.splice(productIndex, 1);
        return true;
      } else {
        // console.error(
        //   `Failed to remove product with ID ${productId} from cart via API`,
        // );
        return false;
      }
    } catch {
      // console.error(`Error removing product with ID ${productId}:`, error);
      return false;
    }
  },

  isEmpty(): boolean {
    return this.products.length === 0;
  },

  clearBasket(): void {
    if (this.isLoading) {
      return;
    }
    showModalMessage(SETTINGS.label.messages.onClearBasket, {
      showCancel: true,
      onOk: async () => {
        try {
          if (this.products.length === 0) {
            return true;
          }

          this.setLoadingState(true);
          await basketService.clearCart();

          this.products = [];
          this.cartData = undefined;
          this.promocodeDiscount = 0;

          await this.updateBasketDisplay();
          return true;
        } catch {
          // console.error("Error clearing basket:", error);
          return false;
        } finally {
          this.setLoadingState(false);
        }
      },
    });
  },

  formatPrice(priceInCents: number, currencyCode?: CurrencyCode): string {
    const currency =
      currencyCode || this.cartData?.currency || SETTINGS.currentCurrency;
    return formatPriceWithCurrency(priceInCents, currency as CurrencyCode);
    // const dollars = priceInCents / 100;
    // return new Intl.NumberFormat("en-US", {
    //   style: "currency",
    //   currency,
    // }).format(dollars);
  },
};

export default Basket;
