# RecruitPro — Recruitment Portal

React + Vite skeleton aligned with the Velocity Recruitment design system.

## Stack

- Vite + React 19 + TypeScript
- TanStack Query — per-entity queries and mutations
- TanStack Table — data grids
- React Hook Form + Zod
- Tailwind CSS v4 + shadcn-style UI (Radix)

## Run

```bash
cd web
npm install
npm run dev
```

## Architecture (per entity)

Each module is self-contained so changes to one entity do not cascade:

```
features/companies/
  CompaniesPage.tsx       # page orchestration
  CompaniesTable.tsx      # TanStack Table columns
  CompanyCreateDrawer.tsx
  CompanyDetailDrawer.tsx
  CompanyFormFields.tsx
  company-schema.ts
  hooks.ts                # query keys + dedicated mutations

api/companies.ts          # fetchCompanies, createCompany, updateCompany, …
```

Same pattern for `contacts`, `candidates`, and `jobs`.

## Data

- **100 seed records** per entity in `src/api/mock-db.ts`
- **Pagination**: 10 rows per page (`DEFAULT_PAGE_SIZE`), bar at the bottom of each table
- List APIs return `{ data, total, page, pageSize, totalPages }`

## Theming

The app uses an **external, swappable theme** with light/dark mode:

| File | Purpose |
|------|---------|
| `src/config/theme.ts` | Switch preset & default mode |
| `src/themes/vercel.css` | Vercel black & white CSS variables |
| `src/themes/registry.ts` | Register available presets |
| `src/providers/theme-provider.tsx` | Applies `data-theme` + `next-themes` |

**Switch theme preset:** set `themeConfig.preset` in `src/config/theme.ts`, add CSS in `src/themes/`, import in `index.css`, register in `registry.ts`.

**Toggle dark mode:** use the sun/moon button in the top bar (persists to localStorage).

Table rows use Vercel-style zebra striping via `--table-stripe` / `--table-hover` tokens.


Replace functions in `src/api/companies.ts` (and siblings) with `fetch` calls. Keep the same function signatures and update `features/*/hooks.ts` only if response shapes change.
