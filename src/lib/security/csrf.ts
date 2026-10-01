/**
 * ZALVY — CSRF Protection Utility.
 *
 * Implements Double-Submit Cookie CSRF mitigation for state-mutating requests (POST, PUT, DELETE, PATCH).
 *
 * How it works:
 *  1. Server sets a cryptographically random token in an HttpOnly / SameSite=Strict cookie (`zalvy-csrf-token`).
 *  2. Safe requests (GET/HEAD/OPTIONS) pass through and ensure the cookie is present.
 *  3. Form submissions and API requests include the matching token in header `x-csrf-token` or payload `_csrf`.
 *  4. Middleware / API routes compare the cookie token against the request token.
 *
 * @module lib/security/csrf
 */

export const CSRF_COOKIE_NAME = "zalvy-csrf-token";
export const CSRF_HEADER_NAME = "x-csrf-token";

/**
 * Generates a pseudo-random CSRF token suitable for double-submit cookie validation.
 */
export function generateCsrfToken(): string {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const buffer = new Uint8Array(24);
    crypto.getRandomValues(buffer);
    return Array.from(buffer, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  // Fallback for Node environments without global crypto
  return `${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
}

/**
 * Verifies that a CSRF token matches the token stored in the cookie.
 */
export function verifyCsrfToken(
  cookieToken: string | null | undefined,
  requestToken: string | null | undefined,
): boolean {
  if (!cookieToken || !requestToken) {
    return false;
  }

  const cleanCookie = cookieToken.trim();
  const cleanRequest = requestToken.trim();

  if (cleanCookie.length < 16 || cleanRequest.length < 16) {
    return false;
  }

  // Constant-time comparison to protect against timing attacks
  if (cleanCookie.length !== cleanRequest.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < cleanCookie.length; i++) {
    result |= cleanCookie.charCodeAt(i) ^ cleanRequest.charCodeAt(i);
  }

  return result === 0;
}
