# AGENTS.md — Tambo360 Frontend

## Stack

- Next.js 16.2 (App Router) + React 19.2 + TypeScript 5, Tailwind CSS 4 (`@tailwindcss/postcss`), shadcn `radix-vega` (`radix-ui` + `@base-ui/react`).
- Package manager: **pnpm** (`pnpm-lock.yaml` v9, `autoInstallPeers:true`). Path alias `@/*` → `./*` (`tsconfig.json:21`).
- PWA via `@ducanh2912/next-pwa` — disabled in `development`, `dest: public`, `cacheOnFrontEndNav`/`aggressiveFrontEndNavCaching`/`reloadOnOnline` + `workboxOptions.disableDevLogs` (`next.config.ts:1`). Build ignores TS/ESLint errors (`next.config.ts:15,19`).

## Commands

```bash
pnpm dev          # next dev --webpack (NOT --turbo)
pnpm build        # next build --webpack — passes even with tsc errors (ignoreBuildErrors)
pnpm lint         # eslint (eslint.config.mjs)
pnpm format       # prettier --write "app/**/*.{ts,tsx}" — only app, not repo-wide
npx tsc --noEmit  # no script alias — run directly for typecheck
```

## Lint / Format / Commits

- ESLint: `eslint-config-next/core-web-vitals` + `typescript`, `eslint-plugin-unused-imports` as `warn` only, `no-unused-vars`/`no-explicit-any` off, `no-img-element` off, `eslint-config-prettier` last. Ignores `.next/**, out/**, build/**, next-env.d.ts` (`eslint.config.mjs:10`).
- Prettier: `singleQuote: true, semi: false, trailingComma: es5, tabWidth: 2, printWidth: 80, endOfLine: lf` (`.prettierrc`). `lint-staged` runs `prettier --write` on `*.{ts,tsx,js,jsx}` (broader than `pnpm format`); `.prettierignore` only `node_modules,build,.dist`.
- Husky: `pre-commit` → `lint-staged`; `commit-msg` → `commitlint --edit` with `@commitlint/config-conventional`. Commits must be conventional (`feat(scope): ...`).
- VS Code: `formatOnSave` + `source.fixAll.eslint` enabled (local only — `.vscode/` gitignored).

## Architecture

- **Routes:** `app/` with groups `(landing)`, `(auth)`, `(onboard)`; deep nested `app/(onboard)/organizaciones/[orgId]/[id]/(dashboard)/...` — dashboard is a parallel group, not a URL segment. Also `bienvenida`, `organizaciones`, `invitaciones`.
- **Providers** order matters (`utils/Providers.tsx:10`): `QueryProvider > SidebarProvider > AuthProvider > TooltipProvider` + `Toaster` (sonner, sibling of `AuthProvider` inside `SidebarProvider`). Wrap new global providers there. `QueryProvider` defaults `staleTime 5m, gcTime 10m, refetchOnWindowFocus false, retry 3` (`utils/QueryProvider.tsx:9`).
- **Auth:** `context/AuthContext.tsx` calls `GET /auth/me` on mount; 401 interceptor `services/api.ts:50` redirects to `/iniciar-sesion` except `/auth/me`+`/auth/logout`; `LANDING_PATHS` (`/,/contacto,/precios,/producto,/nosotros,/equipo,/testimonios`) skip loading gate. `cuestionarioCompletado` lives in context; `components/layout/PublicLayout.tsx` redirects authed users (verificar bypass) → `/bienvenida` or `/organizaciones/{orgId}/{id}/analisis|cuestionario`.
- **API:** Live instance `services/api.ts` with `baseURL: NEXT_PUBLIC_API_URL`, `withCredentials: true`; **dead duplicate** `services/service.ts` (Bearer `localStorage`) — never import. Headers `x-organizacion-id`/`x-establecimiento-id` injected twice: `HeaderIds.tsx` (layout SSR-safe, `app/(onboard)/organizaciones/[orgId]/[id]/layout.tsx:13`) + request interceptor `services/api.ts:9` (client fallback via `pathname.split`). Prefer `useParams()` (`orgId`/`id`) over `pathname.split` in React code; `AppSidebar.tsx:44`, `Configuration.tsx:273` keep split only as fallback.
- **Data fetching:** `@tanstack/react-query` + `zustand`; query keys `utils/queryKeys.ts`; hooks by domain `hooks/` (alerts, auth, batch, catalog, cost, establishment, etc.). **All org/est queries must guard** `enabled: !!orgId && !!id` — `useBatchesDay`/`useCurrentMonth`/`useGraph`/`useEstablishment` (`hooks/batch/useBatchesDay.ts:7`, `hooks/dashboard/useCurrentMonth.ts:7`) otherwise 401 loop.
- **UI:** `components/ui/` (shadcn), `components/layout/`, `components/shared/`; `cn()` in `lib/utils.ts`; global CSS/theme `app/globals.css` (imports `shadcn/tailwind.css`).

