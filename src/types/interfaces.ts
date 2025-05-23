import { CountryValueType } from "./types";

import { CountryCode, PageType } from "@/types/enum";

type ControlBase = {
  type: string;
  label: string;
  name: string;
  placeholder: string;
  id: string;
  class: string | string[];
  disabled: boolean;
  required: boolean;
  validationName?: string;
  relatedCountryField?: string;
};

export interface ControlSelect extends ControlBase {
  options: string[];
}

export type ControlConfig = Partial<ControlBase>;
export type SelectConfig = Partial<ControlSelect>;

export interface StorageItem {
  key: string;
  value: string;
}

export interface NavType {
  label: string;
  page: PageType;
  visible: boolean;
}

export interface ModalOptions {
  onOk?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

export interface ValidationRule {
  pattern?: RegExp;
  isValid?: (value: string | CountryValueType) => boolean;
  message?: string;
  getValidationMessage?: (code: CountryCode) => string;
}
