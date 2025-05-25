// import "./button.css";
import { ControlConfig } from "@/types/interfaces";
import { classesToArray } from "@/utils/helpers";

export default function createButton(
  object: ControlConfig,
  onClick?: () => void,
): HTMLButtonElement {
  const classNames = classesToArray(object.class);

  const control = document.createElement("button");
  if (object.type) {
    control.type = object.type as "button" | "submit" | "reset";
  }
  if (object.name) {
    control.textContent = object.name;
  }
  if (object.id) {
    control.id = object.id;
  }

  for (const className of classNames) {
    if (className) {
      control.classList.add(className);
    }
  }

  control.disabled = object.disabled || false;

  control.addEventListener("click", () => {
    if (onClick) onClick();
  });

  return control;
}
