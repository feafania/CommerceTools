import { ValidationType } from "./types";

import { PageType } from "@/types/enum";

type ControlBase = {
  type: string;
  label: string;
  name: string;
  placeholder: string;
  id: string;
  class: string;
  disabled: boolean;
  required: boolean;
  validation: ValidationType;
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

export interface UserType {
  login: string;
  password?: string;
  isLogined?: boolean;
}
