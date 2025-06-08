import { PageType } from "@/types/enum";
import routes from "@/config/routes";
import Header from "@/components/layout/header/header";
import { removeAllChildren } from "@/utils/helpers";

export async function renderPage(page: PageType) {
  const render = await routes[page]?.render;
  if (render) {
    const element = await render();
    const container = document.querySelector("#view-container");
    if (container && element) {
      removeAllChildren(container);
      container.append(element);
    }
  }
  Header.renderNav();
}
