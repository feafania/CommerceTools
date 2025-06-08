class MobileFilterToggle {
  private isMobile: boolean = window.innerWidth <= 768;
  private showFilters: boolean = false;
  private toggleButton: HTMLButtonElement | undefined;

  constructor() {
    this.init();
  }

  private createToggleButton(): HTMLButtonElement {
    if (this.toggleButton) return this.toggleButton;

    this.toggleButton = document.createElement("button");
    this.toggleButton.className = "mobile-filter-toggle";

    this.toggleButton.addEventListener("click", () => {
      this.showFilters = !this.showFilters;
      this.updateFilterVisibility();
    });

    return this.toggleButton;
  }

  private updateFilterVisibility(): void {
    const sidebar = document.querySelector(".filters-section") as HTMLElement;
    if (!sidebar) return;

    if (this.isMobile) {
      if (this.showFilters) {
        sidebar.classList.remove("mobile-filters-hidden");
        sidebar.classList.add("mobile-filters-visible");
      } else {
        sidebar.classList.remove("mobile-filters-visible");
        sidebar.classList.add("mobile-filters-hidden");
      }

      if (this.toggleButton && !sidebar.contains(this.toggleButton)) {
        sidebar.insertBefore(this.createToggleButton(), sidebar.firstChild);
      }
    } else {
      sidebar.classList.remove(
        "mobile-filters-hidden",
        "mobile-filters-visible",
      );

      if (this.toggleButton && sidebar.contains(this.toggleButton)) {
        this.toggleButton.remove();
      }
    }
  }

  private handleResize = (): void => {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;

    if (wasMobile !== this.isMobile) {
      if (!this.isMobile) {
        this.showFilters = true;
      }
      this.updateFilterVisibility();
    }
  };

  private init(): void {
    this.createToggleButton();
    this.updateFilterVisibility();
    window.addEventListener("resize", this.handleResize);
  }

  public refresh(): void {
    this.updateFilterVisibility();
  }

  public setFilterVisibility(visible: boolean): void {
    this.showFilters = visible;
    this.updateFilterVisibility();
  }

  public destroy(): void {
    window.removeEventListener("resize", this.handleResize);
    if (this.toggleButton) {
      this.toggleButton.remove();
    }
  }
}

const mobileFilterToggle = new MobileFilterToggle();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    mobileFilterToggle.refresh();
  });
} else {
  mobileFilterToggle.refresh();
}

export default mobileFilterToggle;
