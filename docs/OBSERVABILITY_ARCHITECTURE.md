# OBSERVABILITY ARCHITECTURE
Date: 2026-09-15

## Current State
- No third-party analytics provider configured
- web-vitals available for Core Web Vitals
- No Sentry / OpenTelemetry detected
- Error handling via Next.js defaults

## Proposed Architecture

### Analytics
Provider: NOT CONFIGURED
Option: Add lightweight privacy-first provider e.g. Plausible/Umami, or Vercel Analytics
Implementation: client-side async, server-side events minimal

### Error Observability
Desired: Sentry or similar for error collection
Current: NOT CONFIGURED
Plan: Document setup requirement, do not auto-create account

### Performance
Core Web Vitals via web-vitals
Real user metrics optional
3D telemetry: 3d_enabled, 3d_fallback, quality_tier only

### Request IDs
Implement lightweight request-id for API routes
Pass through server to external calls

### AI Observability
Track request count, success/failure, latency, model/provider
Do NOT log raw prompts/outputs

## Privacy & Security
- No PII in logs
- Consent respected
- CSP maintained
- No secrets in analytics payloads

## Failure Behavior
Analytics failure must not break UX
