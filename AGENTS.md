# AGENTS.md — Tambo360 Frontend

## Stack

- Next.js 16.2 (App Router) + React 19.2 + TypeScript 5, Tailwind CSS 4 (`@tailwindcss/postcss`), shadcn `radix-vega` (`radix-ui` + `@base-ui/react`).
- Package manager: **pnpm** (`pnpm-lock.yaml` v9). Path alias `@/*` → `./*` (`tsconfig.json`).
- PWA via `@ducanh2912/next-pwa` (`dest: public`, disabled in `development`, `fallbacks.document: /offline.html`). Build ignores TS/ESLint errors (`next.config.ts`).

## Commands

```bash
pnpm dev          # next dev --webpack (NOT --turbo)
pnpm build        # next build --webpack — passes even with tsc errors (ignoreBuildErrors)
pnpm lint         # eslint (eslint.config.mjs)
pnpm format       # prettier --write "app/**/*.{ts,tsx}" — only app, not repo-wide
npx tsc --noEmit  # no script alias — run directly for typecheck; currently clean, keep it so
```

## Lint / Format / Commits

- ESLint: `eslint-config-next/core-web-vitals` + `typescript`, `unused-imports` as `warn` only, `no-unused-vars`/`no-explicit-any`/`no-img-element` off; ignores `.next/**, out/**, build/**, next-env.d.ts`.
- Prettier: `singleQuote, semi: false, trailingComma: es5, tabWidth: 2, printWidth: 80, endOfLine: lf`. `lint-staged` runs `prettier --write` on `*.{ts,tsx,js,jsx}` (broader than `pnpm format`).
- Husky: `pre-commit` → `lint-staged`; `commit-msg` → `commitlint` conventional (`feat(scope): ...`).
- No test runner, no CI workflows (`.github/` absent). Verify via `pnpm lint` + `npx tsc --noEmit` + `pnpm build`.

## Architecture

- **Routes:** `app/` groups `(landing)`, `(auth)`, `(onboard)`; deep nested `app/(onboard)/organizaciones/[orgId]/[id]/(dashboard)/...` — `(dashboard)` is a route group, not a URL segment.
- **Providers** order (`utils/Providers.tsx`): `QueryProvider > SidebarProvider > AuthProvider > TooltipProvider` + `Toaster` (sonner). Wrap new global providers there. Defaults: `staleTime 5m, gcTime 10m, refetchOnWindowFocus false, retry 3` (queries) / `retry 1` (mutations).
- **API:** single instance `services/api.ts` with `baseURL: '/backend'` — a same-site proxy via `rewrites` in `next.config.ts` to `NEXT_PUBLIC_API_URL` (fallback: Render `.../api`). `withCredentials: true`, `timeout: 30000`. **Dead duplicate** `services/service.ts` (Bearer `localStorage`, zero imports) — never import. 401 interceptor redirects to `/iniciar-sesion` except `/auth/me`, `/auth/logout`, and offline.
- **Tenant headers** `x-organizacion-id` / `x-establecimiento-id` injected twice: `HeaderIds.tsx` (server layout params → `api.defaults.headers`) + request interceptor (client fallback via `pathname.split`, skips `configuracion/invitar/cuestionario` as estId). In React code prefer `useParams()` (`orgId`/`id`) over `pathname.split`.
- **Data fetching:** `@tanstack/react-query` + `zustand`; keys in `utils/queryKeys.ts`; hooks by domain in `hooks/`. Org/est queries must guard `enabled` on both route params (pattern: `const hasContext = !!orgId && !!estId` from `useParams()`), otherwise 401 loops.
- **UI:** `components/ui/` (shadcn), `components/layout/`, `components/shared/`; `cn()` in `lib/utils.ts`; theme in `app/globals.css`.

## Offline-first (do not break)

