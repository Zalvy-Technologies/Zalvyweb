import { NextResponse, type NextRequest } from "next/server";
import { CSRF_COOKIE_NAME, generateCsrfToken, verifyCsrfToken } from "@/lib/security/csrf";
import { checkRateLimitSync } from "@/lib/security/rate-limit";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const RATE_LIMITED_PATHS = new Set([
  "/api/",
  "/api/v1/",
]);

/**
 * Generates a cryptographically secure CSP nonce for the current request.
 */
function generateCspNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString("base64");
}

/**
 * Checks if the request path should be rate limited.
 */
function shouldRateLimit(pathname: string): boolean {
  return Array.from(RATE_LIMITED_PATHS).some((prefix) => pathname.startsWith(prefix));
}

/**
 * Builds the CSP header with the given nonce.
 */
function buildCspHeader(nonce: string): string {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    // Webpack's development runtime uses eval for source maps and Fast Refresh.
    // Keep production strict while allowing the local development server to work.
    `script-src 'self' 'nonce-${nonce}'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
    "connect-src 'self' https:",
    "manifest-src 'self'",
  ].join("; ");
}

export function proxy(request: NextRequest) {
  const cspNonce = generateCspNonce();
  const csp = buildCspHeader(cspNonce);
  const cspReportOnly = `${csp}; report-uri /api/csp-report`;

  // Forward the CSP as a REQUEST header. The App Router renderer extracts the
  // nonce from the incoming request's Content-Security-Policy header and
  // applies it to its inline scripts (RSC payload, bootstrap). Without this,
  // the middleware's response-header-only CSP leaves those scripts nonce-less,
  // so CSP blocks every inline script and hydration never starts.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("content-security-policy", csp);
  requestHeaders.set("content-security-policy-report-only", cspReportOnly);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Store nonce in response headers for CSP injection
  response.headers.set("x-csp-nonce", cspNonce);
  // Also store in cookie for client-side access
  response.cookies.set("csp-nonce", cspNonce, {
    path: "/",
    sameSite: "strict",
    httpOnly: false, // Allow JavaScript access
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 5, // 5 minutes
  });

  // Set CSP header with nonce
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("Content-Security-Policy-Report-Only", cspReportOnly);

  // Defense-in-depth HTTP Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }

  // Rate Limiting for API routes (sync version for middleware)
  if (shouldRateLimit(request.nextUrl.pathname)) {
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
    try {
      const rateLimit = checkRateLimitSync(`api:${clientIp}`, {
        windowMs: 60 * 1000,
        maxRequests: 100,
      });
      if (rateLimit.limited) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429, headers: rateLimit.headers },
        );
      }
      // Add rate limit headers to response
      Object.entries(rateLimit.headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    } catch {
      // Skip rate limiting if Redis backend is active (async only)
    }
  }

  // CSRF Protection: Double-submit cookie pattern
  const method = request.method.toUpperCase();

  if (MUTATING_METHODS.has(method)) {
    // Validate CSRF token on mutating requests
    const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
    const headerToken = request.headers.get("x-csrf-token") ?? request.headers.get("x-xsrf-token");

    if (!cookieToken || !headerToken || !verifyCsrfToken(cookieToken, headerToken)) {
      return NextResponse.json(
        { error: "Invalid CSRF token. Please refresh the page and try again." },
        { status: 403, headers: { "x-csrf-error": "invalid_token" } },
      );
    }
  } else if (method === "GET" || method === "HEAD") {
    // Issue CSRF cookie for safe methods (if not present)
    const existingCsrf = request.cookies.get(CSRF_COOKIE_NAME)?.value;
    if (!existingCsrf) {
      const newToken = generateCsrfToken();
      response.cookies.set(CSRF_COOKIE_NAME, newToken, {
        path: "/",
        sameSite: "strict",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets & icons.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
