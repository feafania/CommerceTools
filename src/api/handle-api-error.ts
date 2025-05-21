import { CTApiError, CTErrorObject } from "@/types/types";
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
    return SETTINGS.label.errorsTypes.credentials;
  if (message.includes("Duplicate"))
    return SETTINGS.label.errorsTypes.duplicate;
  if (message.includes("Invalid")) return SETTINGS.label.errorsTypes.invalid;
  if (message.includes("Required")) return SETTINGS.label.errorsTypes.required;
  return SETTINGS.label.errorsTypes.unknown;
}

export function handleApiError(error: unknown): never {
  const error_ = error as CTApiError;
  const statusCode = error_?.body?.statusCode ?? 500;
  const fallbackMessage =
    error_?.body?.message ?? SETTINGS.label.errorsTypes.unknown;
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
