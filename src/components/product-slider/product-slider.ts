import ProductCard from "@/components/product-card/product-card";
import productService from "@/api/services/product-service";
import { InProduct } from "@/types/interfaces";
import "./product-slider.css";

const CARD_WIDTH = 320;
const SLIDE_STEP = 1;
const CARD_GAP = 16;

const ProductSlider = {
  currentOffset: 0,
  products: [] as InProduct[],
  track: undefined as HTMLDivElement | undefined,
  container: undefined as HTMLElement | undefined,
  isLoading: false,
  previousButton: undefined as HTMLButtonElement | undefined,
  nextButton: undefined as HTMLButtonElement | undefined,

  async create(initialProducts: InProduct[] = []): Promise<HTMLElement> {
    this.products = initialProducts;
    this.container = document.createElement("div");
    this.container.className = "product-slider";

    const sliderWrapper = document.createElement("div");
    sliderWrapper.className = "slider-wrapper";

    this.track = document.createElement("div");
    this.track.className = "slider-track";
    sliderWrapper.append(this.track);
    await this.renderSlides();

    const navContainer = document.createElement("div");
    navContainer.className = "slider-nav";

    this.previousButton = this.createArrow("left", this.scrollLeft.bind(this));
    this.nextButton = this.createArrow("right", this.scrollRight.bind(this));
    this.updateNavButtons();

    navContainer.append(this.previousButton, this.nextButton);
    this.container.append(sliderWrapper, navContainer);

    return this.container;
  },

  createArrow(
    direction: "left" | "right",
    onClick: () => void,
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = `slider-arrow ${direction}`;
    button.innerHTML = direction === "left" ? "&#8592;" : "&#8594;";
    button.addEventListener("click", onClick);
    return button;
  },

  async renderSlides(): Promise<void> {
    if (!this.track) return;
    this.track.innerHTML = "";

    for (const product of this.products) {
      const slide = document.createElement("div");
      slide.className = "slide";
      slide.style.minWidth = `${CARD_WIDTH}px`;
      slide.style.marginRight = `${CARD_GAP}px`;

      const cardElement = await ProductCard.create(product);
      slide.append(cardElement);
      this.track.append(slide);
    }
  },

  scrollLeft(): void {
    if (!this.track) return;
    this.currentOffset = Math.max(0, this.currentOffset - SLIDE_STEP);
    this.updateTransform();
    this.updateNavButtons();
  },

  async scrollRight(): Promise<void> {
    if (!this.track) return;

    const visibleCards = Math.floor(
      this.container!.offsetWidth / (CARD_WIDTH + CARD_GAP),
    );
    const maxOffset = Math.max(0, this.products.length - visibleCards);

    if (this.currentOffset < maxOffset) {
      this.currentOffset += SLIDE_STEP;

      if (this.currentOffset > maxOffset) {
        this.currentOffset = maxOffset;
      }

      this.updateTransform();
    }

    if (this.currentOffset >= this.products.length - visibleCards - 1) {
      await this.loadMoreProducts();
    }
    this.updateNavButtons();
  },

  updateTransform(): void {
    if (!this.track) return;
    this.track.style.transform = `translateX(-${this.currentOffset * (CARD_WIDTH + CARD_GAP)}px)`;
  },

  async loadMoreProducts(): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;

    const newOffset = this.products.length;
    const moreProducts = await productService.getProductList({
      limit: 10,
      offset: newOffset,
    });

    this.products.push(...moreProducts);
    await this.renderSlides();
    this.isLoading = false;
  },

  updateNavButtons(): void {
    if (!this.previousButton || !this.nextButton || !this.container) return;

    const visibleCards = Math.floor(
      this.container.offsetWidth / (CARD_WIDTH + CARD_GAP),
    );
    const maxOffset = Math.max(0, this.products.length - visibleCards);

    this.previousButton.disabled = this.currentOffset === 0;
    this.nextButton.disabled = this.currentOffset >= maxOffset;
  },
};

export default ProductSlider;