## Gotchas

- Always use `pnpm`, not npm/yarn. `pnpm-workspace.yaml` `allowBuilds` + `ignoredBuiltDependencies: [sharp,unrs-resolver]` (pnpm v10) — placeholders `"set this to true or false"`.
- Dev/build force `--webpack` — Turbopack not configured.
- `pnpm format` only touches `app/`; run `npx prettier --write` for other dirs or rely on `lint-staged`.
- No test runner — no `jest`/`vitest`/`playwright`, no CI workflows (`.github/` absent). Spec-kit lives in `specs/` (`001-autenticacion-sesion`, `002-onboarding-diagnostico-inicial`) — check `spec.md` before editing those flows. Verify via `pnpm lint` + `npx tsc --noEmit` + `pnpm build`.
- `next-env.d.ts` gitignored + eslint-ignored; `tsconfig.json` includes `.next/types` + `.next/dev/types` (source of generated errors).
- **Build ignores errors** — `pnpm build` passes even with broken types. Real errors: currently only `CreateBatchSmallModal.tsx` (80× `TS2304`) fails `tsc`; old claims about `analisis`/`produccion`/`.next/.../costos` are stale. Only ensure no NEW errors in touched files.
- **RHF validation — two patterns coexist:**
  - **Auth (login/register/recuperar):** `useForm({resolver:zodResolver(Schema), mode:'onChange'})`, `<Button disabled={isPending||!isValid}>`, errors/borders only `submitCount>0 && errors.x` + `useErrorMessage` toast on `submitCount>0`. Live enable, silent until click.
  - **Establecimiento/Config (GeneralTab, Configuration):** `setValue(...,{shouldValidate:true})` in `onValueChange` shows errors immediately — keep it for selects/comboboxes only.
- **Name input:** `allowOnlyLettersKeyDown` in `lib/utils.ts:8` — regex `/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]$/` + control keys passthrough (`Backspace/Delete/Arrows/Home/End`, `Ctrl/Meta`, `Dead`). Used with `maxLength={20}` (`RegisterForm.tsx:136`).
- **Recuperar contraseña:** state machine `useState(token?3:1)` (`app/(auth)/recuperar-contrasena/page.tsx:62`) — `1 email →2 check email →3 new pass (token) →4 éxito`; `2`/`4` use `vacas_4.webp`.

## Domain: Establecimiento / Configuración

- **Update flow (tab General):** `useEstablishmentForm` (`hooks/establishment/useEstablishmentForm.ts`) owns RHF state + preload and builds payload; `useUpdateEstablishment` (thin `useMutation` in misnamed file) sends `UpdateEstablishmentPayload` (`types/establishment.ts:48`: `idEst`, `nombre`, `tipo_ordenie`, `ordenie_dia`, `promLitros`, `ubicacion:{provincia,localidad}`) via `PATCH /conf/establecimiento` (`utils/api/establishment.api.ts:10`). `idEst` falls back to route `id` when missing.
- **Config data shape:** `useConfiguration()` (establishment PATCH) → one `data` level `config?.data?.tipo_ordeñe` etc. — never `data.data`. Questionnaire uses separate API `utils/api/establishment/configuration.api.ts` (`POST /establecimiento/cuestionario`, `GET /establecimiento/cuestionario/info`).
- **Cuenca Lechera OUT:** commented (not deleted) in `GeneralTab.tsx`, `establishmentFormSchema` (`types/establishment.ts:34`), form defaults/reset. Reactivate trio together.
- **Tipo ordeñe source:** `TipoOrdenie` enum (`types/enums.ts:93`, `linea`, `espina_de_pescado` etc.). `GeneralTab.tsx` iterates `Object.values(TipoOrdenie)` as `SelectItem` values — never hardcode labels (`En Tándem` obsolete). Schema keeps `z.string()`.
- **Numeric fields:** `register('field',{valueAsNumber:true})` + `z.number()` ( `ordenie_dia` 1–3 int, `promLitros` positive `types/establishment.ts:36`); `blockNegativeKeys` in `RodeoCategoriaCard.tsx:42` for numbers.
- **Provincia/Localidad:** local JSON (`utils/assets/ubications/provinces.json`, `localities.json`) via `useProvince`/`useLocality` + `utils/api/ubication.api.ts`. Select values are **names**, homonyms deduped (`San Pedro`×12) — `getLocalities` dedupes by `nombre`. Cascading (localidad disabled until provincia, cleared on change).
- **Sidebar** (`components/layout/AppSidebar.tsx:44`): `mainMenuItems=[Dashboard,Producción,Costos Generales,Configuración,TamboEngine]`; bottom is `Cerrar Sesión` (logout via `useAuth.logout`), not `Volver`. `baseUrl` from `useParams()` first.
- **Config tabs** (`ConfigurationDashboard.tsx`): underline `border-b-2`, active `text-[#29845A]`, not boxed.
