import "./product-image-slider.css";
import { ProductImage } from "@/types/interfaces";
import {
  disableScroll,
  enableScroll,
} from "@/components/modal-window/modal-window";

export default class ProductImageSlider {
  container: HTMLDivElement;
  private images: ProductImage[];
  private currentIndex = 0;
  private imageElement: HTMLImageElement;
  private dotsContainer: HTMLDivElement;
  private modalContainer: HTMLDivElement | undefined;

  constructor(images: ProductImage[] = []) {
    this.images = images.length > 0 ? images : [];
    this.container = document.createElement("div");
    this.container.className = "image-slider";

    this.imageElement = document.createElement("img");
    this.imageElement.className = "image-slider-image";

    this.dotsContainer = document.createElement("div");
    this.dotsContainer.className = "image-slider-dots";
  }

  create(variant: "small" | "large" = "small"): HTMLDivElement {
    if (variant === "large") {
      this.container.classList.add("image-slider-large");
    } else {
      this.container.classList.add("image-slider-small");
    }

    if (this.images.length === 0) return this.container;

    this.updateImage();

    const viewWrapper = document.createElement("div");
    viewWrapper.className = "image-slider-view";

    const imgWrapper = document.createElement("div");
    imgWrapper.className = "image-slider-view";
    imgWrapper.append(this.imageElement);
    if (variant === "small") {
      imgWrapper.style.cursor = "pointer";
      imgWrapper.addEventListener("click", () => {
        this.createModalSlider(this.currentIndex);
      });
    }

    viewWrapper.append(imgWrapper);

    if (this.images.length > 1) {
      const leftArrow = this.createArrow("left");
      const rightArrow = this.createArrow("right");
      viewWrapper.append(leftArrow, rightArrow);
      this.renderDots();
    }

    this.container.append(viewWrapper, this.dotsContainer);

    return this.container;
  }

  private updateImage() {
    this.imageElement.src = this.images[this.currentIndex]?.url || "";
    this.imageElement.alt = `Product image ${this.currentIndex + 1}`;

    this.updateDots();
  }

  private createArrow(direction: "left" | "right"): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = `image-slider-arrow ${direction}`;
    button.innerHTML = direction === "left" ? "&#10094;" : "&#10095;";
    button.addEventListener("click", () => {
      this.currentIndex =
        direction === "left"
          ? (this.currentIndex - 1 + this.images.length) % this.images.length
          : (this.currentIndex + 1) % this.images.length;
      this.updateImage();
    });
    return button;
  }

  private renderDots() {
    this.dotsContainer.innerHTML = "";
    for (const [index] of this.images.entries()) {
      const dot = document.createElement("span");
      dot.className = "image-slider-dot";
      dot.addEventListener("click", () => {
        this.currentIndex = index;
        this.updateImage();
      });
      this.dotsContainer.append(dot);
    }
    this.updateDots();
  }

  private updateDots() {
    for (const [index, dot] of [...this.dotsContainer.children].entries()) {
      dot.classList.toggle("active", index === this.currentIndex);
    }
  }

  private createModalSlider(startIndex: number) {
    disableScroll();
    document.body.classList.add("no-scroll");
    const modalSlider = new ProductImageSlider(this.images);
    modalSlider.currentIndex = startIndex;

    const modalContent = modalSlider.create("large");

    const modal = document.createElement("div");
    modal.className = "image-slider-modal";
    modal.append(modalContent);

    const closeButton = document.createElement("button");
    closeButton.className = "image-slider-close";
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", () => this.closeModal());

    modal.append(closeButton);

    const overlay = document.createElement("div");
    overlay.className = "image-slider-overlay";
    overlay.addEventListener("click", () => this.closeModal());

    this.modalContainer = document.createElement("div");
    this.modalContainer.className = "image-slider-wrapper";
    this.modalContainer.append(overlay, modal);
    document.body.append(this.modalContainer);
  }

  private closeModal() {
    if (this.modalContainer) {
      this.modalContainer.remove();
      this.modalContainer = undefined;
      document.body.classList.remove("no-scroll");
      enableScroll();
    }
  }
}
