(function () {
  let isMobile = window.innerWidth <= 768;
  let showFilters = false;
  let toggleButton;

  function createToggleButton() {
    if (toggleButton) return toggleButton;

    toggleButton = document.createElement("button");
    toggleButton.className = "mobile-filter-toggle";

    toggleButton.addEventListener("click", function () {
      showFilters = !showFilters;
      updateFilterVisibility();
    });

    return toggleButton;
  }

  function updateFilterVisibility() {
    const sidebar = document.querySelector(".filters-section");
    if (!sidebar) return;

    if (isMobile) {
      if (showFilters) {
        sidebar.classList.remove("mobile-filters-hidden");
        sidebar.classList.add("mobile-filters-visible");
      } else {
        sidebar.classList.remove("mobile-filters-visible");
        sidebar.classList.add("mobile-filters-hidden");
      }

      // Add toggle button if not present
      if (!sidebar.contains(toggleButton)) {
        sidebar.insertBefore(createToggleButton(), sidebar.firstChild);
      }
    } else {
      // Desktop: remove mobile classes and toggle button
      sidebar.classList.remove(
        "mobile-filters-hidden",
        "mobile-filters-visible",
      );
    }
  }

  function handleResize() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768;

    if (wasMobile !== isMobile) {
      if (!isMobile) {
        showFilters = true; // Always show on desktop
      }
      updateFilterVisibility();
    }
  }

  // Initialize
  function init() {
    createToggleButton();
    updateFilterVisibility();
    window.addEventListener("resize", handleResize);
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
