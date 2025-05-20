import "./spinner.css";

export function showReconnectOverlay(): void {
  let overlay = document.querySelector(".reconnect-overlay") as HTMLElement;
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "reconnect-overlay";

    const content = document.createElement("div");
    content.className = "overlay-content";

    const spinner = document.createElement("div");
    spinner.className = "spinner";

    const text = document.createElement("div");
    text.className = "spinner-text";
    text.textContent = "Trying to reconnect...";

    content.append(spinner, text);
    overlay.append(content);
    document.body.append(overlay);
  }
  if (overlay) {
    overlay.style.display = "flex";
  }
}

export function hideReconnectOverlay() {
  const overlay = document.querySelector(".reconnect-overlay") as HTMLElement;
  if (overlay) {
    overlay.style.display = "none";
  }
}
