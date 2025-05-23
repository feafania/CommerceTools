// import "./select.css";
import { SelectConfig } from "@/types/interfaces";
import { classesToArray, getState } from "@/utils/helpers";
import { createValidationBlock } from "@/utils/validation";
import { createLabel } from "@/components/label/label";

export default function createSelect(object: SelectConfig): HTMLDivElement {
  const classNames = classesToArray(object.class);
  const wrapper = document.createElement("div");
  const id = object.id ?? `select-${Date.now()}`;
  if (object.id) {
    wrapper.id = `${object.id}-wrapper`;
  }
  wrapper.classList.add("input-wrapper");

  if (object.label) {
    const label = createLabel(object, classNames);
    wrapper.append(label);
  }

  const select = document.createElement("select");
  if (object.name) {
    select.name = object.name;
  }
  select.id = id;
  select.classList.add("input");

  if (object.validationName) {
    select.dataset.validationName = object.validationName;
  }
  if (object.relatedCountryField) {
    select.dataset.relatedCountryField = object.relatedCountryField;
  }

  for (const className of classNames) {
    if (className) {
      wrapper.classList.add(`${className}-wrapper`);
      select.classList.add(className);
    }
  }

  if (Array.isArray(object.options)) {
    if (object.placeholder) {
      const placeholderOption = document.createElement("option");
      placeholderOption.value = "";
      placeholderOption.textContent = object.placeholder;
      placeholderOption.disabled = true;
      placeholderOption.selected = true;
      select.append(placeholderOption);
    }

    for (const optionValue of object.options) {
      const option = document.createElement("option");
      option.value = optionValue;
      option.textContent = optionValue;
      select.append(option);
    }

    const savedValue = getState(select.id);
    if (savedValue && object.options.includes(savedValue)) {
      select.value = savedValue;
    }
  }

  wrapper.append(select);
  createValidationBlock(select, wrapper);
  return wrapper;
}
