# Contributing to ZALVY

## Prerequisites
Node >=20.11.0, npm 11.x

## Install
npm ci

## Develop
npm run dev

## Test
npm run lint
npm run typecheck
npm run test
npm run test:e2e

## Build
npm run build

## Architecture Rules
- Server Components by default
- Client Components only for interactivity/3D
- Use design tokens
- No hardcoded values
- Accessibility first
- Performance budget enforced

## PR Process
- Run lint/typecheck/tests
- Update docs if needed
- No secrets
- No breaking changes without review
