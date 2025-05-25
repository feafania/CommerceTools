import { SETTINGS } from "@/config/settings";

export default function localizeMessage(
  message: string,
  code: string = "",
): string {
  if (
    message.includes(
      "There is already an existing customer with the provided email",
    )
  )
    return SETTINGS.label.errorsTypes.emailExist;

  if (code) {
    const result = localizeByCode(code);
    if (result) return result;
  }

  if (message.includes("credentials"))
    return SETTINGS.label.errorsTypes.credentials;

  if (message.includes("Duplicate") || message.includes("duplicate"))
    return SETTINGS.label.errorsTypes.duplicate;

  if (message.includes("Required")) return SETTINGS.label.errorsTypes.required;

  if (message.includes("Internal Server Error"))
    return SETTINGS.label.errorsTypes.serverError;

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

  return message; // or SETTINGS.label.errorsTypes.unknown
}

function localizeByCode(code: string): string | undefined {
  if (code.includes("InvalidJsonInput"))
    return SETTINGS.label.errorsTypes.invalidJson;

  if (code.includes("InvalidQueryParam"))
    return SETTINGS.label.errorsTypes.invalidQueryParam;

  if (code.includes("InvalidPathParam"))
    return SETTINGS.label.errorsTypes.invalidPathParam;

  if (code.includes("DuplicateField"))
    return SETTINGS.label.errorsTypes.duplicate;

  if (code.includes("FieldValueNotFound"))
    return SETTINGS.label.errorsTypes.fieldValueNotFound;

  if (code.includes("GitRepositoryNotReachable"))
    return SETTINGS.label.errorsTypes.gitError;

  if (code.includes("AuthenticationError"))
    return SETTINGS.label.errorsTypes.credentials;

  if (code.includes("AuthorizationError"))
    return SETTINGS.label.errorsTypes.authzError;

  if (code.includes("ResourceNotFound"))
    return SETTINGS.label.errorsTypes.resourceNotFound;

  if (code.includes("ConcurrentModification"))
    return SETTINGS.label.errorsTypes.concurrent;

  if (code.includes("BadGateway")) return SETTINGS.label.errorsTypes.badGateway;

  if (code.includes("General")) return SETTINGS.label.errorsTypes.general;

  if (code.includes("ConnectorAlreadyCertified"))
    return SETTINGS.label.errorsTypes.connectorCertified;

  if (code.includes("ConnectorReferenceNotFound"))
    return SETTINGS.label.errorsTypes.connectorNotFound;

  if (code.includes("ConnectorSpecificationFileNotFound"))
    return SETTINGS.label.errorsTypes.connectorFileNotFound;

  if (code.includes("ConnectorSpecificationFileNotValid"))
    return SETTINGS.label.errorsTypes.connectorFileNotValid;

  if (code.includes("ConnectorStagedInCertification"))
    return SETTINGS.label.errorsTypes.connectorInCertification;
}
