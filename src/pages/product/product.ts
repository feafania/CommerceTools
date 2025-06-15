import "./product.css";
import { removeAllChildren } from "@/utils/helpers";
import {
  InLineItem,
  InProduct,
  InProductType,
  InVariant,
} from "@/types/interfaces";
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
import createButton from "@/components/button/button";
import createInput from "@/components/input/input";
import showModalMessage from "@/components/modal-window/modal-window";
import globalOverlay from "@/components/global-overlay/global-overlay";

const ProductView = {
  productKey: undefined as string | undefined,
  product: undefined as InProduct | undefined,
  productType: undefined as InProductType | undefined,
  container: document.createElement("section"),
  productSection: document.createElement("div"),
  selectedVariantId: undefined as number | undefined,

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
      this.productType = await productService.getProductTypeByKey(
        this.product.productTypeKey,
      );
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

      const backButton = createButton(
        {
          name: `← ${SETTINGS.label.product.backButton}`,
          class: "back-to-catalog-btn",
        },
        () => {
          CatalogView.isSamePage = false;
          CatalogViewFiltering.buildPath();
        },
      );

      headerRow.append(title, backButton);
      this.productSection.append(headerRow);

      const selectedVariant = this.product.variants.find(
        (variant) => variant.id === this.selectedVariantId,
      );
      const productInformation = ProductCard.renderProductInformation(
        this.product,
        selectedVariant,
      );

      this.productSection.append(productInformation);

      if (this.product.variants.length > 0) {
        const variantSelector = this.createVariantSelector();
        this.productSection.append(variantSelector);
      }

      const cartButton = this.createCartButton();
      this.productSection.append(cartButton);

      // Display cart info if product is in cart
      await this.displayCartItemInfo();
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

    return this.product.variants.find(
      (variant) => variant.id === this.selectedVariantId,
    );
  },

  createVariantSelector(): HTMLElement {
    if (!this.product) return document.createElement("div");

    const container = document.createElement("div");
    container.className = "variant-selector";

    const label = document.createElement("label");
    label.textContent = SETTINGS.label.product.selectVariant;
    container.append(label);

    const validVariants = this.getValidVariants();

    if (validVariants.length === 1) {
      const variant: InVariant | InProduct = validVariants[0];
      const variantId = "variantId" in variant ? variant.variantId : variant.id;
      if (!variantId) return container;

      this.selectedVariantId = variantId as number;

      const input = createInput({
        type: "text",
        disabled: true,
        class: "variant-display",
        value: productService.getVariantDescription(variant, this.productType),
        forbidValueFromState: true,
      });
      container.append(input);
      return container;
    }

    const select = document.createElement("select");
    select.className = "variant-select";

    for (const variant of validVariants) {
      const variantId = "variantId" in variant ? variant.variantId : variant.id;
      if (!variantId) continue;
      const option = document.createElement("option");
      option.value = variantId.toString();
      option.textContent = productService.getVariantDescription(
        variant,
        this.productType,
      );
      option.selected = this.selectedVariantId === variantId;
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

  getValidVariants(): (InVariant | InProduct)[] {
    const currency = SETTINGS.currentCurrency;
    if (!this.product) return [];
    const validVariants: (InVariant | InProduct)[] = [];
    if (
      this.product.variantId &&
      this.product.currencyCode === currency &&
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
    return validVariants;
  },

  createCartButton(): HTMLElement {
    const container = document.createElement("div");
    container.className = "cart-button-container";

    const isInCart = this.isProductInCart();

    if (isInCart) {
      const removeButton = createButton(
        {
          class: "product-remove-from-cart-btn",
          name: `${SETTINGS.label.product.removeFromCart}`,
        },
        async () => {
          await this.removeFromCart();
        },
      );
      container.append(removeButton);
    } else {
      const addButton = createButton(
        {
          class: "product-add-to-cart-btn",
          name: `${SETTINGS.label.product.addToCart}`,
        },
        async () => {
          await this.addToCart();
        },
      );
      container.append(addButton);
    }

    return container;
  },

  isProductInCart(): boolean {
    const currentCart = basketStore.getCart();
    if (!this.product || !currentCart) return false;

    return currentCart.lineItems.some(
      (item) =>
        item.productId === this.product?.id &&
        item.variantId === this.selectedVariantId,
    );
  },

  async addToCart(): Promise<void> {
    if (!this.product || !this.selectedVariantId) return;

    globalOverlay.show();

    try {
      await basketService.addItemToCart(
        this.product.key || this.product.id,
        this.selectedVariantId,
      );

      await this.renderProduct();
      showModalMessage(SETTINGS.label.product.addedToCart);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    } finally {
      globalOverlay.hide();
    }
  },

  async removeFromCart(): Promise<void> {
    const currentCart = await basketService.getCart();
    if (!this.product || !currentCart) return;

    globalOverlay.show();

    try {
      const lineItem = currentCart.lineItems.find(
        (item) =>
          item.productId === this.product?.id &&
          item.variantId === this.selectedVariantId,
      );

      if (!lineItem) return;

      await basketService.removeItemFromCart(lineItem.id, lineItem.quantity);

      await this.renderProduct();
      showModalMessage(SETTINGS.label.product.removedFromCart);
    } catch (error) {
      console.error("Error removing product from cart:", error);
    } finally {
      globalOverlay.hide();
    }
  },

  async displayCartItemInfo() {
    const currentCart = await basketService.getCart();
    if (!this.product || !currentCart) return;

    const matchingItems = currentCart.lineItems.filter(
      (item) => item.productId === this.product?.id,
    );

    if (matchingItems.length === 0) return;

    const infoContainer = document.createElement("div");
    infoContainer.className = "product-cart-item-info";

    if (matchingItems.length === 1) {
      const item = matchingItems[0];
      const variantDescription = this.findVariantDescription(item);

      infoContainer.innerHTML = `
      <p>${SETTINGS.label.product.itemInCart}
       (${SETTINGS.label.product.quantity}: ${item.quantity})</p>
      <p>${variantDescription}</p>
    `;
    } else {
      infoContainer.innerHTML = `<p><strong>${SETTINGS.label.product.itemsInCart}:</strong></p>`;
      const list = document.createElement("ul");

      for (const item of matchingItems) {
        const variantDescription = this.findVariantDescription(item);

        const li = document.createElement("li");
        li.textContent = `${variantDescription} 
        – ${SETTINGS.label.product.quantity}: ${item.quantity}`;
        list.append(li);
      }

      infoContainer.append(list);
    }

    this.productSection.append(infoContainer);
  },

  findVariantDescription(item: InLineItem): string {
    if (!this.product) return "";
    const variant =
      item.variantId === this.product.variantId
        ? this.product
        : this.product.variants.find((v) => v.id === item.variantId);

    return variant
      ? productService.getVariantDescription(variant, this.productType)
      : `${SETTINGS.label.product.variantID}: ${item.variantId}`;
  },
};

export default ProductView;
