# Backend gaps affecting this frontend

This frontend is built screens-only against the intended API shape. The
items below are gaps or bugs in the current backend (`events-manager`)
that block or complicate wiring real integration on top of these screens.
None of these were fixed here — the backend repo is out of scope to modify.

1. **No public "list events" endpoint.** `GET /wedding` exists but is
   authenticated and scoped to the logged-in owner's own events. The
   guest-facing browse/filter page (`/`) has no endpoint to call at all.
   Needed: a public, filterable-by-name list endpoint.

2. **No single-event lookup.** There is no `GET /weddings/:id` (or by
   slug) returning just the event's own fields. Only nested
   `/weddings/:id/guests` and `/weddings/:id/gifts` exist. The guest
   event-detail page (`/events/:slug`) has nothing to fetch the event's
   own name/date from.

3. **`GET /users` is unauthenticated and returns every user's
   `passwordHash`.** Security bug — integration must never surface this
   response to any screen even once it's fixed to not need this call.

4. **`POST /users` echoes the newly-hashed password back** in its
   response body. Same class of leak as #3.

5. **`POST /gifts` (create gift) has no auth or ownership check.** Anyone,
   unauthenticated, can add a gift to any event.

6. **Route naming has three different conventions:** `/wedding` (list
   the caller's own events), `/wedding/:id` (edit, singular),
   `/weddings/:id/...` (nested reads, plural), and `/users` (register) vs
   `/user/login` (login, singular). Integration needs the exact literal
   path per action — there's no consistent pattern to infer from.

7. **`Session` has no primary key (`@id`) on `id` in `contract.prisma`.**
   Worth double-checking — may be a migration-time bug.

8. **No DELETE endpoints** for event, gift, or guest.

9. **No way to read `Order` records at all.** The owner "who claimed what
   gift" screen (`/dashboard/events/:id/orders`) is built here against a
   documented-but-nonexistent endpoint.

10. **No protection against two guests claiming the same gift** — no
    uniqueness constraint or status gate on `Order.giftId`.

11. **No `/logout` endpoint** — acceptable, since auth is now a bearer
    token (`POST /user/login` returns `{ token, expiresAt }` in the
    response body, no cookie); discarding it client-side is sufficient.
