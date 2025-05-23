import { ControlConfig } from "@/types/interfaces";
import { classesToArray } from "@/utils/helpers";

export function createLabel(
  object: ControlConfig,
  labelClass?: string | string[] | undefined,
): HTMLLabelElement {
  const classNames = Array.isArray(labelClass)
    ? labelClass
    : classesToArray(labelClass ?? object.class);
  const label = document.createElement("label");
  if (object.label) {
    label.textContent = object.label;
  }
  if (object.id) {
    label.id = `${object.id}-label`;
    label.htmlFor = object.id;
  }
  for (const className of classNames) {
    if (className) {
      label.classList.add(`${className}-label`);
    }
  }
  label.classList.add("input-label");
  return label;
}
