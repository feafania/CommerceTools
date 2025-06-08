import { RouteType } from "@/types/types";
import { PageType } from "@/types/enum";
import authStore from "@/stores/auth-store";
import MainView from "@/pages/main/main";
import renderAboutView from "@/pages/about/about";
import NotFoundView from "@/pages/notfound/notfound";
import LoginRegistrationView from "@/pages/login-registration/login-registration";
import UserProfile from "@/pages/profile/profile";
import CatalogView2 from "@/pages/catalog2/catalog";
import ProductView from "@/pages/product/product";
import ChangePassword from "@/pages/change-password/change-password";

const routes: Partial<Record<PageType, RouteType>> = {
  [PageType.login]: {
    canActivate: () => !authStore.user,
    render: LoginRegistrationView.renderLoginForm.bind(LoginRegistrationView),
  },
  [PageType.registration]: {
    canActivate: () => !authStore.user,
    render: LoginRegistrationView.renderRegistrationForm.bind(
      LoginRegistrationView,
    ),
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
    render: CatalogView2.render.bind(CatalogView2),
  },
  [PageType.product]: {
    canActivate: () => true,
    render: ProductView.render.bind(ProductView),
  },
  [PageType.profile]: {
    canActivate: () => !!authStore.user,
    render: UserProfile.render.bind(UserProfile),
  },
  [PageType.basket]: {
    canActivate: () => true,
    render: () => Promise.resolve(document.createElement("div")),
  },
  [PageType.changePassword]: {
    canActivate: () => !!authStore.user,
    render: ChangePassword.render.bind(ChangePassword),
  },
};

export default routes;
