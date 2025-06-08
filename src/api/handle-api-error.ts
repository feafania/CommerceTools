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

  let statusCode = error_?.statusCode ?? error_?.body?.statusCode ?? 500;

  let rawMessage =
    error_?.message ||
    error_?.body?.message ||
    error_?.error?.message ||
    "Unknown error";

  if (typeof rawMessage === "string" && rawMessage.includes("{")) {
    try {
      const jsonStart = rawMessage.indexOf("{");
      const jsonPart = rawMessage.slice(jsonStart);
      const parsed = JSON.parse(jsonPart);
      rawMessage = parsed.message || parsed.error?.message || rawMessage;
      statusCode = parsed.statusCode || statusCode;
    } catch {}
  }

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

export async function handleFailedResponse(
  response: Response,
  context: string,
): Promise<void> {
  let errorData: unknown;

  try {
    errorData = await response.json();
  } catch {
    try {
      errorData = await response.text();
    } catch (error) {
      errorData = `Failed to parse error response: ${String(error)}`;
    }
  }

  // console.error(`${context} failed:`, errorData);

  if (isCTApiError(errorData)) {
    const statusCode =
      errorData.statusCode || errorData.body?.statusCode || response.status;

    const message =
      errorData.message ||
      errorData.error?.message ||
      errorData.body?.message ||
      errorData.body?.errors?.[0]?.message ||
      errorData.error?.errors?.[0]?.message ||
      `${context} failed with status ${response.status}`;

    const errors: CTErrorObject[] | undefined =
      errorData.body?.errors || errorData.error?.errors;

    handleApiError({ statusCode, message, errors });
  } else {
    const message =
      typeof errorData === "string"
        ? errorData
        : `${context} failed with status ${response.status}`;

    handleApiError({ statusCode: response.status, message });
  }
}

function isCTApiError(error: unknown): error is CTApiError {
  if (typeof error !== "object" || error === null) return false;

  const error_ = error as Partial<CTApiError>;

  const hasKnownProperties =
    typeof error_.message === "string" ||
    typeof error_.statusCode === "number" ||
    typeof error_.body?.message === "string" ||
    typeof error_.body?.statusCode === "number" ||
    Array.isArray(error_.body?.errors) ||
    typeof error_.error?.message === "string" ||
    Array.isArray(error_.error?.errors);

  return hasKnownProperties;
}
