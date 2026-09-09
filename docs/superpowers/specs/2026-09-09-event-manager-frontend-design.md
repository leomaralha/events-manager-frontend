# Event Manager Frontend — Design Spec

Date: 2026-09-09
Status: Approved for planning

## 1. Purpose & scope

Build the frontend for an event-management app (event owners register events and a gift list; guests browse events, RSVP, and claim gifts). The backend (`events-manager`, sibling repo at `../events-manager`) is owned by a friend and is **out of scope to modify**, even for bugs found along the way.

**This repo's job is screens only.** All real API integration — fetch calls, auth-token storage/attachment, error retry, loaders wired to the live backend — is explicitly the friend's job, done later on top of this codebase. Every page and component in this repo is built against typed props (data in, callbacks out) and local mock fixtures, so it is fully viewable and demoable with zero network calls. The exact data/callback shape each screen needs is documented in `src/types/contracts.ts`, which doubles as the handoff spec for integration work.

## 2. Domain mapping

The backend models a wedding-gift registry (`Wedding.coupleName`, `weddingDate`), but all UI copy, routes, and component/type names in this repo use generic **Event** language (`Event Name`, `Event Date`, `EventList`, `EventDetail`, etc.). Field mapping:

| Backend field (`Wedding`) | Frontend label |
|---|---|
| `coupleName` | Event Name |
| `slug` | URL identifier (not directly shown) |
| `weddingDate` | Event Date |
| `ownerId` | (not shown; implicit from session) |

`Gift`, `Guest`, `Order`, and `PresenceConfirmation` map onto Gift, Guest, GiftClaim/Order, and RSVP concepts respectively with no renaming needed.

## 3. Stack

- **Vite + React 19 + TypeScript** — SPA, no SSR needed (API is a separate Fastify service).
- **React Router v7** for routing.
- **Tailwind CSS** for styling (visual polish pass done later via the frontend-design skill during implementation, not during this spec).
- **React 19 idioms**: `use()` + `<Suspense>` for reading async values, `useActionState` for form submissions — used with mock/local promises now; real promises get swapped in during integration without changing component internals.
- **Vitest + React Testing Library** for component/logic tests. No e2e (Playwright) — out of scope for this project's size.

## 4. Pages

**Guest-facing (public, no login):**
- `/` — Browse Events: list + filter-by-name search box.
- `/events/:slug` — Event detail: event info, gift list, RSVP action, "claim a gift" action.

**Owner-facing (authenticated):**
- `/login` — Login form.
- `/register` — Registration form.
- `/dashboard` — List of the owner's own events.
- `/dashboard/events/new` — Create event form.
- `/dashboard/events/:id/edit` — Edit event form.
- `/dashboard/events/:id/gifts` — Add/view gift list for one event.
- `/dashboard/events/:id/guests` — View RSVP'd guest list for one event.
- `/dashboard/events/:id/orders` — View who claimed which gift (screen will be built; **no backend endpoint exists to power it** — see §7).

Auth-gated routes (everything under `/dashboard`) render behind a route guard component that takes a `currentUser: User | null` prop — the friend's integration wires the real value; for local dev/demo the mock provider supplies a fixture user.

## 5. Component/data contracts

`src/types/contracts.ts` defines, per screen, the exact props contract integration must satisfy — for example:

```ts
export interface EventListProps {
  events: EventSummary[];
  filterQuery: string;
  onFilterChange: (query: string) => void;
}

export interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<{ token: string; expiresAt: string } | { error: string }>;
}

export interface GiftClaimFormProps {
  gift: Gift;
  onClaim: (details: { guestName: string; guestEmail: string; message?: string }) => Promise<{ ok: true } | { error: string }>;
}
```

Every page component only depends on these contracts and on `src/mocks/*` fixtures for standalone rendering — never on `fetch`, `localStorage`, or any auth/token logic directly. This is a hard boundary: no file under `src/` performs a network call or reads/writes a token.

## 6. Auth UI (screens only, no token logic)

- `LoginForm` and `RegisterForm` take an `onSubmit` callback prop and render loading/error/success UI states based on the callback's resolved value — they never see or store the token themselves.
- A `currentUser: User | null` value is passed down from the app shell (via context) to gate dashboard routes and show/hide nav items; in this repo, that context is seeded by a mock provider (`MockAuthProvider`) for demoing, and the friend replaces it with a real provider that owns the actual Bearer token (per the backend's `POST /user/login` response shape: `{ token, expiresAt }`, no cookie).
- "Logout" in the UI is just a button calling an `onLogout: () => void` prop — no token-clearing logic lives here.

## 7. Backend gaps (`missing-features.md`)

Written to the repo root, covering everything integration will hit:

1. **No public "list events" endpoint** — `GET /wedding` exists but is authenticated and owner-scoped only; the guest browse/filter page (`/`) has nothing to call. Needed: a public `GET /events`-equivalent, filterable by name.
2. **No single-event lookup** — no `GET /weddings/:id` or by-slug endpoint returning just the event's own fields; only nested `/weddings/:id/guests` and `/weddings/:id/gifts` exist. The guest event-detail page (`/events/:slug`) can't fetch the event's own name/date.
3. **`GET /users` is unauthenticated and returns every user's `passwordHash`** — security bug, not ours to fix, but integration must never surface this response verbatim to any screen.
4. **`POST /users` echoes the newly-hashed password back** in its response body — same class of leak; integration should discard that field rather than store/display it.
5. **`POST /gifts` has no auth or ownership check** — anyone can add a gift to any event. The owner "add gift" screen will call this without any real protection existing server-side yet.
6. **Inconsistent route naming**: `/wedding` (list mine), `/wedding/:id` (edit, singular), `/weddings/:id/...` (nested reads, plural), `/users` (register) vs `/user/login` (login, singular). Whoever wires integration needs the exact literal path per action — no consistent convention to infer from.
7. **`Session` model has no primary key (`@id`) on `id` in `contract.prisma`** — worth the backend owner double-checking; may be a migration-time bug.
8. **No DELETE endpoints** for event, gift, or guest.
9. **No way to read `Order` records** — the owner "who claimed what" screen (`/dashboard/events/:id/orders`) will be built against a documented-but-nonexistent endpoint.
10. **No protection against two guests claiming the same gift** (race condition — no uniqueness constraint on `Order.giftId` or status gate).
11. **No `/logout` endpoint** — acceptable, since auth is a bearer token now; discarding it client-side is sufficient.

## 8. Error handling (UI-level only)

Each page defines its own empty/loading/error visual states as plain rendered output based on props (e.g., `status: 'idle' | 'loading' | 'error' | 'success'` passed in, or derived from a mock promise's state during local dev). No retry logic, no network error classification — that's integration's job once real calls are wired in.

## 9. Testing

Vitest + React Testing Library covering: filter logic on the event browse page, form validation states (login/register/create-event/claim-gift), and rendering of each contract-typed component against its mock fixtures. No integration/e2e tests in this repo.

## 10. Out of scope (explicitly)

- Any `fetch`/HTTP client code.
- Any token storage/attachment (`localStorage`, `Authorization` header, cookie handling).
- Any retry/error-classification logic tied to real network failures.
- Modifying the backend repo for any reason, including the bugs listed in §7.
