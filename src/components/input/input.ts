import "./input.css";
import { ControlConfig } from "@/types/interfaces";
import { classesToArray, getState } from "@/utils/helpers";
import { createValidationBlock } from "@/utils/validation";
import { createLabel } from "@/components/label/label";

export default function createInput(object: ControlConfig): HTMLDivElement {
  const classNames = classesToArray(object.class);

  const wrapper = document.createElement("div");
  if (object.id) {
    wrapper.id = `${object.id}-wrapper`;
  }
  wrapper.classList.add("input-wrapper");

  if (object.label) {
    const label = createLabel(object);
    wrapper.append(label);
  }

  const input = document.createElement(
    object.type === "textarea" ? "textarea" : "input",
  );
  if (input instanceof HTMLInputElement) {
    input.type = object.type || "text";
  }
  input.placeholder = object.placeholder || "";
  input.id = object.id ?? `input-${Date.now()}`;
  input.name = object.name || "";
  input.classList.add("input");
  input.disabled = object.disabled || false;
  input.required = object.required || false;

  const savedValue = getState(input.id);
  if (object.value !== undefined) {
    input.value = object.value;
  } else if (typeof savedValue === "string") {
    input.value = savedValue;
  }

  if (object.validationName) {
    input.dataset.validationName = object.validationName;
  }
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
  createValidationBlock(input, wrapper);
  return wrapper;
}
