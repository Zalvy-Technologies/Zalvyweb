# WEBHOOK ARCHITECTURE
Date: 2026-09-15

## Current State
No webhooks detected

## Proposed Design
Event-driven architecture with signing, retries, idempotency

Events: agent.run.completed, automation.completed, resource.created

Requirements:
- Cryptographic signatures
- Retry with backoff
- Delivery tracking
- Idempotency

Status: NOT IMPLEMENTED
