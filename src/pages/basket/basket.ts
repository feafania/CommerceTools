import "./basket.css";
import { InLineItem } from "@/types/interfaces";
import { SETTINGS } from "@/config/settings";
import BasketService from "@/api/services/basket-service";
import basketService from "@/api/services/basket-service";

interface CartData {
  id: string;
  version: number;
  currency: string;
  lineItems: InLineItem[];
  totalPrice: number;
  subtotalPrice: number;
  createdAt: string;
}

const Basket = {
  products: [] as InLineItem[],
  cartData: undefined as CartData | undefined,

  async initializeWithBasketService(): Promise<void> {
    try {
      const cartResponse = await BasketService.getCart();
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
        <h2>Your basket is empty</h2>
        <p>Add some products to get started!</p>
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
          Remove
        </button>
      </div>
    `;
  },

  createBasketItemsHTML(): string {
    let basketItemsHTML = "";
    for (const product of this.products) {
      basketItemsHTML += this.createProductItemHTML(product);
    }
    return basketItemsHTML;
  },

  createBasketSummaryHTML(): string {
    return `
      <div class="basket-summary">
        <div class="summary-line">
          <span>Total Items: ${this.getTotalItems()}</span>
        </div>
        <div class="summary-total">
          <strong>TOTAL: ${this.getTotalFormatted()}</strong>
        </div>
      </div>
    `;
  },

  createBasketHTML(): string {
    if (this.isEmpty()) {
      return this.createEmptyBasketHTML();
    }

    return `
      <div class="basket-header">
        <h2>Shopping Basket</h2>
      </div>
      <div class="basket-items">
        ${this.createBasketItemsHTML()}
      </div>
      ${this.createBasketSummaryHTML()}
      <button class="clear-basket-btn">Clear Basket</button>
    `;
  },

  async render(): Promise<HTMLElement | undefined> {
    if (this.products.length === 0) {
      await this.initializeWithBasketService();
      if (this.products.length === 0) {
        console.error(
          "No items from BasketService, falling back to catalog products",
        );
      }
    }
    console.log(basketService.getCart());

    const container = document.createElement("div");
    container.className = "basket-container";
    if (this.isEmpty()) {
      container.innerHTML = this.createEmptyBasketHTML();
    } else {
      container.innerHTML = this.createBasketHTML();
      this.attachEventListeners(container);
    }

    return container;
  },

  handleQuantityInputChange(container: HTMLElement): void {
    const quantityInputs = container.querySelectorAll(".quantity-input");
    for (const input of quantityInputs) {
      input.addEventListener("change", async (event) => {
        const target = event.target as HTMLInputElement;
        const productId = target.dataset.productId;
        const newQuantity = Number.parseInt(target.value, 10);

        if (productId && !Number.isNaN(newQuantity)) {
          const success = await this.updateQuantity(productId, newQuantity);
          if (success) {
            const currentContainer = document.querySelector(
              ".basket-container",
            ) as HTMLElement;
            if (currentContainer) {
              await this.refreshBasketDisplay(currentContainer);
            }
          }
        }
      });
    }
  },

  handleQuantityButtonClick(container: HTMLElement): void {
    const quantityButtons = container.querySelectorAll(".quantity-btn");
    for (const button of quantityButtons) {
      button.addEventListener("click", async (event) => {
        const clickedButton = event.target as HTMLButtonElement;
        const action = clickedButton.dataset.action;
        const itemElement = clickedButton.closest(
          ".basket-item",
        ) as HTMLElement;
        const productId = itemElement.dataset.productId;
        const input = itemElement.querySelector(
          ".quantity-input",
        ) as HTMLInputElement;
        const currentQuantity = Number.parseInt(input.value, 10);

        if (productId) {
          const newQuantity = this.calculateNewQuantity(
            action,
            currentQuantity,
          );
          const success = await this.updateQuantity(productId, newQuantity);
          if (success) {
            const currentContainer = document.querySelector(
              ".basket-container",
            ) as HTMLElement;
            if (currentContainer) {
              await this.refreshBasketDisplay(currentContainer);
            }
          }
        }
      });
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
      button.addEventListener("click", async (event) => {
        const clickedButton = event.target as HTMLButtonElement;
        const productId = clickedButton.dataset.productId;

        if (productId) {
          const success = await this.removeProduct(productId);
          if (success) {
            const currentContainer = document.querySelector(
              ".basket-container",
            ) as HTMLElement;
            if (currentContainer) {
              await this.refreshBasketDisplay(currentContainer);
            }
          }
        }
      });
    }
  },

  attachEventListeners(container: HTMLElement): void {
    this.handleQuantityInputChange(container);
    this.handleQuantityButtonClick(container);
    this.handleRemoveButtonClick(container);

    const clearBasketButton = container.querySelector(
      ".clear-basket-btn",
    ) as HTMLButtonElement;
    if (clearBasketButton) {
      clearBasketButton.addEventListener("click", () => {
        this.clearBasket();
      });
    }
  },

  refreshBasketDisplay(container: HTMLElement): void {
    this.render().then((newContainer) => {
      if (newContainer && container.parentNode) {
        container.parentNode.replaceChild(newContainer, container);
      }
    });
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
          console.log(
            `Product with ID ${productId} removed from basket (quantity set to 0)`,
          );
        } else {
          this.products[productIndex].quantity = newQuantity;
          this.products[productIndex].totalPrice =
            this.products[productIndex].price * newQuantity;
          console.log(
            `Product with ID ${productId} quantity updated to ${newQuantity}`,
          );
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
    try {
      if (this.products.length === 0) {
        return true;
      }

      for (const product of this.products) {
        const result = await BasketService.changeItemQuantity(product.id, 0);
        if (!result) {
          console.error(`Failed to remove product ${product.id} from basket`);
          return false;
        }
      }

      this.products = [];
      this.cartData = undefined;

      const currentContainer = document.querySelector(
        ".basket-container",
      ) as HTMLElement;
      if (currentContainer) {
        await this.refreshBasketDisplay(currentContainer);
      }

      console.log("Basket cleared successfully");
      return true;
    } catch (error) {
      console.error("Error clearing basket:", error);
      return false;
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

  getCartData(): CartData | undefined {
    return this.cartData;
  },

  async reloadFromBasketService(): Promise<void> {
    await this.initializeWithBasketService();
  },
};

export default Basket;
