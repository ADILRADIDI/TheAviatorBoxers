const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>{}, update:async()=>{}, delete:async()=>{} }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

# AGENTS.md

## Project Context

This is a Base44 app repository. Treat it as user-owned application code, keep changes focused on the user's request, and preserve existing project conventions.

Start with `README.md` for local setup, environment variables, and publish workflow.

## Base44 References

- CLI overview: https://docs.db.com/developers/references/cli/get-started/overview.md
- Agent skills: https://docs.db.com/developers/references/cli/overview/skills.md

If your agent supports Agent Skills, install or update Base44 skills before Base44-specific work:

```bash
npx skills add base44/skills
```

## Key Files

- `src/`: frontend application source.
- `src/api/base44Client.js`: frontend Base44 SDK client (stub — returns empty data).
- `vite.config.js`: Vite config and Base44 Vite plugin setup.
- `.env.local`: local-only environment values; never commit secrets.
- `apps/api/`: NestJS + Fastify API (TypeScript, pnpm workspace `@aviator/api`).
- `apps/worker/`: BullMQ worker (TypeScript, pnpm workspace `@aviator/worker`).
- `packages/db/`: Drizzle ORM package (`@aviator/db`) — schema, migrations, seed.

## Working Notes

- Use `base44 dev` as the default local development command when you need the local Base44 backend. It can run the backend and frontend together.
- When docs or code mention the frontend being started automatically, that usually means the Base44 project config includes `site.serveCommand`, for example `"serveCommand": "npm run dev"` in `base44/config.jsonc`.
- Use `npm run dev` only for frontend-only work against the hosted Base44 backend.
- Prefer the existing Base44 CLI workflow over adding new npm scripts for Base44-specific work.
- Reuse the existing SDK client and Vite plugin patterns before adding new Base44 integration paths.
- Run the relevant checks from `package.json` before finishing code changes.

## Base44 Docker Compose Setup

The app runs via `docker-compose.base44.yml` (not the repo's own `docker-compose.yml`, which builds production images).

### Services
- **frontend**: Vite dev server (node:22-alpine), port 3000 → 5173. Bind-mounted source with live reload.
- **api**: NestJS + Fastify dev server (tsx watch), port 3001. Depends on postgres + setup.
- **postgres**: PostgreSQL 16 with migrations + seed data.
- **redis**: Redis 7 (for the worker, not started by default in the Base44 compose).
- **setup**: One-shot — installs pnpm deps and builds `@aviator/db` (needed before API can start).
- **migrate**: One-shot — runs Drizzle migrations + seed.

### Architecture
- Frontend calls the API via `VITE_API_URL` (set to the public API URL `https://3001-<suffix>`).
- API has CORS enabled (`origin: true`) so the frontend (different origin) can call it.
- The `@aviator/db` package must be built (`pnpm --filter @aviator/db build`) before the API starts — it resolves via `exports` to `./dist/index.js`.
- `src/api/base44Client.js` is a stub; the real data comes from the NestJS API at `VITE_API_URL`.
- `VITE_BASE44_APP_ID` is not set — the AuthContext skips Base44 auth and renders the storefront directly.

### Local credentials (set in compose `environment:`)
- `POSTGRES_PASSWORD`: `aviator_dev_password_2024` (local infra, not a user secret)
- `ADMIN_PASSWORD`: `dev_admin_pass_123` (used by seed for admin account)
- `ADMIN_SECRET`: `dev_admin_secret_very_long_random_value` (HMAC signing for admin tokens)

### Known fix applied
- `apps/api/src/main.ts`: Changed `response.header()` to `response.setHeader()` — the Express-style `.header()` method doesn't exist on Fastify's middleware response object, causing a crash on every request.

### Verify the app works
```bash
docker compose -f docker-compose.base44.yml up -d
# Wait for setup + migrate to complete, then:
curl -s http://localhost:3001/api/products  # should return JSON array
curl -s http://localhost:3000/              # should return Vite HTML
```
