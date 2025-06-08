import "./modal-window.css";
import { ModalOptions } from "@/types/interfaces";

export default function showModalMessage(
  message: string,
  options?: ModalOptions,
): void {
  disableScroll();
  document.body.classList.add("no-scroll");

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal";
  const text = document.createElement("p");
  text.className = "modal-text";
  text.textContent = message;
  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "modal-buttons";

  const okButton = document.createElement("button");
  okButton.className = "modal-button ok";
  okButton.textContent = "OK";
  okButton.addEventListener("click", () => {
    overlay.remove();
    document.removeEventListener("keydown", handleKeydown);
    document.body.classList.remove("no-scroll");
    enableScroll();
    options?.onOk?.();
  });
  buttonsContainer.append(okButton);

  if (options?.showCancel) {
    const cancelButton = document.createElement("button");
    cancelButton.className = "modal-button cancel";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", () => {
      overlay.remove();
      document.removeEventListener("keydown", handleKeydown);
      document.body.classList.remove("no-scroll");
      enableScroll();
      options.onCancel?.();
    });
    buttonsContainer.append(cancelButton);
  }

  modal.append(text, buttonsContainer);
  overlay.append(modal);
  document.body.append(overlay);

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      okButton.click();
    }
  }

  document.addEventListener("keydown", handleKeydown);
}

export function disableScroll() {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";
  document.documentElement.style.scrollBehavior = "auto";
}

export function enableScroll() {
  const scrollY = Number.parseInt(document.body.style.top || "0");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  document.body.style.overflow = "";
  window.scrollTo(0, Math.abs(scrollY));
  document.documentElement.style.scrollBehavior = "smooth";
}
