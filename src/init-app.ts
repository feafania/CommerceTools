import "./global.css";
import Header from "@/components/layout/header/header";
import createMain from "@/components/layout/main/main";
import createFooter from "@/components/layout/footer/footer";
import PageRouter from "@/router/page-router";
import authStore from "@/stores/auth-store";

export default function initApp(root: HTMLElement) {
  root.innerHTML = "";

  const header = Header.create();
  const main = createMain();
  const footer = createFooter();

  root.append(header, main, footer);
  globalThis.addEventListener("languageChanged", () => {
    Header.renderNav();
    //page which is active now, at that moment
    //maybe at router - ask chatGPT //how to detect an opened page
    //try it 1) getPathFromUrl => 2)navigateTo it should work.
  });

  globalThis.addEventListener("languageChanged", () => {
    const newHeader = Header.create();
    const newMain = createMain();
    const newFooter = createFooter();

    const oldHeader = document.querySelector("header");
    const oldMain = document.querySelector("main");
    const oldFooter = document.querySelector("footer");

    if (oldHeader && oldHeader.parentNode) {
      oldHeader.parentNode.replaceChild(newHeader, oldHeader);
    }

    if (oldMain && oldMain.parentNode) {
      oldMain.parentNode.replaceChild(newMain, oldMain);
    }

    if (oldFooter && oldFooter.parentNode) {
      oldFooter.parentNode.replaceChild(newFooter, oldFooter);
    }
  });

  PageRouter.init();
  if (authStore.user) {
    // wsClient.login(authStore.user);
  }
}
