import "./product.css";
import { localizeName, removeAllChildren } from "@/utils/helpers";
import { InCart, InProduct, InVariant } from "@/types/interfaces";
import productService from "@/api/services/product-service";
import PageRouter from "@/router/page-router";
import { PageType } from "@/types/enum";
import ProductImageSlider from "@/components/product-image-slider/product-image-slider";
import ProductCard from "@/components/product-card/product-card";
import { SETTINGS } from "@/config/settings";
import CatalogViewFiltering from "@/pages/catalog/filtering";
import CatalogView from "@/pages/catalog/catalog";
import basketService from "@/api/services/basket-service";
import basketStore from "@/stores/basket-store";

const ProductView = {
  productKey: undefined as string | undefined,
  product: undefined as InProduct | undefined,
  container: document.createElement("section"),
  productSection: document.createElement("div"),
  selectedVariantId: undefined as number | undefined,
  currentCart: undefined as InCart | undefined,

  async render(): Promise<HTMLElement | undefined> {
    removeAllChildren(this.container);
    this.container.className = "view product-view";

    try {
      if (!this.productKey) {
        throw new Error("No product key found");
      }

      this.product = await productService.getProductByKey(this.productKey);
      if (!this.product) {
        throw new Error("Product not found");
      }
      this.currentCart = await basketStore.getCart();
      this.selectedVariantId = this.product.variantId;

      const layoutWrapper = document.createElement("div");
      layoutWrapper.className = "product-detail-wrapper";

      await this.renderProduct();
      layoutWrapper.append(this.productSection);

      const slider = new ProductImageSlider(this.product.images);
      layoutWrapper.append(slider.create("small"));

      this.container.append(layoutWrapper);
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 10);
      return this.container;
    } catch {
      await PageRouter.renderPage(PageType.notfound);
    }
  },

  setProductKey(key: string | undefined): void {
    this.productKey = key;
  },

  async renderProduct() {
    removeAllChildren(this.productSection);
    this.productSection.className = "product-details";

    if (this.product) {
      const headerRow = document.createElement("div");
      headerRow.className = "product-header-row";

      const title = document.createElement("h1");
      title.textContent = SETTINGS.label.product.title;

      const backButton = document.createElement("button");
      backButton.textContent = `← ${SETTINGS.label.product.backButton}`;
      backButton.className = "back-to-catalog-btn";
      backButton.addEventListener("click", () => {
        CatalogView.isSamePage = false;
        CatalogViewFiltering.buildPath();
      });

      headerRow.append(title, backButton);
      this.productSection.append(headerRow);

      const productInformation = ProductCard.renderProductInformation(
        this.product,
      );

      this.productSection.append(productInformation);
      // Variant selection if available
      if (this.product.variants.length > 0) {
        const variantSelector = this.createVariantSelector();
        this.productSection.append(variantSelector);
      }

      // Add/Remove from cart button
      const cartButton = this.createCartButton();
      this.productSection.append(cartButton);

      // Display cart info if product is in cart
      this.displayCartItemInfo();
    }
  },

  getSelectedVariant(): InVariant | undefined {
    if (!this.selectedVariantId || !this.product) return undefined;

    if (this.selectedVariantId === this.product.variantId) {
      return {
        id: this.product.variantId,
        sku: this.product.sku,
        images: this.product.images,
        price: this.product.price,
        currencyCode: this.product.currencyCode,
        discountedPrice: this.product.discountedPrice,
        isDiscounted: this.product.isDiscounted,
        attributes: this.product.attributes,
        available: this.product.available,
      };
    }

    return this.product.variants.find((v) => v.id === this.selectedVariantId);
  },

  createVariantSelector(): HTMLElement {
    if (!this.product) return document.createElement("div");

    const container = document.createElement("div");
    container.className = "variant-selector";

    const label = document.createElement("label");
    label.textContent = "Select variant:";
    container.append(label);

    const currency = SETTINGS.currentCurrency;

    // Фільтруем усе валідныя варыянты
    const validVariants: (InVariant | InProduct)[] = [];

    if (
      this.product.variantId &&
      this.product.currencyCode === currency &&
      typeof this.product.price === "number" &&
      this.product.price !== 0
    ) {
      validVariants.push(this.product);
    }

    for (const variant of this.product.variants) {
      if (
        variant.currencyCode === currency &&
        typeof variant.price === "number" &&
        variant.price !== 0
      ) {
        validVariants.push(variant);
      }
    }

    if (validVariants.length === 1) {
      const variant: InVariant | InProduct = validVariants[0];

      const variantId =
        "id" in variant ? variant.id : (variant as InProduct).variantId;

      this.selectedVariantId = variantId as number;

      const input = document.createElement("input");
      input.type = "text";
      input.disabled = true;
      input.className = "variant-display";
      input.value = this.getVariantDescription(variant);

      container.append(input);
      return container;
    }

    const select = document.createElement("select");
    select.className = "variant-select";

    for (const variant of validVariants) {
      const option = document.createElement("option");
      option.value = variant.id.toString();
      option.textContent = this.getVariantDescription(variant);
      option.selected = this.selectedVariantId === variant.id;
      select.append(option);
    }

    select.addEventListener("change", (event_) => {
      this.selectedVariantId = Number.parseInt(
        (event_.target as HTMLSelectElement).value,
      );
      this.renderProduct();
    });

    container.append(select);
    return container;
  },

  getVariantDescription(variant: InVariant | InProduct): string {
    if (!variant.attributes) return "Default variant";

    const attributes: string[] = [];

    for (const [key, value] of Object.entries(variant.attributes)) {
      if (typeof value === "object" && value !== null && "label" in value) {
        const labelValue = value.label;

        if (typeof labelValue === "object" && labelValue !== null) {
          const localized = localizeName(labelValue);
          if (localized) attributes.push(`${key}: ${localized}`);
        } else if (typeof labelValue === "string") {
          attributes.push(`${key}: ${labelValue}`);
        }
      }
    }

    return attributes.join(", ") || "Default variant";
  },

  createCartButton(): HTMLElement {
    const container = document.createElement("div");
    container.className = "cart-button-container";

    const isInCart = this.isProductInCart();

    if (isInCart) {
      const removeButton = document.createElement("button");
      removeButton.className = "product-remove-from-cart-btn";
      removeButton.textContent = "Remove from Cart";
      removeButton.addEventListener("click", async () => {
        await this.removeFromCart();
      });
      container.append(removeButton);
    } else {
      const addButton = document.createElement("button");
      addButton.className = "product-add-to-cart-btn";
      addButton.textContent = "Add to Cart";
      addButton.addEventListener("click", async () => {
        await this.addToCart();
      });
      container.append(addButton);
    }

    return container;
  },

  isProductInCart(): boolean {
    if (!this.product || !this.currentCart) return false;

    return this.currentCart.lineItems.some(
      (item) =>
        item.productId === this.product?.id &&
        item.variantId === this.selectedVariantId,
    );
  },

  async addToCart(): Promise<void> {
    if (!this.product || !this.selectedVariantId) return;

    try {
      const variant = this.getSelectedVariant();
      if (!variant) return;

      await basketService.addItemToCart(
        this.product.key || this.product.id,
        this.selectedVariantId,
        1, // quantity
      );

      // Refresh cart and UI
      this.currentCart = await basketService.getCart();
      basketStore.setCart(this.currentCart);
      await this.renderProduct();

      // Show success message
      this.showMessage("Product added to cart!", "success");
    } catch (error) {
      console.error("Error adding to cart:", error);
      this.showMessage("Failed to add product to cart", "error");
    }
  },

  async removeFromCart(): Promise<void> {
    if (!this.product || !this.currentCart) return;

    try {
      const lineItem = this.currentCart.lineItems.find(
        (item) =>
          item.productId === this.product?.id &&
          item.variantId === this.selectedVariantId,
      );

      if (!lineItem) return;

      await basketService.changeItemQuantity(lineItem.id, 0);

      // Refresh cart and UI
      this.currentCart = await basketService.getCart();
      basketStore.setCart(this.currentCart);
      await this.renderProduct();

      // Show success message
      this.showMessage("Product removed from cart!", "success");
    } catch (error) {
      console.error("Error removing from cart:", error);
      this.showMessage("Failed to remove product from cart", "error");
    }
  },

  displayCartItemInfo(): void {
    if (!this.product || !this.currentCart) return;

    const lineItem = this.currentCart.lineItems.find(
      (item) =>
        item.productId === this.product?.id &&
        item.variantId === this.selectedVariantId,
    );

    if (!lineItem) return;

    const infoContainer = document.createElement("div");
    infoContainer.className = "product-cart-item-info";

    infoContainer.innerHTML = `
      <p>This item is in your cart (Quantity: ${lineItem.quantity})</p>
    `;

    this.productSection.append(infoContainer);
  },

  showMessage(message: string, type: "success" | "error"): void {
    const messageElement = document.createElement("div");
    messageElement.className = `product-message ${type}`;
    messageElement.textContent = message;

    this.productSection.append(messageElement);

    // Remove message after 3 seconds
    setTimeout(() => {
      messageElement.remove();
    }, 3000);
  },
};

export default ProductView;
