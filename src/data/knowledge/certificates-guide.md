# Zalvy Certificate Verification & Cryptographic Ledger

Every credential issued by Zalvy is cryptographically signed and publicly verifiable to eliminate credential fraud and resume inflation.

## Verification Features

- **SHA-256 Digest**: Each certificate carries a unique 64-character hex hash computed over the student's name, track, score, and issue timestamp.
- **Public Verification Endpoint**: Visit `/verify` and input any certificate hash or scan the credential QR code.
- **Verifiable Data Attributes**:
  - Certificate ID & SHA-256 Hash
  - Student Full Name
  - Program / Specialization Title
  - Issue Date & Expiration Status
  - Issuer Digital Signature
  - Verified Skills Checklist

## For Employers

Employers can verify credentials programmatically using our API endpoint `POST /api/v1/ai/verify` or via the web verification page.
