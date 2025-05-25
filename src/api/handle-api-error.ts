import { FieldErrorType } from "@/types/types";
import { SETTINGS } from "@/config/settings";
import localizeMessage from "@/api/api-error-localization";
import { CTApiError, CTErrorObject } from "@/types/interfaces";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public errorMessage: string,
    public invalidFields?: FieldErrorType[],
  ) {
    super(errorMessage);
    this.name = "ApiError";
  }
}

export function handleApiError(error: unknown): never {
  // console.error("handleApiError got:", error);
  const error_ = error as CTApiError;

  const statusCode = error_?.statusCode ?? error_?.body?.statusCode ?? 500;

  const rawMessage =
    error_?.message ||
    error_?.body?.message ||
    error_?.error?.message ||
    "Unknown error";

  const fallbackMessage =
    typeof rawMessage === "string"
      ? localizeMessage(rawMessage)
      : SETTINGS.label.errorsTypes.unknown;

  const errors: CTErrorObject[] =
    error_?.body?.errors ?? error_?.error?.errors ?? [];

  const fields: FieldErrorType[] = [];

  const detailedMessages = errors.map((error__) => {
    const baseMessage = error__.detailedErrorMessage || error__.message;
    const errorCode = error__.code || "";

    let field = error__.field;
    if (!field && error__.detailedErrorMessage?.includes(":")) {
      field = error__.detailedErrorMessage.split(":")[0].trim();
    }

    const localized = localizeMessage(baseMessage, errorCode);

    if (field) {
      fields.push({ field, message: localized });
      return `• ${field}: ${localized}`;
    }

    return `• ${localized}`;
  });

  const modalMessage =
    detailedMessages.length > 0 ? detailedMessages.join("\n") : fallbackMessage;

  throw new ApiError(statusCode, modalMessage, fields);
}
