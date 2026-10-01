# API PLATFORM ARCHITECTURE
Date: 2026-09-15

## Existing API Inventory
/v1/agents GET/POST
/v1/leads GET/POST
/v1/ai/* routes: verify, resume, recommend, knowledge, interview, chat, assess
/api/vitals
/api/health
/api/csp-report
/api/admin/*

## Authentication
Session-based, API key not detected
withApiHandler middleware used

## Versioning
/v1 prefix present

## Rate Limiting
Implemented per endpoint via withApiHandler

## Tenant Isolation
User/Company model present
Server-side authorization required

## Public API Status
NOT FULLY EXPOSED
Internal APIs exist, developer platform not formalized

Recommendations:
- Formal API inventory
- OpenAPI spec
- Developer portal
- API key management
