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
  // globalThis.addEventListener("languageChanged", () => {
  //   Header.renderNav();
  // });
  PageRouter.init();
  if (authStore.user) {
    // wsClient.login(authStore.user);
  }
}
