# ZALVY API Versioning Strategy

## Overview

This document defines the versioning strategy for the ZALVY Platform API to ensure backward compatibility, clear deprecation communication, and smooth client migrations.

## Versioning Scheme

### URL-Based Versioning (Primary)

All API endpoints are versioned in the URL path:

```
/api/v1/leads
/api/v1/ai/chat
/api/v1/agents
```

**Format**: `/api/v{major}/{resource}`

- **Major versions only** (v1, v2, v3...)
- **No minor/patch in URL** - breaking changes = new major version
- **Non-versioned `/api/` routes** = legacy/deprecated (will be removed)

### Version Header (Secondary)

Clients MAY also specify version via header:

```
Accept-Version: v1
X-API-Version: v1
```

If both URL and header present, **URL takes precedence**.

---

## Release Lifecycle

### 1. Active Support (Current Version)
- Full feature development
- Bug fixes and security patches
- Performance improvements
- New non-breaking features added

### 2. Maintenance Mode (Previous Version)
- Security patches only
- Critical bug fixes
- No new features
- Duration: **12 months** after new major release

### 3. Deprecated (Sunset)
- No changes except emergency security fixes
- `Sunset` header indicates removal date
- Duration: **6 months** after entering maintenance

### 4. Removed
- Endpoints return `410 Gone`
- Documentation updated with migration guide

---

## Deprecation Communication

### HTTP Headers

All deprecated endpoints include:

```http
Sunset: Sat, 01 Jan 2026 00:00:00 GMT
Deprecation: true
Link: <https://api.zalvy.com/docs/migration-v1-v2>; rel="deprecation"
```

### Response Body

```json
{
  "error": "This endpoint is deprecated",
  "message": "Use /api/v2/leads instead. See migration guide.",
  "deprecated": true,
  "sunsetDate": "2026-01-01T00:00:00Z",
  "migrationGuide": "https://docs.zalvy.com/api/migration/v1-to-v2"
}
```

---

## Breaking Change Definition

The following constitute **breaking changes** requiring major version bump:

| Change | Breaking? |
|--------|-----------|
| Remove/rename endpoint | ✅ Yes |
| Remove/rename request/response field | ✅ Yes |
| Change field type (string → number) | ✅ Yes |
| Make required field optional | ✅ Yes |
| Change validation rules (stricter) | ✅ Yes |
| Change HTTP status codes | ✅ Yes |
| Change auth requirements | ✅ Yes |
| Remove enum value | ✅ Yes |

### Non-Breaking (Minor/Patch - Same Major Version)

| Change | Breaking? |
|--------|-----------|
| Add new endpoint | ❌ No |
| Add optional request field | ❌ No |
| Add response field | ❌ No |
| Relax validation (looser) | ❌ No |
| Add new enum value | ❌ No |
| Improve performance | ❌ No |
| Fix bug (correct behavior) | ❌ No |

---

## Current Versions

| Version | Status | Release Date | Sunset Date | Docs |
|---------|--------|--------------|-------------|------|
| v1 | Active | 2025-07-01 | TBD | [v1 Docs](/api/v1/docs) |
| v0 (legacy) | Deprecated | 2024-01-01 | 2025-12-31 | [Migration](/api/v1/docs) |

---

## Client Integration Guidelines

### Recommended: Pin Major Version in Base URL

```typescript
const API_BASE = "https://api.zalvy.com/api/v1";
```

### Handle Deprecation Headers

```typescript
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, options);
  
  if (response.headers.get("Deprecation") === "true") {
    const sunset = response.headers.get("Sunset");
    const link = response.headers.get("Link");
    console.warn(`[API Deprecation] ${endpoint} - Sunset: ${sunset}, Migration: ${link}`);
    
    // Optionally: send to monitoring/alerting
  }
  
  return response;
}
```

### Graceful Migration Pattern

```typescript
// Support both versions during transition
async function submitLead(data: LeadInput) {
  try {
    return await apiCall("/v2/leads", { method: "POST", body: JSON.stringify(data) });
  } catch (err) {
    if (err.status === 404 || err.status === 410) {
      // Fallback to v1 with warning
      console.warn("Falling back to v1 API");
      return await apiCall("/v1/leads", { method: "POST", body: JSON.stringify(data) });
    }
    throw err;
  }
}
```

---

## Version Negotiation (Future)

When multiple versions coexist, we may support content negotiation:

```
GET /api/leads
Accept: application/json; version=1
Accept: application/json; version=2
```

Response:
```
Content-Type: application/json; version=2
Vary: Accept
```

---

## Documentation

Each version has dedicated documentation:

- **v1**: `/api/v1/docs` (OpenAPI 3.1 + Redoc)
- **v2**: `/api/v2/docs` (when released)

Documentation includes:
- Complete endpoint reference
- Request/response schemas
- Authentication requirements
- Rate limits
- Code samples (TypeScript, Python, cURL)
- Migration guides between versions

---

## Support Commitment

| Tier | SLA | Versions Covered |
|------|-----|------------------|
| Enterprise | 99.9% uptime, 1hr response | Current + 1 previous |
| Professional | 99.5% uptime, 4hr response | Current |
| Community | Best effort | Current |

---

## Changelog

All versions maintain a public changelog at `/changelog` with:

- Version number
- Release date
- Breaking changes (marked 💥)
- New features
- Bug fixes
- Deprecations
- Security fixes

---

## Contact

For versioning questions or migration assistance:
- **Email**: api-support@zalvy.com
- **Slack**: #zalvy-api (Enterprise customers)
- **Docs**: https://docs.zalvy.com/api