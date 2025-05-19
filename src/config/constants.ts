import { ValidationType } from "@/types/types";
import { PageType } from "@/types/enum";

export const VIEW_CONTAINER_NAME = "view-container";

export const VALIDATION = {
  username: {
    pattern: /^[a-zA-Z0-9]{4,30}$/,
    message:
      "Username must be between 4 and 30 characters long " +
      "and contain only letters of Latin alphabet and numbers.",
  } as ValidationType,
  password: {
    pattern: /^(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]{6,}$/,
    message:
      "Password must be at least 6 characters long " +
      "and include at least one number and one uppercase letter.",
  } as ValidationType,
};

export const DEFAULT_PAGE = PageType.main;
export const NOT_FOUND_PAGE = PageType.notfound;
