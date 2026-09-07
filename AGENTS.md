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
- Pre-existing `tsc` errors (do NOT chase): `analisis/page.tsx` (number→string), `produccion/page.tsx` (`idRodeo` vs `rodeo`), generated `.next/dev/types/.../costos/page.ts`. Only ensure no NEW errors in touched files.
- RHF validation timing: `setValue(..., { shouldValidate: true })` in `onValueChange` shows errors before submit. Omit it when errors must appear only after Guardar (post-submit revalidation is `onChange` by default).

## Domain: Establecimiento / Configuración

- **Update flow (tab General):** `useEstablishmentForm` (`hooks/establishment/useEstablishmentForm.ts`) owns RHF state + preload and builds the payload; `useUpdateEstablishment` (note: lives in misnamed file `useUpdateEstablishment.ts`) is the thin `useMutation` wrapper. Sends `UpdateEstablishmentPayload` (`types/establishment.ts:48`: `idEst`, `nombre`, `tipo_ordenie`, `ordenie_dia`, `promLitros`, `ubicacion: { provincia, localidad }`) via `PATCH /conf/establecimiento` (`utils/api/establishment.api.ts:14`). `idEst` falls back to route param `id` when `idEstablecimiento` is missing.
- **Config data shape:** `useConfiguration()` returns the axios body, so fields hang off ONE `data` level — `config?.data?.tipo_ordeñe`, `config?.data?.ordeñe_por_dia`, `config?.data?.litros_por_dia` (same as `Configuration.tsx:100,138`). Never use double `data.data` (resolves to `undefined` and silently falls back).
- **Cuenca Lechera is OUT of this release:** commented (not deleted) in `GeneralTab.tsx` (options const, `watch`, JSX block), `establishmentFormSchema` (`types/establishment.ts:34`) and form defaults/reset. Keep it out of the update payload only; reactivate all three sides together.
- **Tipo ordeñe source of truth:** `TipoOrdenie` enum (`types/enums.ts:93`, values like `linea`, `espina_de_pescado`). `GeneralTab.tsx` iterates `Object.values(TipoOrdenie)` with enum values as `SelectItem` values — never hardcode label lists (old labels like `En Tándem` don't exist in backend). Schema keeps `tipoOrdenie` as `z.string()`.
- **Numeric fields:** `register('field', { valueAsNumber: true })` + `z.number()` in schema (see `ordenie_dia` 1–3 int, `promLitros` positive in `types/establishment.ts:36`).
- **Provincia/Localidad:** local JSON (`utils/assets/ubications/provinces.json`, `localities.json`) via `useProvince`/`useLocality` + `utils/api/ubication.api.ts`. Select values are **names**, and the JSON has homonyms (`San Pedro` ×12) — `getLocalities` dedupes by `nombre` because Radix keys items by value and duplicates break rendering. Localidad select is cascading (disabled until Provincia, cleared on change).
- **Sidebar** (`components/layout/AppSidebar.tsx:38`): `Configuración` (Settings icon) lives in `mainMenuItems` before `TamboEngine`; bottom menu holds only the `Volver` button.
- **Config tabs** (`.../configuration/ConfigurationDashboard.tsx`): underline style (`border-b-2`, active `text-[#29845A]`), not boxed.
