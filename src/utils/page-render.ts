import { PageType } from "@/types/enum";
import routes from "@/config/routes";
import Header from "@/components/layout/header/header";

export async function renderPage(page: PageType) {
  const render = routes[page]?.render;
  if (render) {
    const element = await render();
    const container = document.querySelector("#view-container");
    if (container) {
      while (container.firstChild) {
        container.firstChild.remove();
      }
      container.append(element);
    }
  }
  Header.renderNav();
}
