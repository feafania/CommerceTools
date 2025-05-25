import "./notfound.css";
import { PageType } from "@/types/enum";
import PageRouter from "@/router/page-router";

const NotFoundView = {
  async render(): Promise<HTMLElement> {
    const container = document.createElement("div");
    container.className = "not-found-container";

    container.innerHTML = `
      <div class="not-found-content">
        <h1 class="fade-in">404 - Page Not Found</h1>
        <p class="fade-in delay-1">Oops! The page you’re looking for doesn’t exist.</p>
        <p class="fade-in delay-2">URL: <code>${location.hash}</code></p>
        <button class="back-button fade-in delay-3">Back to Main Page</button>
      </div>
    `;

    container.querySelector("button")?.addEventListener("click", () => {
      PageRouter.navigateTo(PageType.main);
    });

    for (const element of container.querySelectorAll(".fade-in")) {
      requestAnimationFrame(() => {
        element.classList.add("animate");
      });
    }

    return container;
  },
};

export default NotFoundView;
