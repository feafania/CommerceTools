// import "./input.css";
import { ControlConfig } from "@/types/interfaces";
import { getState, saveState } from "@/utils/helpers";
import { ValidationType } from "@/types/types";

export default function createInput(object: ControlConfig): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.id = object.id ? `${object.id}-wrapper` : "";
  wrapper.className = object.class ? `${object.class}-wrapper` : "";
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
  input.value = getState(input.id) || "";
  input.className = object.class ?? "";
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

function createLabel(object: ControlConfig): HTMLLabelElement {
  const label = document.createElement("label");
  if (object.label) {
    label.textContent = object.label;
  }
  if (object.id) {
    label.id = `${object.id}-label`;
    label.htmlFor = object.id;
  }
  label.className = object.class ? `${object.class}-label` : "";
  label.classList.add("input-label");
  return label;
}

function validateInput(wrapper: HTMLElement, validation: ValidationType) {
  const input = wrapper.querySelector("input");
  const value = input?.value || "";
  const isValid = validation.pattern.test(value);
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
