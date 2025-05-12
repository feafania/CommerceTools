import "./modal-window.css";
import { ModalOptions } from "@/types/interfaces";

export default function showModalMessage(
  message: string,
  options?: ModalOptions,
): void {
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
    options?.onOk?.();
  });
  buttonsContainer.append(okButton);

  if (options?.showCancel) {
    const cancelButton = document.createElement("button");
    cancelButton.className = "modal-button cancel";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", () => {
      overlay.remove();
      options.onCancel?.();
    });
    buttonsContainer.append(cancelButton);
  }

  modal.append(text, buttonsContainer);
  overlay.append(modal);
  document.body.append(overlay);
}
