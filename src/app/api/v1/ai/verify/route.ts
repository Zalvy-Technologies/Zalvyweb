import { type NextRequest, NextResponse } from "next/server";
import { withApiHandler } from "@/server/middleware/api-handler";
import type { CertificateVerificationAnalysis } from "@/types/ai";
import { verifyRequestSchema } from "@/server/schemas/ai.schema";

export const runtime = "nodejs";

async function handlePostVerify(request: NextRequest): Promise<NextResponse> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body payload." }, { status: 400 });
  }

  const parsedRequest = verifyRequestSchema.safeParse(body);
  if (!parsedRequest.success) return NextResponse.json({ error: "Field 'certificateHash' must be a SHA-256 hash." }, { status: 400 });
  const certificateHash = parsedRequest.data.certificateHash;
  const result: CertificateVerificationAnalysis = {
    // A cryptographically well-formed hash is not proof of issuance. Until a
    // ledger-backed record is found, fail closed rather than inventing data.
    isValid: false,
    certificateHash,
    issuer: "Zalvy Credential Integrity Authority",
    explanation:
      "No matching certificate record was found in the configured verification ledger. The certificate is not verified.",
    securityChecks: [
      {
        checkName: "SHA-256 Digest Matching",
        passed: false,
        detail: "No matching digest was found in the verification ledger.",
      },
      {
        checkName: "Issuer Cryptographic Seal",
        passed: false,
        detail: "No issuer signature is available without a ledger record.",
      },
      {
        checkName: "Expiration & Revocation Status",
        passed: false,
        detail: "No revocation status is available without a ledger record.",
      },
    ],
  };

  return NextResponse.json({ ok: true, verification: result }, { status: 200 });
}

export const POST = withApiHandler(handlePostVerify, {
  actionName: "v1_ai_verify",
  rateLimitConfig: { windowMs: 60 * 1000, maxRequests: 20 },
});
