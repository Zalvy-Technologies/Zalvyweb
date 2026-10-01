/**
 * ZALVY — Input Validation Module.
 *
 * Strict, type-safe validation schema primitives for user input, payloads,
 * form data, and API parameters.
 *
 * @module lib/security/validation
 */

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * RFC 5322 compliant email regex pattern.
 */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validates an email address string.
 */
export function validateEmail(email: unknown): ValidationResult<string> {
  if (typeof email !== "string") {
    return { success: false, error: "Email must be a string." };
  }

  const trimmed = email.trim();
  if (trimmed.length === 0) {
    return { success: false, error: "Email address is required." };
  }

  if (trimmed.length > 320) {
    return { success: false, error: "Email address exceeds maximum length of 320 characters." };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  return { success: true, data: trimmed.toLowerCase() };
}

/**
 * Validates a person or organization name.
 */
export function validateName(name: unknown, minLen = 2, maxLen = 200): ValidationResult<string> {
  if (typeof name !== "string") {
    return { success: false, error: "Name must be a string." };
  }

  const trimmed = name.trim();
  if (trimmed.length < minLen) {
    return { success: false, error: `Name must be at least ${String(minLen)} characters long.` };
  }

  if (trimmed.length > maxLen) {
    return { success: false, error: `Name cannot exceed ${String(maxLen)} characters.` };
  }

  return { success: true, data: trimmed };
}

/**
 * Validates free-form message content.
 */
export function validateMessage(
  message: unknown,
  minLen = 10,
  maxLen = 8000,
): ValidationResult<string> {
  if (typeof message !== "string") {
    return { success: false, error: "Message must be a string." };
  }

  const trimmed = message.trim();
  if (trimmed.length < minLen) {
    return { success: false, error: `Message must be at least ${String(minLen)} characters long.` };
  }

  if (trimmed.length > maxLen) {
    return { success: false, error: `Message cannot exceed ${String(maxLen)} characters.` };
  }

  return { success: true, data: trimmed };
}

/**
 * Validates an allowed enumeration value against a set of permitted options.
 */
export function validateEnum<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
  fieldName = "Field",
): ValidationResult<T> {
  if (typeof value !== "string" || !allowedValues.includes(value as T)) {
    return {
      success: false,
      error: `Invalid ${fieldName}. Allowed values: ${allowedValues.join(", ")}.`,
    };
  }

  return { success: true, data: value as T };
}

/**
 * UUID v4 validation pattern.
 */
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validates a UUID v4 string.
 */
export function validateUuid(id: unknown): ValidationResult<string> {
  if (typeof id !== "string" || !UUID_V4_REGEX.test(id)) {
    return { success: false, error: "Invalid unique identifier format." };
  }

  return { success: true, data: id.toLowerCase() };
}
