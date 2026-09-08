# Garibar — Cargo Orders Admin

A small admin screen for managing cargo orders: a paginated, filterable list plus create,
edit and delete, built on the mock API provided with the assignment.

## Stack

| Concern      | Choice                                          |
| ------------ | ----------------------------------------------- |
| Build        | Vite 8                                          |
| UI           | React 19 + TypeScript 6 (`strict`)              |
| Components   | Ant Design 6                                    |
| Server state | TanStack React Query 5                          |
| URL state    | React Router 7 (`useSearchParams`)              |
| Tests        | Vitest + Testing Library                        |
| Lint         | oxlint                                          |

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
```

Other scripts:

```bash
npm run build        # type-check then produce a production build
npm run typecheck    # tsc -b
npm run lint         # oxlint
npm test             # unit tests
npm run test:watch   # unit tests in watch mode
```

## How `mockApi.js` is used

The file is included **unchanged** at `src/mock/mockApi.js`.

Because it ships without types, a sibling declaration file `src/mock/mockApi.d.ts` describes
its contract. TypeScript resolves `import { getCargoOrders } from '@/mock/mockApi'` to the
`.d.ts`, while Vite resolves the same specifier to the `.js` — so every call site is fully
typed and the provided file is never touched.

Everything else goes through one thin wrapper, `src/features/cargo-orders/api/cargoOrders.api.ts`,
which is the only module that imports the mock. Moving to a real backend means rewriting that
file and nothing else, which is also why Axios was not added: there is no HTTP call to make yet,
and introducing a client that only wraps in-memory functions would be dead weight.

## Project structure

```
src/
├── app/                        # providers, query client, routes, layout
├── features/cargo-orders/
│   ├── api/                    # data source wrapper + query key factory
│   ├── components/             # filters, table, columns, form modal, status tag
│   ├── hooks/                  # list query, mutations, URL-backed list params
│   ├── lib/                    # cache updates, param parsing, form mapping
│   ├── constants.ts
│   └── types.ts                # the domain model, single source of truth
├── mock/                       # provided mockApi.js + its type declarations
├── pages/                      # composes the feature into a screen
└── shared/                     # formatters, error helper, debounce hook, UI primitives
```

Feature-first: everything a cargo order needs lives under one folder, and `shared/` only holds
code that is genuinely domain-agnostic.

## Notable decisions

**Query keys are hierarchical.** `cargoOrderKeys.list(params)` extends `lists()` extends `all`,
so a mutation invalidates `lists()` once and every cached filter/page combination refreshes
without the mutation knowing which ones exist.

**List params are normalized before they become a query key.** Blank filters are dropped and
values are trimmed, so `''` and `undefined` cannot produce two cache entries for the same view.

**The URL is the source of truth for the list.** Page, page size and all three filters live in
the query string, which makes any view shareable and refresh-safe. Text filters are written
there only after their debounce settles, so typing does not create a request per keystroke.

**Deletes are optimistic, updates patch the cache.** Deleting removes the row (and decrements
the total) immediately and rolls back the snapshot on failure; saving an edit writes the updated
row into every cached list before revalidating, so the table never flickers.

**Form validation mirrors the mock's own rules.** Strings must be non-blank after trimming and
numbers must be strictly positive, matching what `mockApi.js` enforces, so a valid form can
never be rejected by the API. Blank descriptions are omitted rather than sent as `''`, which is
how the mock stores an absent description.

**Out-of-range pages are corrected.** Deleting the last row of the last page, or narrowing a
filter, clamps the page back into range instead of showing an empty table.

## Assumptions

- The mock keeps its data in memory, so a page refresh resets it to the original 15 orders.
- `getCargoOrders` never rejects, so the list's error state cannot be triggered through the UI.
  It is implemented and was verified by temporarily throwing inside the API wrapper.
- Prices are displayed with thousand separators; the form takes a raw number and shows the
  formatted value as a hint below the field, which keeps the input predictable to type into.
- The UI is English and LTR, and no authentication layer was added, as allowed by the brief.

## Time spent

Roughly 5 hours, including reading the mock closely, wiring the data layer, building the UI and
writing tests and documentation.

## With more time

- Component/integration tests for the table and the form modal (only helpers and the debounce
  hook are covered today).
- Server-driven sorting and a saved-views concept once the real API supports them.
- Route-level code splitting: the bundle is dominated by Ant Design (~360 kB gzipped) and would
  benefit from lazy-loading the modal and trimming unused icons.
- Cypress/Playwright smoke test for the full create → edit → delete path.

## AI usage

Cursor (Claude) was used as a pair-programming assistant throughout: scaffolding boilerplate,
drafting the Ant Design markup and the first pass of the unit tests, and cross-checking the
Ant Design v5 → v6 migration notes. Architecture, the caching and URL-sync strategy, and every
review decision are mine; all generated code was read, adjusted and verified in the browser.
