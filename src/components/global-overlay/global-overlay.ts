import "./global-overlay.css";

const globalOverlay = {
  overlay: document.createElement("div") as HTMLDivElement,
  create(): HTMLDivElement {
    this.overlay.id = "global-overlay";
    return this.overlay;
  },

  show() {
    if (this.overlay) this.overlay.style.display = "block";
  },

  hide() {
    if (this.overlay) this.overlay.style.display = "none";
  },
};

export default globalOverlay;
