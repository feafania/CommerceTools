import { RouteType } from "@/types/types";
import { PageType } from "@/types/enum";
import authStore from "@/stores/auth-store";
import LoginView from "@/pages/login/login";
import MainView from "@/pages/main/main";
import renderAboutView from "@/pages/about/about";
import NotFoundView from "@/pages/notfound/notfound";
import RegistrationView from "@/pages/registration/registration";

const routes: Partial<Record<PageType, RouteType>> = {
  [PageType.login]: {
    canActivate: () => !authStore.user,
    render: LoginView.render.bind(LoginView),
  },
  [PageType.registration]: {
    canActivate: () => !authStore.user,
    render: RegistrationView.render.bind(RegistrationView),
  },
  [PageType.main]: {
    canActivate: () => Boolean(authStore.user),
    render: MainView.render.bind(MainView),
  },
  [PageType.about]: {
    canActivate: () => true,
    render: renderAboutView,
  },
  [PageType.notfound]: {
    canActivate: () => true,
    render: NotFoundView.render.bind(NotFoundView),
  },
  [PageType.catalog]: {
    canActivate: () => true,
    render: () => Promise.resolve(document.createElement("div")),
  },
  [PageType.detailed]: {
    canActivate: () => true,
    render: () => Promise.resolve(document.createElement("div")),
  },
  [PageType.profile]: {
    canActivate: () => Boolean(authStore.user),
    render: () => Promise.resolve(document.createElement("div")),
  },
  [PageType.basket]: {
    canActivate: () => true,
    render: () => Promise.resolve(document.createElement("div")),
  },
};

export default routes;
