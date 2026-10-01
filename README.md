# Zalvy Platform

Zalvy is a Next.js 16 application for enterprise lead intake and AI-assisted career workflows. It exposes versioned REST endpoints, streams AI chat over Server-Sent Events (SSE), and supports either local Ollama or Gemini.

## Run locally

Prerequisites: Node.js 20.11+ and npm 11+.

```bash
cp .env.example .env
npm ci
npm run dev
```

Open `http://localhost:3000`. The API specification is available at `GET /api/v1/docs`.

## Run with Docker

Set a strong `SESSION_SECRET` in `.env`, then start the stack:

```bash
docker compose up --build
docker compose exec ollama ollama pull llama3.2:3b
```

The Compose stack includes the application, PostgreSQL 16, and Ollama. Database bootstrap SQL in `db/migrations` is mounted read-only and runs only when the Postgres volume is first created. To use Gemini instead, set `AI_DEFAULT_PROVIDER=gemini` and `GOOGLE_GENAI_API_KEY`.

## Quality checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

## API contract

All public endpoints return JSON except `POST /api/v1/ai/chat`, which returns `text/event-stream` with JSON `data:` frames followed by `data: [DONE]`.

| Endpoint | Request | Successful response |
| --- | --- | --- |
| `POST /api/v1/ai/chat` | 1–30 `user`/`assistant` messages (max 12,000 chars each), optional allowlisted agent/provider | SSE stream |
| `POST /api/v1/ai/resume` | `resumeText` 50–50,000 chars, optional provider | `{ ok, analysis }` |
| `POST /api/v1/ai/interview` | role, `beginner\|intermediate\|advanced`, optional provider | `{ ok, questions }` |
| `POST /api/v1/ai/recommend` | 1–20 skills, level, optional provider | `{ ok, recommendations }` |
| `POST /api/v1/ai/assess` | skill, optional provider | `{ ok, assessment }` |
| `POST /api/v1/ai/knowledge` | query (2–500 chars), topK (1–10) | `{ ok, query, count, results }` |
| `POST /api/v1/ai/verify` | 64-character SHA-256 `certificateHash` | `{ ok, verification }` |

Invalid payloads return `400`; rate limiting returns `429` with standard rate-limit headers; unexpected internal failures return `500` without exposing secrets. The full machine-readable OpenAPI 3.0.3 document is served from `/api/v1/docs`.

## Security and operations

- Runtime request schemas are strict and size-bounded; provider and agent values are allowlisted.
- API middleware assigns correlation IDs, returns timing/security headers, rate-limits callers, and emits redacted structured audit logs.
- Browser routes use CSP, clickjacking protection, secure cookies in production, and CSRF checks for state-changing browser requests.
- AI provider credentials remain server-only. Never send an API key or provider base URL from the browser.
- Liveness: `GET /api/health`; dependency readiness: `GET /api/health?check=readiness`.

## Architecture

`app/api` route handlers are intentionally thin. Shared request contracts live in `src/server/schemas`; AI transport and adapters live in `src/lib/ai`; domain DTOs, services, repositories, caching, middleware, and OpenAPI generation live under `src/server`. The Zustand store owns only client chat UI state; authoritative data is kept server-side.
