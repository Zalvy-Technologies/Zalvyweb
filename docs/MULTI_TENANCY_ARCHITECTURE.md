# MULTI_TENANCY ARCHITECTURE
Date: 2026-09-15

## Current Model
Single-user ownership with Company membership.

Entities:
User -> CompanyMember -> Company
User -> Project
User -> Applications

No Workspace entity detected.

## Tenancy Model
Model A/B hybrid:
- User-owned resources: Project
- Company-owned resources: Internship, Certificate, CompanyMember

## Ownership Boundaries
- Users isolated by userId
- Company members linked via CompanyMember
- Admin separate

## Isolation Strategy
Server-side authorization required on all API routes
Never trust client userId

## Future Extensibility
Workspace model could be added but not currently present.

Status: DOCUMENTED
