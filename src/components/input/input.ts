// import "./input.css";
import { ControlConfig } from "@/types/interfaces";
import { classesToArray, getState, saveState } from "@/utils/helpers";
import { ValidationType } from "@/types/types";

export default function createInput(object: ControlConfig): HTMLDivElement {
  const classNames = classesToArray(object.class);

  const wrapper = document.createElement("div");
  wrapper.id = object.id ? `${object.id}-wrapper` : "";
  for (const className of classNames) {
    if (className) {
      wrapper.classList.add(`${className}-wrapper`);
    }
  }
  wrapper.classList.add("input-wrapper");

  if (object.label) {
    const label = createLabel(object, classNames);
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
  input.value = getState(input.id) || "";
  for (const className of classNames) {
    if (className) {
      input.classList.add(className);
    }
  }
  input.classList.add("input");
  input.disabled = object.disabled || false;
  input.required = object.required || false;

  input.addEventListener("input", () => {
    saveState({ key: input.id, value: input.value });
    if (object.validation) {
      validateInput(wrapper, object.validation);
    }
  });

  wrapper.append(input);
  return wrapper;
}

function createLabel(
  object: ControlConfig,
  classNames: string[],
): HTMLLabelElement {
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

function validateInput(wrapper: HTMLElement, validation: ValidationType) {
  const input = wrapper.querySelector("input");
  const value = input?.value || "";

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
      input?.after(errorDiv);
    }
  }
}
