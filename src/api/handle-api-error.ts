import { CTApiError, CTErrorObject } from "@/types/types";
import translations from "@/config/interfaces";
import { SETTINGS } from "@/config/settings";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public errorMessage: string,
    public invalidFields?: string[],
  ) {
    super(errorMessage);
    this.name = "ApiError";
  }
}

function localizeMessage(message: string) {
  if (message.includes("credentials"))
    return translations[SETTINGS.currentLang].errorsTypes.credentials;
  if (message.includes("Duplicate"))
    return translations[SETTINGS.currentLang].errorsTypes.duplicate;
  if (message.includes("Invalid"))
    return translations[SETTINGS.currentLang].errorsTypes.invalid;
  if (message.includes("Required"))
    return translations[SETTINGS.currentLang].errorsTypes.required;
  return translations[SETTINGS.currentLang].errorsTypes.unknown;
}

export function handleApiError(error: unknown): never {
  const error_ = error as CTApiError;
  const statusCode = error_?.body?.statusCode ?? 500;
  const fallbackMessage =
    error_?.body?.message ??
    translations[SETTINGS.currentLang].errorsTypes.unknown;
  const errors = (error_?.body?.errors ?? []) as CTErrorObject[];

  const fields: string[] = [];

  const detailedMessages = errors.map((mError) => {
    if ("field" in mError && typeof mError.field === "string") {
      fields.push(mError.field);
      const localized = localizeMessage(mError.message);
      return `• ${mError.field}: ${localized}`;
    }

    const localized = localizeMessage(mError.message);
    return `• ${localized}`;
  });

  const modalMessage =
    detailedMessages.length > 0 ? detailedMessages.join("\n") : fallbackMessage;

  throw new ApiError(statusCode, modalMessage, fields);
}
