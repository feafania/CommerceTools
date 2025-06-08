import ProductCard from "@/components/product-card/product-card";
import { InProduct } from "@/types/interfaces";
import "./product-slider.css";
import { CARD_SETTINGS } from "@/config/constants";

export default class ProductSlider {
  #currentOffset = 0;
  #products: InProduct[] = [];
  #track: HTMLDivElement;
  container: HTMLElement;
  sliderWrapper: HTMLElement;
  previousButton: HTMLButtonElement;
  nextButton: HTMLButtonElement;

  constructor(initialProducts: InProduct[] = []) {
    this.#products = initialProducts;
    this.#currentOffset = 0;
    this.container = document.createElement("div");
    this.container.className = "catalog-product-slider";

    this.sliderWrapper = document.createElement("div");
    this.sliderWrapper.className = "catalog-slider-wrapper";
    this.previousButton = this.createArrow("left", this.scrollLeft.bind(this));
    this.nextButton = this.createArrow("right", this.scrollRight.bind(this));
    this.#track = document.createElement("div");
    this.#track.className = "catalog-slider-track";
    this.sliderWrapper.append(this.#track);
  }

  async create() {
    await this.renderSlides();
    this.container.append(
      this.previousButton,
      this.sliderWrapper,
      this.nextButton,
    );
    this.updateNavButtons();
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  private createArrow(
    direction: "left" | "right",
    onClick: () => void,
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = `catalog-slider-arrow ${direction}`;
    button.innerHTML = direction === "left" ? "&#10094;" : "&#10095;";
    button.addEventListener("click", onClick);
    return button;
  }

  private async renderSlides(): Promise<void> {
    if (!this.#track) return;
    this.#track.innerHTML = "";

    const totalWidth =
      this.#products.length * (CARD_SETTINGS.cardWidth + CARD_SETTINGS.cardGap);

    this.#track.style.width = `${totalWidth}px`;

    for (const product of this.#products) {
      const slide = document.createElement("div");
      slide.className = "catalog-slide";
      slide.style.minWidth = `${CARD_SETTINGS.cardWidth}px`;
      slide.style.marginRight = `${CARD_SETTINGS.cardGap}px`;

      const cardElement = new ProductCard(product);
      slide.append(cardElement.create());
      this.#track.append(slide);
    }

    this.updateTransform();
  }

  private scrollLeft(): void {
    this.#currentOffset = Math.max(
      0,
      this.#currentOffset - CARD_SETTINGS.slideStep,
    );
    this.updateTransform();
    this.updateNavButtons();
  }

  private scrollRight(): void {
    const visibleCards = this.getVisibleCardsCount();
    const maxOffset = Math.max(0, this.#products.length - visibleCards);

    if (this.#currentOffset < maxOffset) {
      this.#currentOffset = Math.min(
        this.#currentOffset + CARD_SETTINGS.slideStep,
        maxOffset,
      );
      this.updateTransform();
      this.updateNavButtons();
    }
  }

  private getVisibleCardsCount(): number {
    const containerWidth = this.sliderWrapper?.offsetWidth ?? 0;
    return Math.floor(
      containerWidth / (CARD_SETTINGS.cardWidth + CARD_SETTINGS.cardGap),
    );
  }

  private updateTransform(): void {
    if (!this.#track) return;

    const offsetX =
      this.#currentOffset * (CARD_SETTINGS.cardWidth + CARD_SETTINGS.cardGap);
    this.#track.style.transform = `translateX(-${offsetX}px)`;
  }

  private updateNavButtons(): void {
    if (!this.previousButton || !this.nextButton || !this.container) return;

    const visibleCards = this.getVisibleCardsCount();
    const maxOffset = Math.max(0, this.#products.length - visibleCards);

    const allVisible =
      this.#products.length <= 1 ||
      this.#products.length <= this.getVisibleCardsCount();

    this.previousButton.disabled = this.#currentOffset === 0 || allVisible;
    this.nextButton.disabled = this.#currentOffset >= maxOffset || allVisible;

    if (allVisible) {
      this.previousButton.style.visibility = "hidden";
      this.nextButton.style.visibility = "hidden";
    } else {
      this.previousButton.style.visibility = "visible";
      this.nextButton.style.visibility = "visible";
    }
  }

  private handleResize(): void {
    this.updateTransform();
    this.updateNavButtons();
  }
}
