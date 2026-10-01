# COLLABORATION SECURITY MODEL
Date: 2026-09-15

## Tenant Isolation
User resources isolated by userId
Company resources isolated by companyId
Server-side authorization required

## IDOR Prevention
All API routes must validate ownership
Never trust client-supplied IDs

## AI Isolation
No AI agents/automations detected in schema
No cross-tenant AI context risk currently

## Invitations
CompanyMember provides membership
No generic invitation system for workspaces

## Audit
AuditLog exists for actor/action/entity tracking

Status: SECURITY MODEL DOCUMENTED
