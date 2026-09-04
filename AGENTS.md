# AGENTS.md — Tambo360 Frontend

## Stack
- Next.js 16.2 (App Router) + React 19.2 + TypeScript 5, Tailwind CSS 4 (`@tailwindcss/postcss`), shadcn `radix-vega`.
- Package manager: **pnpm** (`pnpm-lock.yaml`). Path alias `@/*` → `./*` (`tsconfig.json:21`).
- PWA via `@ducanh2912/next-pwa` — disabled in `development`, `dest: public` (`next.config.ts:1`).

## Commands
```bash
pnpm dev          # next dev --webpack (NOT --turbo)
pnpm build        # next build --webpack
pnpm lint         # eslint (eslint.config.mjs)
pnpm format       # prettier --write "app/**/*.{ts,tsx}" — only app, not repo-wide
npx tsc --noEmit  # no script alias — run directly for typecheck
```

## Lint / Format / Commits
- ESLint: `eslint-config-next/core-web-vitals` + `typescript`, `eslint-plugin-unused-imports` as `warn` only, `no-unused-vars`/`no-explicit-any` off, `no-img-element` off, `eslint-config-prettier` last. Ignores `.next/**, out/**, build/**, next-env.d.ts`.
- Prettier: `singleQuote: true, semi: false, trailingComma: es5, tabWidth: 2, printWidth: 80` (`.prettierrc`). `lint-staged` runs `prettier --write` on `*.{ts,tsx,js,jsx}`.
- Husky: `pre-commit` → `lint-staged`; `commit-msg` → `commitlint --edit` with `@commitlint/config-conventional`. Commits must be conventional (e.g. `feat(scope): ...`).
- VS Code: `formatOnSave` + `source.fixAll.eslint` enabled.

## Architecture
- **Routes:** `app/` with groups `(landing)`, `(auth)`, `(onboard)`; deep nested `app/(onboard)/organizaciones/[orgId]/[id]/(dashboard)/...` — dashboard is a parallel group, not a URL segment.
- **Providers** order matters (`utils/Providers.tsx:8`): `QueryProvider > SidebarProvider > AuthProvider > TooltipProvider` + `Toaster` (sonner). Wrap new global providers there.
- **Auth:** `context/AuthContext.tsx` calls `GET /auth/me` on mount; 401 interceptor in `services/api.ts:14` redirects to `/iniciar-sesion` except for `/auth/me` and `/auth/logout`. Landing routes (`/`, `/contacto`, `/precios`, etc.) skip loading gate.
- **API:** Single axios instance `services/api.ts` with `baseURL: NEXT_PUBLIC_API_URL`, `withCredentials: true`. Env vars are `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_GTM_ID` (`.env`).
- **Data fetching:** `@tanstack/react-query` + `zustand`; query keys in `utils/queryKeys.ts`; hooks organized by domain under `hooks/` (alerts, auth, batch, catalog, cost, establishment, etc.).
- **UI:** Components in `components/ui/` (shadcn), `components/layout/`, `components/shared/`; util `cn()` in `lib/utils.ts`; global CSS/theme in `app/globals.css` (also imports `shadcn/tailwind.css`).

## Gotchas
- Always use `pnpm`, not npm/yarn. Workspace `pnpm-workspace.yaml` only sets `allowBuilds` for `msw/sharp/unrs-resolver`.
- Dev/build force `--webpack` — Turbopack is not configured.
- `pnpm format` only touches `app/`; run `npx prettier --write` explicitly for other dirs before commit or let `lint-staged` handle it.
- No test runner configured — no `jest`/`vitest`/`playwright` scripts or CI workflows. Verify via `pnpm lint` + `npx tsc --noEmit` + `pnpm build`.
- `next-env.d.ts` is gitignored and eslint-ignored; don't edit.
