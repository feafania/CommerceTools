import "./global-overlay.css";

const globalOverlay = {
  overlay: undefined as HTMLDivElement | undefined,
  create(): HTMLDivElement {
    if (!this.overlay) {
      this.overlay = document.createElement("div");
      this.overlay.id = "global-overlay";
    }
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
