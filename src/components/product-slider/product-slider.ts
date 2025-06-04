import ProductCard from "@/components/product-card/product-card";
import { InProduct } from "@/types/interfaces";
import "./product-slider.css";
import { CARD_SETTINGS } from "@/config/constants";

const ProductSlider = {
  currentOffset: 0,
  products: [] as InProduct[],
  track: undefined as HTMLDivElement | undefined,
  container: undefined as HTMLElement | undefined,
  previousButton: undefined as HTMLButtonElement | undefined,
  nextButton: undefined as HTMLButtonElement | undefined,

  async create(initialProducts: InProduct[] = []): Promise<HTMLElement> {
    this.products = initialProducts;
    this.currentOffset = 0;

    this.container = document.createElement("div");
    this.container.className = "product-slider";

    const sliderWrapper = document.createElement("div");
    sliderWrapper.className = "slider-wrapper";

    this.track = document.createElement("div");
    this.track.className = "slider-track";

    sliderWrapper.append(this.track);
    await this.renderSlides();

    this.previousButton = this.createArrow("left", this.scrollLeft.bind(this));
    this.nextButton = this.createArrow("right", this.scrollRight.bind(this));

    this.container.append(this.previousButton, sliderWrapper, this.nextButton);
    this.updateNavButtons();

    window.addEventListener("resize", this.handleResize.bind(this));

    return this.container;
  },

  createArrow(
    direction: "left" | "right",
    onClick: () => void,
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = `slider-arrow ${direction}`;
    button.innerHTML = direction === "left" ? "&lt;" : "&gt;";
    button.addEventListener("click", onClick);
    return button;
  },

  async renderSlides(): Promise<void> {
    if (!this.track) return;
    this.track.innerHTML = "";

    for (const product of this.products) {
      const slide = document.createElement("div");
      slide.className = "slide";
      slide.style.minWidth = `${CARD_SETTINGS.cardWidth}px`;
      slide.style.marginRight = `${CARD_SETTINGS.cardGap}px`;

      const cardElement = await ProductCard.create(product);
      slide.append(cardElement);
      this.track.append(slide);
    }

    this.updateTransform();
  },

  scrollLeft(): void {
    this.currentOffset = Math.max(
      0,
      this.currentOffset - CARD_SETTINGS.slideStep,
    );
    this.updateTransform();
    this.updateNavButtons();
  },

  scrollRight(): void {
    const visibleCards = this.getVisibleCardsCount();
    const maxOffset = Math.max(0, this.products.length - visibleCards);

    if (this.currentOffset < maxOffset) {
      this.currentOffset = Math.min(
        this.currentOffset + CARD_SETTINGS.slideStep,
        maxOffset,
      );
      this.updateTransform();
      this.updateNavButtons();
    }
  },

  getVisibleCardsCount(): number {
    const containerWidth = this.container?.offsetWidth ?? 0;
    return Math.floor(
      containerWidth / (CARD_SETTINGS.cardWidth + CARD_SETTINGS.cardGap),
    );
  },

  updateTransform(): void {
    if (!this.track) return;

    const offsetX =
      this.currentOffset * (CARD_SETTINGS.cardWidth + CARD_SETTINGS.cardGap);
    this.track.style.transform = `translateX(-${offsetX}px)`;
  },

  updateNavButtons(): void {
    if (!this.previousButton || !this.nextButton || !this.container) return;

    const visibleCards = this.getVisibleCardsCount();
    const maxOffset = Math.max(0, this.products.length - visibleCards);

    const allVisible = this.products.length <= visibleCards;

    this.previousButton.disabled = this.currentOffset === 0 || allVisible;
    this.nextButton.disabled = this.currentOffset >= maxOffset || allVisible;

    // Hide buttons if only one card
    if (allVisible) {
      this.previousButton.style.visibility = "hidden";
      this.nextButton.style.visibility = "hidden";
    } else {
      this.previousButton.style.visibility = "visible";
      this.nextButton.style.visibility = "visible";
    }
  },

  handleResize(): void {
    this.updateTransform();
    this.updateNavButtons();
  },
};

export default ProductSlider;
