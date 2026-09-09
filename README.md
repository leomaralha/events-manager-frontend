# Event Manager Frontend

Screens-only frontend for an event-management app (owners register events
and a gift list; guests browse events, RSVP, and claim gifts). Built
against mock data — see `docs/superpowers/specs/2026-09-09-event-manager-frontend-design.md`
for the full design and `missing-features.md` for backend gaps found
along the way.

## Stack

Vite, React 19, TypeScript, React Router v7, Tailwind CSS v4, Vitest,
React Testing Library.

## Scope

This repo contains **no integration code** — no `fetch`, no auth-token
storage, no real network calls. Every screen is driven by typed props
defined in `src/types/contracts.ts` and demoed against fixtures in
`src/mocks/`. Wiring real data and auth on top of these components is a
separate piece of work.

## Development

```bash
npm install
npm run dev      # start the dev server
npm test         # run the test suite once
npm run test:watch
npm run build
```
