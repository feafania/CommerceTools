import { InCart } from "@/types/interfaces";
import { saveLocalState } from "@/utils/helpers";
import { CART_ID_STORAGE_KEY } from "@/config/constants";

export class BasketStore {
  private cart: InCart | undefined = undefined;
  private listeners: Set<() => void> = new Set();

  getCart(): InCart | undefined {
    return this.cart;
  }

  setCart(cart: InCart | undefined): void {
    this.cart = cart;

    if (cart?.id) {
      saveLocalState({ key: CART_ID_STORAGE_KEY, value: cart.id });
    } else {
      saveLocalState({ key: CART_ID_STORAGE_KEY, value: "" });
    }

    this.notify();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    for (const listener of this.listeners) listener();
  }

  isEmpty(): boolean {
    return !this.cart || this.cart.lineItems.length === 0;
  }

  clearCart(): void {
    this.setCart(undefined);
  }
}

// const unsubscribe = basketStore.subscribe(() => {
//   console.log("Cart was updated:", basketStore.getCart());
// });
//
// // ...unsubscribe() if there is no need to listen any more

const basketStore = new BasketStore();

export default basketStore;
