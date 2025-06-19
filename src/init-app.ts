import "./global.css";
import Header from "@/components/layout/header/header";
import createMain from "@/components/layout/main/main";
import createFooter from "@/components/layout/footer/footer";
import PageRouter from "@/router/page-router";
import { loadUser } from "@/utils/helpers";
import globalOverlay from "@/components/global-overlay/global-overlay";
import CatalogView from "@/pages/catalog/catalog";

export default async function initApp(root: HTMLElement) {
  root.innerHTML = "";
  await loadUser();

  const header = Header.create();
  const main = createMain();
  const footer = createFooter();
  const overlay = globalOverlay.create();

  root.append(header, main, footer, overlay);

  globalThis.addEventListener("languageChanged", () => {
    onLanguageChange();
  });

  PageRouter.init();
}

async function onLanguageChange() {
  CatalogView.isSamePage = false;
  Header.setTitle();
  Header.renderNav();
  await PageRouter.handleRoute();
}
