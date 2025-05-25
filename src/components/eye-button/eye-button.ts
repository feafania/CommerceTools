import eyeHide from "@/assets/svg/eye-password-hide.inline.svg";
import eyeShow from "@/assets/svg/eye-password-show.inline.svg";

export default function createEyeButton(): HTMLButtonElement {
  const eyeButton = document.createElement("button");
  eyeButton.type = "button";
  eyeButton.className = "toggle-password-button";
  eyeButton.setAttribute("aria-label", "Show password");

  const parser = new DOMParser();
  const eyeHideDocument = parser.parseFromString(eyeHide, "image/svg+xml");
  const eyeShowDocument = parser.parseFromString(eyeShow, "image/svg+xml");

  const eyeHideSvg = eyeHideDocument.documentElement;
  const eyeShowSvg = eyeShowDocument.documentElement;

  for (const svg of [eyeHideSvg, eyeShowSvg]) {
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.classList.add("toggle-password-icon");
    svg.setAttribute("role", "img");
  }

  eyeButton.append(eyeShowSvg);

  eyeButton.addEventListener("click", () => {
    const input = document.querySelector<HTMLInputElement>("#password");
    if (!input) return;

    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";

    eyeButton.innerHTML = "";
    if (isHidden) {
      eyeButton.setAttribute("aria-label", "Hide password");
      eyeButton.append(eyeHideSvg);
    } else {
      eyeButton.setAttribute("aria-label", "Show password");
      eyeButton.append(eyeShowSvg);
    }
  });

  return eyeButton;
}
