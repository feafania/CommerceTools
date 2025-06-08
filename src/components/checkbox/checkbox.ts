import "./checkbox.css";
import { ControlConfig } from "@/types/interfaces";
import { classesToArray, getState, saveState } from "@/utils/helpers";
import { createLabel } from "@/components/label/label";
import { LabelPosition } from "@/types/enum";

export default function createCheckbox(
  object: ControlConfig,
  labelPosition: LabelPosition = LabelPosition.Right,
): HTMLDivElement {
  const classNames = classesToArray(object.class);

  const wrapper = document.createElement("div");
  if (object.id) {
    wrapper.id = `${object.id}-wrapper`;
  }
  wrapper.classList.add("checkbox-wrapper", "custom-checkbox");

  let label: HTMLLabelElement | undefined;
  if (object.label) {
    label = createLabel(object);
  }

  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = object.id ?? `input-${Date.now()}`;
  input.name = object.name || "";
  input.classList.add("input");
  input.disabled = object.disabled || false;
  input.required = object.required || false;

  const savedValue = getState(input.id);

  if (object.value !== undefined) {
    input.value = object.value;
  } else if (typeof savedValue === "string" && !object.forbidValueChange) {
    input.value = savedValue;
  }
  input.checked = input.value === "on";

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
  if (labelPosition === LabelPosition.Left && label) {
    wrapper.append(label, input);
  } else if (label) {
    wrapper.append(input, label);
  } else {
    wrapper.append(input);
  }

  return wrapper;
}
