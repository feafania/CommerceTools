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

  if (message.includes("Required")) return SETTINGS.label.errorsTypes.required;

  if (
    message.includes("postal code") ||
    message.includes("ZIP Code") ||
    message.includes("postcode")
  )
    return SETTINGS.label.errorsTypes.invalidPostalCode;

  if (message.includes("email address"))
    return SETTINGS.label.errorsTypes.invalidEmail;

  if (message.includes("phone number"))
    return SETTINGS.label.errorsTypes.invalidPhoneNumber;

  if (message.includes("Invalid")) return SETTINGS.label.errorsTypes.invalid;

  return message; // or SETTINGS.label.errorsTypes.unknown, калі хочаш
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

  const fields: string[] = [];

  const detailedMessages = errors.map((error__) => {
    const baseMessage = error__.detailedErrorMessage || error__.message;

    let field = error__.field;
    if (!field && error__.detailedErrorMessage?.includes(":")) {
      field = error__.detailedErrorMessage.split(":")[0].trim();
    }

    const localized = localizeMessage(baseMessage);

    if (field) {
      fields.push(field);
      return `• ${field}: ${localized}`;
    }

    return `• ${localized}`;
  });

  const modalMessage =
    detailedMessages.length > 0 ? detailedMessages.join("\n") : fallbackMessage;

  throw new ApiError(statusCode, modalMessage, fields);
}
