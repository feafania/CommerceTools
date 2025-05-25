import "./checkbox.css";
import { ControlConfig } from "@/types/interfaces";
import { classesToArray, getState, saveState } from "@/utils/helpers";
import { createLabel } from "@/components/label/label";

export default function createCheckbox(object: ControlConfig): HTMLDivElement {
  const classNames = classesToArray(object.class);

  const wrapper = document.createElement("div");
  if (object.id) {
    wrapper.id = `${object.id}-wrapper`;
  }
  wrapper.classList.add("checkbox-wrapper", "custom-checkbox");

  if (object.label) {
    const label = createLabel(object);
    wrapper.append(label);
  }

  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = object.id ?? `input-${Date.now()}`;
  input.name = object.name || "";
  input.classList.add("input");
  input.disabled = object.disabled || false;
  input.required = object.required || false;

  const savedValue = getState(input.id);
  if (typeof savedValue === "string") {
    input.checked = savedValue === "on";
  }
  input.value = input.checked ? "on" : "off";

  input.addEventListener("change", () => {
    input.value = input.checked ? "on" : "off";
    saveState({
      key: input.id,
      value: input.value,
    });
  });

  if (object.relatedCountryField) {
    input.dataset.relatedCountryField = object.relatedCountryField;
  }

  for (const className of classNames) {
    if (className) {
      wrapper.classList.add(`${className}-wrapper`);
      input.classList.add(className);
    }
  }
  wrapper.append(input);
  return wrapper;
}
