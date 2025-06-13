import "./global.css";
import Header from "@/components/layout/header/header";
import createMain from "@/components/layout/main/main";
import createFooter from "@/components/layout/footer/footer";
import PageRouter from "@/router/page-router";
import { tokenStore } from "@/stores/token-store";
import authService from "@/api/services/auth-service";
import authStore from "@/stores/auth-store";

export default async function initApp(root: HTMLElement) {
  root.innerHTML = "";
  tokenStore.loadFromCookies();

  if (tokenStore.isTokenExpired() && tokenStore.refreshToken) {
    try {
      await authService.refreshToken();
    } catch {
      authStore.setUser(undefined);
    }
  }

  if (tokenStore.accessToken) {
    try {
      await authService.getMe();
    } catch (error) {
      console.error("Couldn't get the user:", error);
    }
  }

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
