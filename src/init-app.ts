import "./global.css";
import Header from "@/components/layout/header/header";
import createMain from "@/components/layout/main/main";
import createFooter from "@/components/layout/footer/footer";
import PageRouter from "@/router/page-router";
import { loadUser } from "@/utils/helpers";

export default async function initApp(root: HTMLElement) {
  root.innerHTML = "";
  await loadUser();

  const header = Header.create();
  const main = createMain();
  const footer = createFooter();

  root.append(header, main, footer);

  globalThis.addEventListener("languageChanged", () => {
    Header.setTitle();
    Header.renderNav();
    PageRouter.handleRoute();
  });

  PageRouter.init();
}
