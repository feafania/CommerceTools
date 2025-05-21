import { SelectConfig } from "@/types/interfaces";
import { getState, saveState } from "@/utils/helpers";
import { ValidationType } from "@/types/types";

export default function createSelect(object: SelectConfig): HTMLDivElement {
  const wrapper = document.createElement("div");
  const id = object.id ?? `select-${Date.now()}`;
  wrapper.id = object.id ? `${object.id}-wrapper` : "";
  wrapper.className = object.class ? `${object.class}-wrapper` : "";
  wrapper.classList.add("input-wrapper");

  if (object.label) {
    const label = document.createElement("label");
    label.textContent = object.label;
    label.htmlFor = id;
    label.className = object.class ? `${object.class}-label` : "";
    label.classList.add("input-label");
    wrapper.append(label);
  }

  const select = document.createElement("select");
  if (object.name) {
    select.name = object.name;
  }
  select.id = id;
  select.className = object.class ?? "";
  select.classList.add("input");
  select.value = getState(select.id) || "";

  if (Array.isArray(object.options)) {
    for (const optionValue of object.options) {
      const option = document.createElement("option");
      option.value = optionValue;
      option.textContent = optionValue;
      select.append(option);
    }
  }

  select.addEventListener("input", () => {
    saveState({ key: select.id, value: select.value });
    if (object.validation) {
      validateSelect(wrapper, object.validation);
    }
  });
  wrapper.append(select);
  return wrapper;
}

function validateSelect(wrapper: HTMLElement, validation: ValidationType) {
  const select = wrapper.querySelector("select");
  const value = select?.value || "";

  let isValid = true;

  if (validation.pattern) {
    isValid = validation.pattern.test(value);
  } else if (validation.isValid) {
    isValid = validation.isValid(value);
  }

  let errorDiv = wrapper.querySelector("#input-error");

  if (isValid) {
    errorDiv?.remove();
  } else {
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.id = "input-error";
      errorDiv.className = "error-message";
      errorDiv.textContent = validation.message;
      select?.after(errorDiv);
    }
  }
}
