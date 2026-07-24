# Swift Courier

A pnpm workspace containing the Swift Courier React/Vite web app and its Express 5 API. The API uses PostgreSQL and Drizzle ORM for shipment, tracking, and authentication data.

## Run & Operate

- `pnpm install --frozen-lockfile` — install the imported workspace dependencies
- `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/web run dev` — run the web app locally
- `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/web run build` — build the web app locally
- `pnpm --filter @workspace/api-server run dev` — run the API server locally
- `pnpm run typecheck` — typecheck all packages (currently reports pre-existing web type errors; see Gotchas)
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (injected automatically by Replit; no manual setup needed)
- Required secret: `SESSION_SECRET` — used for browser session signing
- Workflows: **Web** serves the frontend on port 5173; **API Server** serves the API on port 8080
- Verify the API at `GET /api/healthz` → `{"status":"ok"}`

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- Frontend: React 19 + Vite 7 + Tailwind CSS
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: Vite for the web app and esbuild for the API bundle

## Where things live

- `artifacts/web` — React/Vite courier dashboard, shipment management, login, and public tracking pages
- `artifacts/api-server` — Express routes and API entry point
- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/api-client-react` and `lib/api-zod` — generated API clients and schemas
- `lib/db/src/schema` — Drizzle database schema

## Architecture decisions

- The existing pnpm workspace and generated API packages are retained; setup does not migrate the project to another stack.
- The frontend and API run as separate Replit workflows so the web preview remains the primary user-facing process.

## Product

Authenticated staff can view courier dashboard metrics, create and manage shipments, update shipment status, and add tracking events. The public tracking page lets recipients look up a shipment without signing in.

## User preferences

No additional preferences recorded.

## Gotchas

- The web Vite config requires both `PORT` and `BASE_PATH`; the Replit Web workflow supplies `PORT=5173 BASE_PATH=/`.
- The imported web pages currently have TypeScript errors around generated API-client imports and hook option types. The Vite dev server and production web build still start successfully, but `pnpm run typecheck` is not clean until those application-level mismatches are fixed.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