- **Persisted cache:** `QueryProvider` uses `PersistQueryClientProvider` + manual `idb-keyval` persister (key `tambo360-rq-cache`, `maxAge` 48h). Only `shouldDehydrateQuery` allowlist persists: `batch`, `mermas`, `decrease`, `product`, `establishment/configuration|list|opciones-seguimiento|transferir-form-data`. Auth/dashboard/mutations never persist.
- **Service worker:** `runtimeCaching` per endpoint — auth `NetworkOnly` (never cache 401s), lotes/mermas/config/catálogos `NetworkFirst` (`networkTimeoutSeconds: 3`, 48h). When adding a GET endpoint that must work offline, add a matching entry (template commented in `next.config.ts`).
- **Outbox pattern:** `stores/use{Batch,Decrease,Transfer}Outbox.ts` (zustand + `localStorage` persist). Ops carry `scope: orgId/estId` — never drain across scopes. `useBatchOutbox.enqueue` coalesces (update-into-pending-create, delete-cancels-create, last-update-wins); mirror that logic when touching other outboxes.
- **Sync:** `useOutboxSync()` mounts ONCE in `components/layout/Layout.tsx`; drains current scope on mount + `online` event, replays in `createdAt` order, remaps temp ids (`lib/offlineId.ts` `randomLoteId()` UUIDv7 → real id via `replaceTempLote/replaceTempMerma`), `MAX_TRIES 3` then `moveToFailed` + toast, invalidates batch/mermas/establishment/dashboard after. `SyncOverlay` blocks UI while draining.
- **Offline session:** `lib/offlineUser.ts` snapshots last user + `cuestionarioCompletado` flag in `localStorage` (profile only, never tokens). `AuthContext` restores snapshot when `!navigator.onLine`; `ProtectedLayout` renders shell via `offlineWithCache` instead of redirecting to login. `login()` verifies `GET /auth/me` before navigating (iOS ITP can drop the cookie on 200).

## Gotchas

- Dev/build force `--webpack` — Turbopack not configured. `pnpm format` only touches `app/`; use `npx prettier --write` elsewhere.
- `next-env.d.ts` gitignored + eslint-ignored; `tsconfig.json` includes `.next/types` (generated errors source).
- **RHF — two patterns coexist, don't mix:** auth forms `useForm({resolver: zodResolver(Schema), mode: 'onChange'})`, `<Button disabled={isPending || !isValid}>`, show errors/borders only after `submitCount > 0`; establecimiento/config selects use `setValue(..., {shouldValidate: true})` in `onValueChange` (immediate errors OK for selects only).
- **Name input:** `allowOnlyLettersKeyDown` (`lib/utils.ts`, incl. accented chars + control-key passthrough) with `maxLength={20}`.
- **Recuperar contraseña:** state machine `useState(token ? 3 : 1)` — `1 email → 2 check-email → 3 new-pass → 4 éxito`; steps 2/4 use `vacas_4.webp`.

## Domain: Establecimiento / Configuración

- **Update flow (tab General):** `useEstablishmentForm` owns RHF state + preload and builds payload; `useUpdateEstablishment` sends `UpdateEstablishmentPayload` (`idEst` falls back to route `id`) via `PATCH /conf/establecimiento`. `useConfiguration()` returns one `data` level (`config?.data?.tipo_ordeñe`) — never `data.data`. Questionnaire is a separate API (`POST /establecimiento/cuestionario`, `GET /establecimiento/cuestionario/info`).
- **Cuenca Lechera OUT:** commented (not deleted) in `GeneralTab.tsx`, schema, and form defaults/reset — reactivate the trio together.
- **Tipo ordeñe:** source is `TipoOrdenie` enum (`types/enums.ts`) iterated as `SelectItem` values — never hardcode labels (`En Tándem` obsolete); schema keeps `z.string()`.
- **Numeric fields:** `register('field', {valueAsNumber: true})` + `z.number()` (`ordenie_dia` 1–3 int, `promLitros` positive); `blockNegativeKeys` for number inputs.
- **Provincia/Localidad:** local JSON via `useProvince`/`useLocality`; select values are **names**, homonyms deduped by `nombre`; localidad disabled until provincia, cleared on change.
- **Sidebar** (`AppSidebar.tsx`): `mainMenuItems = [Dashboard, Producción, Costos Generales, Configuración, TamboEngine]`; bottom is `Cerrar Sesión` (via `useAuth().logout`), not `Volver`; `baseUrl` from `useParams()` first.
- **Config tabs:** underline `border-b-2`, active `text-[#29845A]`, not boxed.
