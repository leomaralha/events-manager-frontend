# Event Manager Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build every screen of the event-management frontend (guest browse/filter, event detail/RSVP/gift-claim, owner login/register/dashboard/event-CRUD/gift-management/guest-list/orders) as standalone, prop-driven components with mock data — zero network/auth-token code, ready for a separate integration pass.

**Architecture:** Vite + React 19 + TypeScript SPA, React Router v7 for routing, Tailwind CSS for styling. Every page/component reads data via `use()` on a promise passed in as a prop (mock promises now, real fetch promises later) and performs mutations via callback props driven by `useActionState`. A single `src/types/contracts.ts` is the frozen interface the integration layer must satisfy.

**Tech Stack:** React 19, TypeScript, Vite, React Router v7, Tailwind CSS v4, Vitest, React Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-09-event-manager-frontend-design.md`

## Global Constraints

- No file under `src/` performs a network call, or reads/writes a token/cookie/`localStorage` for auth purposes. (Spec §5, §10)
- All UI copy uses generic "Event" language, never "Wedding"/"Couple". (Spec §2)
- Every screen must render standalone against mock fixtures with no crash (demoable in isolation). (Spec §1)
- Data-reading components use React's `use()` + `<Suspense>`; mutation forms use `useActionState`. (Spec §3, §6)
- `src/types/contracts.ts` is the single source of truth for prop shapes — later tasks must match it exactly, never redefine ad hoc shapes.

---

## Task 1: Project scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/index.css`
- Create: `src/App.tsx`
- Create: `src/App.test.tsx`
- Create: `src/test/setup.ts`
- Create: `.gitignore`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: a running Vite dev server, a working `npm test` (Vitest + RTL + jsdom), Tailwind available via `@import "tailwindcss"`. `App` is a placeholder component later fully replaced in Task 6.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "events-manager-frontend",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.1.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@tailwindcss/vite": "^4.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "jsdom": "^25.0.1",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.0",
    "vite": "^6.0.0",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: lockfile created, no errors.

- [ ] **Step 3: Create `vite.config.ts`**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 5: Create `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "types": ["node"]
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 6: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Event Manager</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Create `src/index.css`**

```css
@import "tailwindcss";
```

- [ ] **Step 8: Create `src/App.tsx` (placeholder, replaced in Task 6)**

```tsx
export default function App() {
  return <p>Event Manager scaffold ready.</p>;
}
```

- [ ] **Step 9: Create `src/main.tsx`**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 10: Create `src/test/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 11: Write the failing test — `src/App.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the scaffold placeholder", () => {
    render(<App />);
    expect(screen.getByText("Event Manager scaffold ready.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 12: Run the test to verify it passes** (App.tsx already exists from Step 8, so this confirms the toolchain, not TDD red/green)

Run: `npm test`
Expected: 1 passed.

- [ ] **Step 13: Create `.gitignore`**

```
node_modules
dist
*.local
```

- [ ] **Step 14: Verify dev server boots**

Run: `npm run dev -- --port 5173 &` then `curl -s http://localhost:5173 | grep -q "Event Manager" && echo OK`; then stop the background server.
Expected: `OK` printed.

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "Scaffold Vite + React 19 + TS + Tailwind + Vitest project"
```

---

## Task 2: `missing-features.md`

**Files:**
- Create: `missing-features.md`

**Interfaces:**
- Consumes: Spec §7 (backend gaps list)
- Produces: a standalone doc, no code dependency on anything else.

- [ ] **Step 1: Write the file**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add missing-features.md
git commit -m "Document backend gaps affecting frontend integration"
```

---

## Task 3: Domain types, contracts, and mock fixtures

**Files:**
- Create: `src/types/domain.ts`
- Create: `src/types/contracts.ts`
- Create: `src/mocks/events.ts`
- Create: `src/mocks/gifts.ts`
- Create: `src/mocks/guests.ts`
- Create: `src/mocks/orders.ts`
- Create: `src/mocks/events.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: every type and mock-fetch function every later task imports. Exact names below are load-bearing for all subsequent tasks.

- [ ] **Step 1: Create `src/types/domain.ts`**

```ts
export interface EventSummary {
  id: number;
  slug: string;
  name: string;
  date: string;
}

export interface EventDetails extends EventSummary {
  giftCount: number;
  guestCount: number;
}

export interface Gift {
  id: number;
  eventId: number;
  name: string;
  description?: string;
  price?: number;
  claimed: boolean;
}

export interface Guest {
  id: number;
  name: string;
  email: string;
}

export interface OrderSummary {
  id: number;
  giftName: string;
  guestName: string;
  guestEmail: string;
  message?: string;
  status: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export type SubmitResult = { ok: true } | { ok: false; error: string };

export type LoginOutcome =
  | { ok: true; token: string; expiresAt: string }
  | { ok: false; error: string };
```

- [ ] **Step 2: Create `src/types/contracts.ts`**

```ts
import type { ReactNode } from "react";
import type {
  EventSummary,
  EventDetails,
  Gift,
  Guest,
  OrderSummary,
  AuthUser,
  SubmitResult,
  LoginOutcome,
} from "./domain";

export interface EventFilterBarProps {
  value: string;
  onChange: (value: string) => void;
}

export interface EventCardProps {
  event: EventSummary;
  href: string;
}

export interface EventListProps {
  eventsPromise: Promise<EventSummary[]>;
  filterQuery: string;
}

export interface EventDetailProps {
  eventPromise: Promise<EventDetails>;
}

export interface EventFormValues {
  name: string;
  date: string;
}

export interface EventFormProps {
  initialValues?: EventFormValues;
  onSubmit: (values: EventFormValues) => Promise<SubmitResult>;
  submitLabel: string;
}

export interface GiftListProps {
  giftsPromise: Promise<Gift[]>;
  renderAction?: (gift: Gift) => ReactNode;
}

export interface GiftFormProps {
  onSubmit: (values: {
    name: string;
    description?: string;
    price?: number;
  }) => Promise<SubmitResult>;
}

export interface GiftClaimFormProps {
  gift: Gift;
  onClaim: (details: {
    guestName: string;
    guestEmail: string;
    message?: string;
  }) => Promise<SubmitResult>;
}

export interface GuestListProps {
  guestsPromise: Promise<Guest[]>;
}

export interface RsvpFormProps {
  onRsvp: (details: { guestName: string; guestEmail: string }) => Promise<SubmitResult>;
}

export interface OrderListProps {
  ordersPromise: Promise<OrderSummary[]>;
}

export interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<LoginOutcome>;
}

export interface RegisterFormProps {
  onSubmit: (values: {
    name: string;
    email: string;
    password: string;
  }) => Promise<SubmitResult>;
}

export interface AuthContextValue {
  currentUser: AuthUser | null;
  onLogout: () => void;
}
```

- [ ] **Step 3: Create `src/mocks/events.ts`**

```ts
import type { EventSummary, EventDetails } from "../types/domain";

export const mockEvents: EventSummary[] = [
  { id: 1, slug: "ana-e-joao", name: "Ana & João's Wedding", date: "2026-11-14" },
  { id: 2, slug: "summer-bbq", name: "Summer BBQ Party", date: "2026-07-20" },
  { id: 3, slug: "baby-shower-lu", name: "Lu's Baby Shower", date: "2026-08-02" },
];

export function fetchMockEvents(): Promise<EventSummary[]> {
  return Promise.resolve(mockEvents);
}

export function fetchMockEventDetails(slug: string): Promise<EventDetails> {
  const event = mockEvents.find((e) => e.slug === slug);
  if (!event) return Promise.reject(new Error(`Event not found: ${slug}`));
  return Promise.resolve({ ...event, giftCount: 4, guestCount: 12 });
}
```

- [ ] **Step 4: Create `src/mocks/gifts.ts`**

```ts
import type { Gift } from "../types/domain";

const mockGiftsByEvent: Record<number, Gift[]> = {
  1: [
    { id: 101, eventId: 1, name: "Blender", description: "500W, glass jar", price: 250, claimed: false },
    { id: 102, eventId: 1, name: "Bed Sheets", description: "Queen size, cotton", price: 180, claimed: true },
  ],
  2: [
    { id: 201, eventId: 2, name: "Cooler Box", price: 90, claimed: false },
  ],
  3: [
    { id: 301, eventId: 3, name: "Stroller", price: 600, claimed: false },
  ],
};

export function fetchMockGifts(eventId: number): Promise<Gift[]> {
  return Promise.resolve(mockGiftsByEvent[eventId] ?? []);
}
```

- [ ] **Step 5: Create `src/mocks/guests.ts`**

```ts
import type { Guest } from "../types/domain";

const mockGuestsByEvent: Record<number, Guest[]> = {
  1: [
    { id: 1, name: "Carla Souza", email: "carla@example.com" },
    { id: 2, name: "Bruno Lima", email: "bruno@example.com" },
  ],
  2: [],
  3: [{ id: 3, name: "Marta Alves", email: "marta@example.com" }],
};

export function fetchMockGuests(eventId: number): Promise<Guest[]> {
  return Promise.resolve(mockGuestsByEvent[eventId] ?? []);
}
```

- [ ] **Step 6: Create `src/mocks/orders.ts`**

```ts
import type { OrderSummary } from "../types/domain";

const mockOrdersByEvent: Record<number, OrderSummary[]> = {
  1: [
    {
      id: 1,
      giftName: "Bed Sheets",
      guestName: "Carla Souza",
      guestEmail: "carla@example.com",
      status: "PENDING",
    },
  ],
  2: [],
  3: [],
};

export function fetchMockOrders(eventId: number): Promise<OrderSummary[]> {
  return Promise.resolve(mockOrdersByEvent[eventId] ?? []);
}
```

- [ ] **Step 7: Write the test — `src/mocks/events.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { fetchMockEvents, fetchMockEventDetails } from "./events";

describe("event mocks", () => {
  it("resolves the full mock event list", async () => {
    const events = await fetchMockEvents();
    expect(events).toHaveLength(3);
    expect(events[0].slug).toBe("ana-e-joao");
  });

  it("resolves details for a known slug", async () => {
    const details = await fetchMockEventDetails("summer-bbq");
    expect(details.name).toBe("Summer BBQ Party");
    expect(details.giftCount).toBe(4);
  });

  it("rejects for an unknown slug", async () => {
    await expect(fetchMockEventDetails("nope")).rejects.toThrow("Event not found");
  });
});
```

- [ ] **Step 8: Run the tests**

Run: `npm test`
Expected: all pass, including the 3 new cases.

- [ ] **Step 9: Commit**

```bash
git add src/types src/mocks
git commit -m "Add domain types, screen contracts, and mock fixtures"
```

---

## Task 4: Shared UI primitives

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/TextField.tsx`
- Create: `src/components/ui/Spinner.tsx`
- Create: `src/components/ui/ErrorBanner.tsx`
- Create: `src/components/ui/EmptyState.tsx`
- Create: `src/components/ui/Button.test.tsx`
- Create: `src/components/ui/TextField.test.tsx`
- Create: `src/components/ui/ErrorBanner.test.tsx`
- Create: `src/components/ui/EmptyState.test.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `Button`, `TextField`, `Spinner`, `ErrorBanner`, `EmptyState` — imported by every form/list component in later tasks.

- [ ] **Step 1: Write the failing test — `src/components/ui/Button.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children and calls onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("disables the button when isLoading", () => {
    render(<Button isLoading>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Button`
Expected: FAIL — `./Button` does not exist.

- [ ] **Step 3: Create `src/components/ui/Button.tsx`**

```tsx
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

export function Button({
  isLoading = false,
  variant = "primary",
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const variantClass = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    secondary: "bg-slate-200 hover:bg-slate-300 text-slate-900",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  }[variant];

  return (
    <button
      {...rest}
      disabled={disabled || isLoading}
      className={`rounded-md px-4 py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${className}`}
    >
      {isLoading ? "…" : children}
    </button>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Button`
Expected: PASS (2 tests).

- [ ] **Step 5: Write the failing test — `src/components/ui/TextField.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("renders a labeled input and accepts typing", async () => {
    render(<TextField label="Email" name="email" />);
    const input = screen.getByLabelText("Email");
    await userEvent.type(input, "a@b.com");
    expect(input).toHaveValue("a@b.com");
  });

  it("shows an error message when provided", () => {
    render(<TextField label="Email" name="email" error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Create `src/components/ui/TextField.tsx`**

```tsx
import { useId, type InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
}

export function TextField({ label, name, error, ...rest }: TextFieldProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        {...rest}
        className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npm test -- TextField`
Expected: PASS (2 tests).

- [ ] **Step 8: Create `src/components/ui/Spinner.tsx` (no test — trivial static markup)**

```tsx
export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-2 text-slate-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
      <span>{label}</span>
    </div>
  );
}
```

- [ ] **Step 9: Write the failing test — `src/components/ui/ErrorBanner.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ErrorBanner } from "./ErrorBanner";

describe("ErrorBanner", () => {
  it("renders the message with an alert role", () => {
    render(<ErrorBanner message="Something went wrong" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
  });
});
```

- [ ] **Step 10: Create `src/components/ui/ErrorBanner.tsx`**

```tsx
export function ErrorBanner({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
      {message}
    </div>
  );
}
```

- [ ] **Step 11: Run test to verify it passes**

Run: `npm test -- ErrorBanner`
Expected: PASS (1 test).

- [ ] **Step 12: Write the failing test — `src/components/ui/EmptyState.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders the given message", () => {
    render(<EmptyState message="No events yet" />);
    expect(screen.getByText("No events yet")).toBeInTheDocument();
  });
});
```

- [ ] **Step 13: Create `src/components/ui/EmptyState.tsx`**

```tsx
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 px-4 py-8 text-center text-slate-500">
      {message}
    </div>
  );
}
```

- [ ] **Step 14: Run all tests**

Run: `npm test`
Expected: all pass.

- [ ] **Step 15: Commit**

```bash
git add src/components/ui
git commit -m "Add shared UI primitives: Button, TextField, Spinner, ErrorBanner, EmptyState"
```

---

## Task 5: Auth context and route guard

**Files:**
- Create: `src/context/AuthContext.tsx`
- Create: `src/components/layout/RouteGuard.tsx`
- Create: `src/context/AuthContext.test.tsx`
- Create: `src/components/layout/RouteGuard.test.tsx`

**Interfaces:**
- Consumes: `AuthContextValue`, `AuthUser` (Task 3)
- Produces: `AuthContext`, `useAuth()`, `MockAuthProvider` (demo-only provider, seeds a fixture user or `null`), `RouteGuard` — consumed by `Task 6` (NavBar) and `Task 14` (DashboardPage) and its owner-only siblings.

- [ ] **Step 1: Write the failing test — `src/context/AuthContext.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MockAuthProvider, useAuth } from "./AuthContext";

function Probe() {
  const { currentUser, onLogout } = useAuth();
  return (
    <div>
      <span data-testid="user">{currentUser ? currentUser.name : "guest"}</span>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

describe("MockAuthProvider", () => {
  it("provides no user by default", () => {
    render(
      <MockAuthProvider>
        <Probe />
      </MockAuthProvider>,
    );
    expect(screen.getByTestId("user")).toHaveTextContent("guest");
  });

  it("provides a seeded user when given one", () => {
    render(
      <MockAuthProvider seedUser={{ id: 1, name: "Ana", email: "ana@example.com" }}>
        <Probe />
      </MockAuthProvider>,
    );
    expect(screen.getByTestId("user")).toHaveTextContent("Ana");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- AuthContext`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Create `src/context/AuthContext.tsx`**

```tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthUser } from "../types/domain";
import type { AuthContextValue } from "../types/contracts";

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within an AuthContext provider");
  }
  return value;
}

/**
 * Demo-only provider for standalone/local rendering. Integration replaces
 * this with a provider backed by the real bearer token.
 */
export function MockAuthProvider({
  seedUser = null,
  children,
}: {
  seedUser?: AuthUser | null;
  children: ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(seedUser);

  return (
    <AuthContext.Provider value={{ currentUser, onLogout: () => setCurrentUser(null) }}>
      {children}
    </AuthContext.Provider>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- AuthContext`
Expected: PASS (2 tests).

- [ ] **Step 5: Write the failing test — `src/components/layout/RouteGuard.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MockAuthProvider } from "../../context/AuthContext";
import { RouteGuard } from "./RouteGuard";

describe("RouteGuard", () => {
  it("renders a fallback when there is no current user", () => {
    render(
      <MockAuthProvider>
        <RouteGuard>
          <p>Secret dashboard</p>
        </RouteGuard>
      </MockAuthProvider>,
    );
    expect(screen.queryByText("Secret dashboard")).not.toBeInTheDocument();
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
  });

  it("renders children when there is a current user", () => {
    render(
      <MockAuthProvider seedUser={{ id: 1, name: "Ana", email: "ana@example.com" }}>
        <RouteGuard>
          <p>Secret dashboard</p>
        </RouteGuard>
      </MockAuthProvider>,
    );
    expect(screen.getByText("Secret dashboard")).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Create `src/components/layout/RouteGuard.tsx`**

```tsx
import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import { EmptyState } from "../ui/EmptyState";

export function RouteGuard({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <EmptyState message="Please log in to view this page." />;
  }

  return <>{children}</>;
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npm test -- RouteGuard`
Expected: PASS (2 tests).

- [ ] **Step 8: Commit**

```bash
git add src/context src/components/layout/RouteGuard.tsx src/components/layout/RouteGuard.test.tsx
git commit -m "Add auth context, mock provider, and route guard"
```

---

## Task 6: Router, app shell, and page stubs

**Files:**
- Create: `src/components/layout/NavBar.tsx`
- Create: `src/components/layout/AppShell.tsx`
- Create: `src/pages/BrowseEventsPage.tsx` (stub)
- Create: `src/pages/EventDetailPage.tsx` (stub)
- Create: `src/pages/LoginPage.tsx` (stub)
- Create: `src/pages/RegisterPage.tsx` (stub)
- Create: `src/pages/DashboardPage.tsx` (stub)
- Create: `src/pages/CreateEventPage.tsx` (stub)
- Create: `src/pages/EditEventPage.tsx` (stub)
- Create: `src/pages/EventGiftsPage.tsx` (stub)
- Create: `src/pages/EventGuestsPage.tsx` (stub)
- Create: `src/pages/EventOrdersPage.tsx` (stub)
- Create: `src/router.tsx`
- Modify: `src/App.tsx`
- Create: `src/App.test.tsx` (replaces Task 1's version)

**Interfaces:**
- Consumes: `MockAuthProvider`, `RouteGuard` (Task 5)
- Produces: full route tree others tasks fill in. Each page stub below is fully replaced (not appended to) by its dedicated task; the router import paths and route paths defined here are final and must not change later.

- [ ] **Step 1: Create `src/components/layout/NavBar.tsx`**

```tsx
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";

export function NavBar() {
  const { currentUser, onLogout } = useAuth();

  return (
    <nav className="flex items-center justify-between border-b border-slate-200 px-6 py-3">
      <Link to="/" className="text-lg font-semibold text-slate-900">
        Event Manager
      </Link>
      <div className="flex items-center gap-4">
        {currentUser ? (
          <>
            <Link to="/dashboard" className="text-sm text-slate-700 hover:underline">
              Dashboard
            </Link>
            <Button variant="secondary" onClick={onLogout}>
              Log out
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-slate-700 hover:underline">
              Log in
            </Link>
            <Link to="/register" className="text-sm text-slate-700 hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create `src/components/layout/AppShell.tsx`**

```tsx
import { Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";

export function AppShell() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main className="mx-auto max-w-4xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Create every page stub, e.g. `src/pages/BrowseEventsPage.tsx`**

```tsx
export function BrowseEventsPage() {
  return <p>Browse events — coming in Task 8.</p>;
}
```

Repeat the same one-line-stub pattern for the remaining 9 files, each exporting a named function matching its filename and a distinct placeholder sentence naming the task that replaces it:

- `src/pages/EventDetailPage.tsx` → `export function EventDetailPage() { return <p>Event detail — coming in Task 9.</p>; }`
- `src/pages/LoginPage.tsx` → `export function LoginPage() { return <p>Login — coming in Task 12.</p>; }`
- `src/pages/RegisterPage.tsx` → `export function RegisterPage() { return <p>Register — coming in Task 13.</p>; }`
- `src/pages/DashboardPage.tsx` → `export function DashboardPage() { return <p>Dashboard — coming in Task 14.</p>; }`
- `src/pages/CreateEventPage.tsx` → `export function CreateEventPage() { return <p>Create event — coming in Task 15.</p>; }`
- `src/pages/EditEventPage.tsx` → `export function EditEventPage() { return <p>Edit event — coming in Task 15.</p>; }`
- `src/pages/EventGiftsPage.tsx` → `export function EventGiftsPage() { return <p>Event gifts — coming in Task 16.</p>; }`
- `src/pages/EventGuestsPage.tsx` → `export function EventGuestsPage() { return <p>Event guests — coming in Task 17.</p>; }`
- `src/pages/EventOrdersPage.tsx` → `export function EventOrdersPage() { return <p>Event orders — coming in Task 18.</p>; }`

- [ ] **Step 4: Create `src/router.tsx`**

```tsx
import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { RouteGuard } from "./components/layout/RouteGuard";
import { BrowseEventsPage } from "./pages/BrowseEventsPage";
import { EventDetailPage } from "./pages/EventDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CreateEventPage } from "./pages/CreateEventPage";
import { EditEventPage } from "./pages/EditEventPage";
import { EventGiftsPage } from "./pages/EventGiftsPage";
import { EventGuestsPage } from "./pages/EventGuestsPage";
import { EventOrdersPage } from "./pages/EventOrdersPage";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <BrowseEventsPage /> },
      { path: "/events/:slug", element: <EventDetailPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        path: "/dashboard",
        element: (
          <RouteGuard>
            <DashboardPage />
          </RouteGuard>
        ),
      },
      {
        path: "/dashboard/events/new",
        element: (
          <RouteGuard>
            <CreateEventPage />
          </RouteGuard>
        ),
      },
      {
        path: "/dashboard/events/:id/edit",
        element: (
          <RouteGuard>
            <EditEventPage />
          </RouteGuard>
        ),
      },
      {
        path: "/dashboard/events/:id/gifts",
        element: (
          <RouteGuard>
            <EventGiftsPage />
          </RouteGuard>
        ),
      },
      {
        path: "/dashboard/events/:id/guests",
        element: (
          <RouteGuard>
            <EventGuestsPage />
          </RouteGuard>
        ),
      },
      {
        path: "/dashboard/events/:id/orders",
        element: (
          <RouteGuard>
            <EventOrdersPage />
          </RouteGuard>
        ),
      },
    ],
  },
]);
```

- [ ] **Step 5: Replace `src/App.tsx`**

```tsx
import { RouterProvider } from "react-router-dom";
import { MockAuthProvider } from "./context/AuthContext";
import { router } from "./router";

export default function App() {
  return (
    <MockAuthProvider>
      <RouterProvider router={router} />
    </MockAuthProvider>
  );
}
```

- [ ] **Step 6: Replace `src/App.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the browse-events page at the root route", () => {
    render(<App />);
    expect(screen.getByText(/Browse events/i)).toBeInTheDocument();
  });

  it("renders the nav bar with login/register links when logged out", () => {
    render(<App />);
    expect(screen.getByRole("link", { name: "Log in" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Register" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 7: Run the tests**

Run: `npm test`
Expected: all pass.

- [ ] **Step 8: Commit**

```bash
git add src/router.tsx src/App.tsx src/App.test.tsx src/components/layout src/pages
git commit -m "Add router, app shell, nav bar, and page stubs for every route"
```

---

## Task 7: Event browse list (filter bar, card, list with use()/Suspense)

**Files:**
- Create: `src/components/events/EventFilterBar.tsx`
- Create: `src/components/events/EventCard.tsx`
- Create: `src/components/events/EventList.tsx`
- Create: `src/components/events/EventFilterBar.test.tsx`
- Create: `src/components/events/EventCard.test.tsx`
- Create: `src/components/events/EventList.test.tsx`

**Interfaces:**
- Consumes: `EventFilterBarProps`, `EventCardProps`, `EventListProps` (Task 3); `Button`, `TextField`, `Spinner`, `EmptyState` (Task 4)
- Produces: `EventFilterBar`, `EventCard`, `EventList` — consumed by `BrowseEventsPage` (Task 8) and `DashboardPage` (Task 14).

- [ ] **Step 1: Write the failing test — `src/components/events/EventFilterBar.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EventFilterBar } from "./EventFilterBar";

describe("EventFilterBar", () => {
  it("calls onChange as the user types", async () => {
    const onChange = vi.fn();
    render(<EventFilterBar value="" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText(/filter by name/i), "bbq");
    expect(onChange).toHaveBeenCalledWith("b");
    expect(onChange).toHaveBeenCalledWith("bbq");
  });
});
```

- [ ] **Step 2: Create `src/components/events/EventFilterBar.tsx`**

```tsx
import { TextField } from "../ui/TextField";
import type { EventFilterBarProps } from "../../types/contracts";

export function EventFilterBar({ value, onChange }: EventFilterBarProps) {
  return (
    <TextField
      label="Filter by name"
      name="event-filter"
      value={value}
      placeholder="Search events…"
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
```

- [ ] **Step 3: Run test to verify it passes**

Run: `npm test -- EventFilterBar`
Expected: PASS.

- [ ] **Step 4: Write the failing test — `src/components/events/EventCard.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { EventCard } from "./EventCard";

describe("EventCard", () => {
  it("renders the event name, date, and a link to its href", () => {
    render(
      <MemoryRouter>
        <EventCard
          event={{ id: 1, slug: "summer-bbq", name: "Summer BBQ Party", date: "2026-07-20" }}
          href="/events/summer-bbq"
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Summer BBQ Party")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/events/summer-bbq");
  });
});
```

- [ ] **Step 5: Create `src/components/events/EventCard.tsx`**

```tsx
import { Link } from "react-router-dom";
import type { EventCardProps } from "../../types/contracts";

export function EventCard({ event, href }: EventCardProps) {
  return (
    <Link
      to={href}
      className="block rounded-md border border-slate-200 p-4 hover:border-indigo-400 hover:shadow-sm"
    >
      <p className="font-medium text-slate-900">{event.name}</p>
      <p className="text-sm text-slate-500">{event.date}</p>
    </Link>
  );
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- EventCard`
Expected: PASS.

- [ ] **Step 7: Write the failing test — `src/components/events/EventList.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { EventList } from "./EventList";
import type { EventSummary } from "../../types/domain";

const events: EventSummary[] = [
  { id: 1, slug: "ana-e-joao", name: "Ana & João's Wedding", date: "2026-11-14" },
  { id: 2, slug: "summer-bbq", name: "Summer BBQ Party", date: "2026-07-20" },
];

describe("EventList", () => {
  it("renders every event when the filter query is empty", async () => {
    render(
      <MemoryRouter>
        <EventList eventsPromise={Promise.resolve(events)} filterQuery="" />
      </MemoryRouter>,
    );
    expect(await screen.findByText("Ana & João's Wedding")).toBeInTheDocument();
    expect(screen.getByText("Summer BBQ Party")).toBeInTheDocument();
  });

  it("filters events by name, case-insensitively", async () => {
    render(
      <MemoryRouter>
        <EventList eventsPromise={Promise.resolve(events)} filterQuery="bbq" />
      </MemoryRouter>,
    );
    expect(await screen.findByText("Summer BBQ Party")).toBeInTheDocument();
    expect(screen.queryByText("Ana & João's Wedding")).not.toBeInTheDocument();
  });

  it("shows an empty state when nothing matches", async () => {
    render(
      <MemoryRouter>
        <EventList eventsPromise={Promise.resolve(events)} filterQuery="zzz" />
      </MemoryRouter>,
    );
    expect(await screen.findByText(/no events match/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 8: Create `src/components/events/EventList.tsx`**

```tsx
import { Suspense, use } from "react";
import { EventCard } from "./EventCard";
import { EmptyState } from "../ui/EmptyState";
import { Spinner } from "../ui/Spinner";
import type { EventListProps } from "../../types/contracts";

function EventListContent({ eventsPromise, filterQuery }: EventListProps) {
  const events = use(eventsPromise);
  const filtered = events.filter((event) =>
    event.name.toLowerCase().includes(filterQuery.toLowerCase()),
  );

  if (filtered.length === 0) {
    return <EmptyState message="No events match your search." />;
  }

  return (
    <div className="grid gap-3">
      {filtered.map((event) => (
        <EventCard key={event.id} event={event} href={`/events/${event.slug}`} />
      ))}
    </div>
  );
}

export function EventList(props: EventListProps) {
  return (
    <Suspense fallback={<Spinner label="Loading events…" />}>
      <EventListContent {...props} />
    </Suspense>
  );
}
```

- [ ] **Step 9: Run test to verify it passes**

Run: `npm test -- EventList`
Expected: PASS (3 tests).

- [ ] **Step 10: Commit**

```bash
git add src/components/events
git commit -m "Add EventFilterBar, EventCard, and EventList (use()+Suspense)"
```

---

## Task 8: Browse events page

**Files:**
- Modify: `src/pages/BrowseEventsPage.tsx`
- Create: `src/pages/BrowseEventsPage.test.tsx`

**Interfaces:**
- Consumes: `EventFilterBar`, `EventList` (Task 7); `fetchMockEvents` (Task 3)
- Produces: the final `/` page. No later task depends on this one beyond the router wiring already in place.

- [ ] **Step 1: Write the failing test — `src/pages/BrowseEventsPage.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { BrowseEventsPage } from "./BrowseEventsPage";

describe("BrowseEventsPage", () => {
  it("lists mock events and filters them by typing", async () => {
    render(
      <MemoryRouter>
        <BrowseEventsPage />
      </MemoryRouter>,
    );
    expect(await screen.findByText("Summer BBQ Party")).toBeInTheDocument();
    expect(screen.getByText("Ana & João's Wedding")).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/filter by name/i), "bbq");

    expect(screen.queryByText("Ana & João's Wedding")).not.toBeInTheDocument();
    expect(screen.getByText("Summer BBQ Party")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- BrowseEventsPage`
Expected: FAIL — current stub has no filter input.

- [ ] **Step 3: Replace `src/pages/BrowseEventsPage.tsx`**

```tsx
import { useMemo, useState } from "react";
import { EventFilterBar } from "../components/events/EventFilterBar";
import { EventList } from "../components/events/EventList";
import { fetchMockEvents } from "../mocks/events";

export function BrowseEventsPage() {
  const [filterQuery, setFilterQuery] = useState("");
  const eventsPromise = useMemo(() => fetchMockEvents(), []);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-900">Browse events</h1>
      <EventFilterBar value={filterQuery} onChange={setFilterQuery} />
      <EventList eventsPromise={eventsPromise} filterQuery={filterQuery} />
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- BrowseEventsPage`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/BrowseEventsPage.tsx src/pages/BrowseEventsPage.test.tsx
git commit -m "Implement BrowseEventsPage with live filtering over mock events"
```

---

## Task 9: Event detail + read-only gift list

**Files:**
- Create: `src/components/events/EventDetail.tsx`
- Create: `src/components/gifts/GiftList.tsx`
- Modify: `src/pages/EventDetailPage.tsx`
- Create: `src/components/events/EventDetail.test.tsx`
- Create: `src/components/gifts/GiftList.test.tsx`
- Create: `src/pages/EventDetailPage.test.tsx`

**Interfaces:**
- Consumes: `EventDetailProps`, `GiftListProps` (Task 3); `fetchMockEventDetails`, `fetchMockGifts` (Task 3)
- Produces: `EventDetail`, `GiftList` (with its optional `renderAction` slot) — `GiftList` is reused unmodified by `EventGiftsPage` (Task 16); `renderAction` is filled in by `Task 11` (guest claim button) and left `undefined` in `Task 16` (owner view, read-only).

- [ ] **Step 1: Write the failing test — `src/components/events/EventDetail.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EventDetail } from "./EventDetail";
import type { EventDetails } from "../../types/domain";

const details: EventDetails = {
  id: 1,
  slug: "summer-bbq",
  name: "Summer BBQ Party",
  date: "2026-07-20",
  giftCount: 1,
  guestCount: 0,
};

describe("EventDetail", () => {
  it("renders the event's name, date, gift count, and guest count", async () => {
    render(<EventDetail eventPromise={Promise.resolve(details)} />);
    expect(await screen.findByText("Summer BBQ Party")).toBeInTheDocument();
    expect(screen.getByText("2026-07-20")).toBeInTheDocument();
    expect(screen.getByText(/1 gift/i)).toBeInTheDocument();
    expect(screen.getByText(/0 guests/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Create `src/components/events/EventDetail.tsx`**

```tsx
import { Suspense, use } from "react";
import { Spinner } from "../ui/Spinner";
import type { EventDetailProps } from "../../types/contracts";

function EventDetailContent({ eventPromise }: EventDetailProps) {
  const event = use(eventPromise);

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold text-slate-900">{event.name}</h1>
      <p className="text-slate-500">{event.date}</p>
      <p className="text-sm text-slate-500">
        {event.giftCount} gift{event.giftCount === 1 ? "" : "s"} · {event.guestCount} guest
        {event.guestCount === 1 ? "" : "s"}
      </p>
    </div>
  );
}

export function EventDetail(props: EventDetailProps) {
  return (
    <Suspense fallback={<Spinner label="Loading event…" />}>
      <EventDetailContent {...props} />
    </Suspense>
  );
}
```

- [ ] **Step 3: Run test to verify it passes**

Run: `npm test -- EventDetail`
Expected: PASS.

- [ ] **Step 4: Write the failing test — `src/components/gifts/GiftList.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GiftList } from "./GiftList";
import type { Gift } from "../../types/domain";

const gifts: Gift[] = [
  { id: 1, eventId: 1, name: "Blender", price: 250, claimed: false },
  { id: 2, eventId: 1, name: "Bed Sheets", price: 180, claimed: true },
];

describe("GiftList", () => {
  it("renders each gift's name, price, and claimed status", async () => {
    render(<GiftList giftsPromise={Promise.resolve(gifts)} />);
    expect(await screen.findByText("Blender")).toBeInTheDocument();
    expect(screen.getByText("Bed Sheets")).toBeInTheDocument();
    expect(screen.getByText(/claimed/i)).toBeInTheDocument();
  });

  it("renders a per-gift action when renderAction is provided", async () => {
    render(
      <GiftList
        giftsPromise={Promise.resolve(gifts)}
        renderAction={(gift) => <button>Claim {gift.name}</button>}
      />,
    );
    expect(await screen.findByRole("button", { name: "Claim Blender" })).toBeInTheDocument();
  });

  it("shows an empty state when there are no gifts", async () => {
    render(<GiftList giftsPromise={Promise.resolve([])} />);
    expect(await screen.findByText(/no gifts/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Create `src/components/gifts/GiftList.tsx`**

```tsx
import { Suspense, use } from "react";
import { EmptyState } from "../ui/EmptyState";
import { Spinner } from "../ui/Spinner";
import type { GiftListProps } from "../../types/contracts";

function GiftListContent({ giftsPromise, renderAction }: GiftListProps) {
  const gifts = use(giftsPromise);

  if (gifts.length === 0) {
    return <EmptyState message="No gifts registered yet." />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {gifts.map((gift) => (
        <li
          key={gift.id}
          className="flex items-center justify-between rounded-md border border-slate-200 p-3"
        >
          <div>
            <p className="font-medium text-slate-900">{gift.name}</p>
            {gift.price != null ? <p className="text-sm text-slate-500">${gift.price}</p> : null}
            {gift.claimed ? <p className="text-sm text-indigo-600">Claimed</p> : null}
          </div>
          {renderAction ? renderAction(gift) : null}
        </li>
      ))}
    </ul>
  );
}

export function GiftList(props: GiftListProps) {
  return (
    <Suspense fallback={<Spinner label="Loading gifts…" />}>
      <GiftListContent {...props} />
    </Suspense>
  );
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- GiftList`
Expected: PASS (3 tests).

- [ ] **Step 7: Write the failing test — `src/pages/EventDetailPage.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { EventDetailPage } from "./EventDetailPage";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/events/:slug" element={<EventDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("EventDetailPage", () => {
  it("renders the event's details and gift list for a known slug", async () => {
    renderAt("/events/summer-bbq");
    expect(await screen.findByText("Summer BBQ Party")).toBeInTheDocument();
    expect(await screen.findByText("Cooler Box")).toBeInTheDocument();
  });
});
```

- [ ] **Step 8: Replace `src/pages/EventDetailPage.tsx`**

```tsx
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { EventDetail } from "../components/events/EventDetail";
import { GiftList } from "../components/gifts/GiftList";
import { fetchMockEventDetails } from "../mocks/events";
import { fetchMockGifts } from "../mocks/gifts";
import { mockEvents } from "../mocks/events";

export function EventDetailPage() {
  const { slug = "" } = useParams();
  const eventPromise = useMemo(() => fetchMockEventDetails(slug), [slug]);
  const eventId = mockEvents.find((e) => e.slug === slug)?.id ?? 0;
  const giftsPromise = useMemo(() => fetchMockGifts(eventId), [eventId]);

  return (
    <div className="flex flex-col gap-6">
      <EventDetail eventPromise={eventPromise} />
      <div>
        <h2 className="mb-2 text-lg font-semibold text-slate-900">Gifts</h2>
        <GiftList giftsPromise={giftsPromise} />
      </div>
    </div>
  );
}
```

- [ ] **Step 9: Run test to verify it passes**

Run: `npm test -- EventDetailPage`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add src/components/events/EventDetail.tsx src/components/events/EventDetail.test.tsx src/components/gifts src/pages/EventDetailPage.tsx src/pages/EventDetailPage.test.tsx
git commit -m "Implement EventDetail, GiftList, and EventDetailPage"
```

---

## Task 10: RSVP form on the event detail page

**Files:**
- Create: `src/components/guests/RsvpForm.tsx`
- Create: `src/components/guests/RsvpForm.test.tsx`
- Modify: `src/pages/EventDetailPage.tsx`
- Modify: `src/pages/EventDetailPage.test.tsx`

**Interfaces:**
- Consumes: `RsvpFormProps` (Task 3); `Button`, `TextField`, `ErrorBanner` (Task 4)
- Produces: `RsvpForm`, wired into `EventDetailPage`. No later task depends on this.

- [ ] **Step 1: Write the failing test — `src/components/guests/RsvpForm.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RsvpForm } from "./RsvpForm";

describe("RsvpForm", () => {
  it("submits the entered name and email", async () => {
    const onRsvp = vi.fn().mockResolvedValue({ ok: true });
    render(<RsvpForm onRsvp={onRsvp} />);

    await userEvent.type(screen.getByLabelText("Your name"), "Carla Souza");
    await userEvent.type(screen.getByLabelText("Your email"), "carla@example.com");
    await userEvent.click(screen.getByRole("button", { name: /confirm/i }));

    expect(onRsvp).toHaveBeenCalledWith({ guestName: "Carla Souza", guestEmail: "carla@example.com" });
    expect(await screen.findByText(/you're confirmed/i)).toBeInTheDocument();
  });

  it("shows an error message when the submission fails", async () => {
    const onRsvp = vi.fn().mockResolvedValue({ ok: false, error: "Already confirmed" });
    render(<RsvpForm onRsvp={onRsvp} />);

    await userEvent.type(screen.getByLabelText("Your name"), "Carla Souza");
    await userEvent.type(screen.getByLabelText("Your email"), "carla@example.com");
    await userEvent.click(screen.getByRole("button", { name: /confirm/i }));

    expect(await screen.findByText("Already confirmed")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Create `src/components/guests/RsvpForm.tsx`**

```tsx
import { useActionState } from "react";
import { Button } from "../ui/Button";
import { TextField } from "../ui/TextField";
import { ErrorBanner } from "../ui/ErrorBanner";
import type { RsvpFormProps } from "../../types/contracts";

type RsvpState = { status: "idle" | "success" | "error"; message?: string };

export function RsvpForm({ onRsvp }: RsvpFormProps) {
  const [state, formAction, isPending] = useActionState<RsvpState, FormData>(
    async (_previous, formData) => {
      const guestName = String(formData.get("guestName") ?? "");
      const guestEmail = String(formData.get("guestEmail") ?? "");
      const result = await onRsvp({ guestName, guestEmail });
      return result.ok ? { status: "success" } : { status: "error", message: result.error };
    },
    { status: "idle" },
  );

  if (state.status === "success") {
    return <p className="text-indigo-600">You're confirmed! See you there.</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <TextField label="Your name" name="guestName" required />
      <TextField label="Your email" name="guestEmail" type="email" required />
      {state.status === "error" ? <ErrorBanner message={state.message ?? "Something went wrong"} /> : null}
      <Button type="submit" isLoading={isPending}>
        Confirm attendance
      </Button>
    </form>
  );
}
```

- [ ] **Step 3: Run test to verify it passes**

Run: `npm test -- RsvpForm`
Expected: PASS (2 tests).

- [ ] **Step 4: Modify `src/pages/EventDetailPage.tsx`** — add the RSVP section

```tsx
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { EventDetail } from "../components/events/EventDetail";
import { GiftList } from "../components/gifts/GiftList";
import { RsvpForm } from "../components/guests/RsvpForm";
import { fetchMockEventDetails, mockEvents } from "../mocks/events";
import { fetchMockGifts } from "../mocks/gifts";
import type { SubmitResult } from "../types/domain";

export function EventDetailPage() {
  const { slug = "" } = useParams();
  const eventPromise = useMemo(() => fetchMockEventDetails(slug), [slug]);
  const eventId = mockEvents.find((e) => e.slug === slug)?.id ?? 0;
  const giftsPromise = useMemo(() => fetchMockGifts(eventId), [eventId]);

  async function handleRsvp(): Promise<SubmitResult> {
    return { ok: true };
  }

  return (
    <div className="flex flex-col gap-6">
      <EventDetail eventPromise={eventPromise} />
      <div>
        <h2 className="mb-2 text-lg font-semibold text-slate-900">RSVP</h2>
        <RsvpForm onRsvp={handleRsvp} />
      </div>
      <div>
        <h2 className="mb-2 text-lg font-semibold text-slate-900">Gifts</h2>
        <GiftList giftsPromise={giftsPromise} />
      </div>
    </div>
  );
}
```

Note: `handleRsvp` here is a local, always-succeeds stand-in so the page is demoable — it is not integration code (no network/token access), and it is explicitly replaced wholesale when integration wires the real `onRsvp` callback per `RsvpFormProps`.

- [ ] **Step 5: Modify `src/pages/EventDetailPage.test.tsx`** — add an RSVP assertion

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { EventDetailPage } from "./EventDetailPage";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/events/:slug" element={<EventDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("EventDetailPage", () => {
  it("renders the event's details and gift list for a known slug", async () => {
    renderAt("/events/summer-bbq");
    expect(await screen.findByText("Summer BBQ Party")).toBeInTheDocument();
    expect(await screen.findByText("Cooler Box")).toBeInTheDocument();
  });

  it("lets a guest RSVP", async () => {
    renderAt("/events/summer-bbq");
    await screen.findByText("Summer BBQ Party");

    await userEvent.type(screen.getByLabelText("Your name"), "Carla Souza");
    await userEvent.type(screen.getByLabelText("Your email"), "carla@example.com");
    await userEvent.click(screen.getByRole("button", { name: /confirm/i }));

    expect(await screen.findByText(/you're confirmed/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- EventDetailPage`
Expected: PASS (2 tests).

- [ ] **Step 7: Commit**

```bash
git add src/components/guests/RsvpForm.tsx src/components/guests/RsvpForm.test.tsx src/pages/EventDetailPage.tsx src/pages/EventDetailPage.test.tsx
git commit -m "Add RsvpForm and wire it into EventDetailPage"
```

---

## Task 11: Gift claim form on the event detail page

**Files:**
- Create: `src/components/gifts/GiftClaimForm.tsx`
- Create: `src/components/gifts/GiftClaimForm.test.tsx`
- Modify: `src/pages/EventDetailPage.tsx`
- Modify: `src/pages/EventDetailPage.test.tsx`

**Interfaces:**
- Consumes: `GiftClaimFormProps` (Task 3); `Button`, `TextField`, `ErrorBanner` (Task 4); `GiftList`'s `renderAction` slot (Task 9)
- Produces: `GiftClaimForm`, wired per-gift into `EventDetailPage` via `GiftList`'s `renderAction`.

- [ ] **Step 1: Write the failing test — `src/components/gifts/GiftClaimForm.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GiftClaimForm } from "./GiftClaimForm";
import type { Gift } from "../../types/domain";

const gift: Gift = { id: 1, eventId: 1, name: "Blender", price: 250, claimed: false };

describe("GiftClaimForm", () => {
  it("opens a form and submits claim details", async () => {
    const onClaim = vi.fn().mockResolvedValue({ ok: true });
    render(<GiftClaimForm gift={gift} onClaim={onClaim} />);

    await userEvent.click(screen.getByRole("button", { name: /claim this gift/i }));
    await userEvent.type(screen.getByLabelText("Your name"), "Bruno Lima");
    await userEvent.type(screen.getByLabelText("Your email"), "bruno@example.com");
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(onClaim).toHaveBeenCalledWith({
      guestName: "Bruno Lima",
      guestEmail: "bruno@example.com",
      message: "",
    });
    expect(await screen.findByText(/thanks for claiming/i)).toBeInTheDocument();
  });

  it("shows an error when the claim fails", async () => {
    const onClaim = vi.fn().mockResolvedValue({ ok: false, error: "Already claimed" });
    render(<GiftClaimForm gift={gift} onClaim={onClaim} />);

    await userEvent.click(screen.getByRole("button", { name: /claim this gift/i }));
    await userEvent.type(screen.getByLabelText("Your name"), "Bruno Lima");
    await userEvent.type(screen.getByLabelText("Your email"), "bruno@example.com");
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText("Already claimed")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Create `src/components/gifts/GiftClaimForm.tsx`**

```tsx
import { useActionState, useState } from "react";
import { Button } from "../ui/Button";
import { TextField } from "../ui/TextField";
import { ErrorBanner } from "../ui/ErrorBanner";
import type { GiftClaimFormProps } from "../../types/contracts";

type ClaimState = { status: "idle" | "success" | "error"; message?: string };

export function GiftClaimForm({ gift, onClaim }: GiftClaimFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<ClaimState, FormData>(
    async (_previous, formData) => {
      const guestName = String(formData.get("guestName") ?? "");
      const guestEmail = String(formData.get("guestEmail") ?? "");
      const message = String(formData.get("message") ?? "");
      const result = await onClaim({ guestName, guestEmail, message });
      return result.ok ? { status: "success" } : { status: "error", message: result.error };
    },
    { status: "idle" },
  );

  if (state.status === "success") {
    return <p className="text-indigo-600">Thanks for claiming {gift.name}!</p>;
  }

  if (!isOpen) {
    return <Button variant="secondary" onClick={() => setIsOpen(true)}>Claim this gift</Button>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-2 rounded-md border border-slate-200 p-3">
      <TextField label="Your name" name="guestName" required />
      <TextField label="Your email" name="guestEmail" type="email" required />
      <TextField label="Message (optional)" name="message" />
      {state.status === "error" ? <ErrorBanner message={state.message ?? "Something went wrong"} /> : null}
      <Button type="submit" isLoading={isPending}>
        Submit claim
      </Button>
    </form>
  );
}
```

- [ ] **Step 3: Run test to verify it passes**

Run: `npm test -- GiftClaimForm`
Expected: PASS (2 tests).

- [ ] **Step 4: Modify `src/pages/EventDetailPage.tsx`** — pass a `renderAction` to `GiftList`

```tsx
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { EventDetail } from "../components/events/EventDetail";
import { GiftList } from "../components/gifts/GiftList";
import { GiftClaimForm } from "../components/gifts/GiftClaimForm";
import { RsvpForm } from "../components/guests/RsvpForm";
import { fetchMockEventDetails, mockEvents } from "../mocks/events";
import { fetchMockGifts } from "../mocks/gifts";
import type { SubmitResult } from "../types/domain";

export function EventDetailPage() {
  const { slug = "" } = useParams();
  const eventPromise = useMemo(() => fetchMockEventDetails(slug), [slug]);
  const eventId = mockEvents.find((e) => e.slug === slug)?.id ?? 0;
  const giftsPromise = useMemo(() => fetchMockGifts(eventId), [eventId]);

  async function handleRsvp(): Promise<SubmitResult> {
    return { ok: true };
  }

  async function handleClaim(): Promise<SubmitResult> {
    return { ok: true };
  }

  return (
    <div className="flex flex-col gap-6">
      <EventDetail eventPromise={eventPromise} />
      <div>
        <h2 className="mb-2 text-lg font-semibold text-slate-900">RSVP</h2>
        <RsvpForm onRsvp={handleRsvp} />
      </div>
      <div>
        <h2 className="mb-2 text-lg font-semibold text-slate-900">Gifts</h2>
        <GiftList
          giftsPromise={giftsPromise}
          renderAction={(gift) =>
            gift.claimed ? null : <GiftClaimForm gift={gift} onClaim={handleClaim} />
          }
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Modify `src/pages/EventDetailPage.test.tsx`** — add a claim assertion

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { EventDetailPage } from "./EventDetailPage";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/events/:slug" element={<EventDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("EventDetailPage", () => {
  it("renders the event's details and gift list for a known slug", async () => {
    renderAt("/events/summer-bbq");
    expect(await screen.findByText("Summer BBQ Party")).toBeInTheDocument();
    expect(await screen.findByText("Cooler Box")).toBeInTheDocument();
  });

  it("lets a guest RSVP", async () => {
    renderAt("/events/summer-bbq");
    await screen.findByText("Summer BBQ Party");

    await userEvent.type(screen.getByLabelText("Your name"), "Carla Souza");
    await userEvent.type(screen.getByLabelText("Your email"), "carla@example.com");
    await userEvent.click(screen.getByRole("button", { name: /confirm/i }));

    expect(await screen.findByText(/you're confirmed/i)).toBeInTheDocument();
  });

  it("lets a guest claim an unclaimed gift", async () => {
    renderAt("/events/summer-bbq");
    await screen.findByText("Cooler Box");

    await userEvent.click(screen.getByRole("button", { name: /claim this gift/i }));
    await userEvent.type(screen.getByLabelText("Your name"), "Bruno Lima");
    await userEvent.type(screen.getByLabelText("Your email"), "bruno@example.com");
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText(/thanks for claiming/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- EventDetailPage`
Expected: PASS (3 tests).

- [ ] **Step 7: Commit**

```bash
git add src/components/gifts/GiftClaimForm.tsx src/components/gifts/GiftClaimForm.test.tsx src/pages/EventDetailPage.tsx src/pages/EventDetailPage.test.tsx
git commit -m "Add GiftClaimForm and wire per-gift claim actions into EventDetailPage"
```

---

## Task 12: Login form and page

**Files:**
- Create: `src/components/auth/LoginForm.tsx`
- Create: `src/components/auth/LoginForm.test.tsx`
- Modify: `src/pages/LoginPage.tsx`
- Create: `src/pages/LoginPage.test.tsx`

**Interfaces:**
- Consumes: `LoginFormProps` (Task 3); `Button`, `TextField`, `ErrorBanner` (Task 4)
- Produces: `LoginForm`, final `/login` page. No later task depends on this.

- [ ] **Step 1: Write the failing test — `src/components/auth/LoginForm.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  it("submits email and password", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: true, token: "t", expiresAt: "2026-12-01" });
    render(<LoginForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Email"), "ana@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "secret123");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(onSubmit).toHaveBeenCalledWith("ana@example.com", "secret123");
  });

  it("shows an error message on failure", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: false, error: "wrong password" });
    render(<LoginForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Email"), "ana@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "wrong");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText("wrong password")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Create `src/components/auth/LoginForm.tsx`**

```tsx
import { useActionState } from "react";
import { Button } from "../ui/Button";
import { TextField } from "../ui/TextField";
import { ErrorBanner } from "../ui/ErrorBanner";
import type { LoginFormProps } from "../../types/contracts";

type LoginState = { status: "idle" | "error"; message?: string };

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    async (_previous, formData) => {
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");
      const result = await onSubmit(email, password);
      return result.ok ? { status: "idle" } : { status: "error", message: result.error };
    },
    { status: "idle" },
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <TextField label="Email" name="email" type="email" required />
      <TextField label="Password" name="password" type="password" required />
      {state.status === "error" ? <ErrorBanner message={state.message ?? "Login failed"} /> : null}
      <Button type="submit" isLoading={isPending}>
        Log in
      </Button>
    </form>
  );
}
```

- [ ] **Step 3: Run test to verify it passes**

Run: `npm test -- LoginForm`
Expected: PASS (2 tests).

- [ ] **Step 4: Write the failing test — `src/pages/LoginPage.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoginPage } from "./LoginPage";

describe("LoginPage", () => {
  it("renders the login form", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Replace `src/pages/LoginPage.tsx`**

```tsx
import { LoginForm } from "../components/auth/LoginForm";
import type { LoginOutcome } from "../types/domain";

export function LoginPage() {
  async function handleLogin(): Promise<LoginOutcome> {
    return { ok: true, token: "demo-token", expiresAt: new Date().toISOString() };
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-900">Log in</h1>
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}
```

Note: `handleLogin` is a local always-succeeds stand-in for standalone demoing, not integration code — it never touches a network or token store. Integration replaces it wholesale with a real `onSubmit` per `LoginFormProps`.

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- LoginPage`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/auth/LoginForm.tsx src/components/auth/LoginForm.test.tsx src/pages/LoginPage.tsx src/pages/LoginPage.test.tsx
git commit -m "Add LoginForm and implement LoginPage"
```

---

## Task 13: Register form and page

**Files:**
- Create: `src/components/auth/RegisterForm.tsx`
- Create: `src/components/auth/RegisterForm.test.tsx`
- Modify: `src/pages/RegisterPage.tsx`
- Create: `src/pages/RegisterPage.test.tsx`

**Interfaces:**
- Consumes: `RegisterFormProps` (Task 3); `Button`, `TextField`, `ErrorBanner` (Task 4)
- Produces: `RegisterForm`, final `/register` page.

- [ ] **Step 1: Write the failing test — `src/components/auth/RegisterForm.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RegisterForm } from "./RegisterForm";

describe("RegisterForm", () => {
  it("submits name, email, and password", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: true });
    render(<RegisterForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Name"), "Ana Silva");
    await userEvent.type(screen.getByLabelText("Email"), "ana@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "secret123");
    await userEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Ana Silva",
      email: "ana@example.com",
      password: "secret123",
    });
  });

  it("shows an error message on failure", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: false, error: "Email already in use" });
    render(<RegisterForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Name"), "Ana Silva");
    await userEvent.type(screen.getByLabelText("Email"), "ana@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "secret123");
    await userEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(await screen.findByText("Email already in use")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Create `src/components/auth/RegisterForm.tsx`**

```tsx
import { useActionState } from "react";
import { Button } from "../ui/Button";
import { TextField } from "../ui/TextField";
import { ErrorBanner } from "../ui/ErrorBanner";
import type { RegisterFormProps } from "../../types/contracts";

type RegisterState = { status: "idle" | "success" | "error"; message?: string };

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [state, formAction, isPending] = useActionState<RegisterState, FormData>(
    async (_previous, formData) => {
      const name = String(formData.get("name") ?? "");
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");
      const result = await onSubmit({ name, email, password });
      return result.ok ? { status: "success" } : { status: "error", message: result.error };
    },
    { status: "idle" },
  );

  if (state.status === "success") {
    return <p className="text-indigo-600">Account created — you can log in now.</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <TextField label="Name" name="name" required />
      <TextField label="Email" name="email" type="email" required />
      <TextField label="Password" name="password" type="password" required />
      {state.status === "error" ? <ErrorBanner message={state.message ?? "Registration failed"} /> : null}
      <Button type="submit" isLoading={isPending}>
        Register
      </Button>
    </form>
  );
}
```

- [ ] **Step 3: Run test to verify it passes**

Run: `npm test -- RegisterForm`
Expected: PASS (2 tests).

- [ ] **Step 4: Write the failing test — `src/pages/RegisterPage.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RegisterPage } from "./RegisterPage";

describe("RegisterPage", () => {
  it("renders the registration form", () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Replace `src/pages/RegisterPage.tsx`**

```tsx
import { RegisterForm } from "../components/auth/RegisterForm";
import type { SubmitResult } from "../types/domain";

export function RegisterPage() {
  async function handleRegister(): Promise<SubmitResult> {
    return { ok: true };
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-900">Register</h1>
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- RegisterPage`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/auth/RegisterForm.tsx src/components/auth/RegisterForm.test.tsx src/pages/RegisterPage.tsx src/pages/RegisterPage.test.tsx
git commit -m "Add RegisterForm and implement RegisterPage"
```

---

## Task 14: Owner dashboard (reuses EventCard)

**Files:**
- Modify: `src/pages/DashboardPage.tsx`
- Create: `src/pages/DashboardPage.test.tsx`

**Interfaces:**
- Consumes: `EventCard` (Task 7); `MockAuthProvider`, `RouteGuard` (Task 5); `mockEvents` (Task 3)
- Produces: final `/dashboard` page.

- [ ] **Step 1: Write the failing test — `src/pages/DashboardPage.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { DashboardPage } from "./DashboardPage";

describe("DashboardPage", () => {
  it("lists the owner's events with links to manage each one", () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Ana & João's Wedding")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /create event/i })).toHaveAttribute(
      "href",
      "/dashboard/events/new",
    );
  });
});
```

- [ ] **Step 2: Replace `src/pages/DashboardPage.tsx`**

```tsx
import { Link } from "react-router-dom";
import { EventCard } from "../components/events/EventCard";
import { mockEvents } from "../mocks/events";
import { Button } from "../components/ui/Button";

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Your events</h1>
        <Link to="/dashboard/events/new">
          <Button>Create event</Button>
        </Link>
      </div>
      <div className="grid gap-3">
        {mockEvents.map((event) => (
          <EventCard key={event.id} event={event} href={`/dashboard/events/${event.id}/edit`} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Run test to verify it passes**

Run: `npm test -- DashboardPage`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/pages/DashboardPage.tsx src/pages/DashboardPage.test.tsx
git commit -m "Implement DashboardPage listing the owner's events"
```

---

## Task 15: Event form (create/edit) and its two pages

**Files:**
- Create: `src/components/events/EventForm.tsx`
- Create: `src/components/events/EventForm.test.tsx`
- Modify: `src/pages/CreateEventPage.tsx`
- Modify: `src/pages/EditEventPage.tsx`
- Create: `src/pages/CreateEventPage.test.tsx`
- Create: `src/pages/EditEventPage.test.tsx`

**Interfaces:**
- Consumes: `EventFormProps`, `EventFormValues` (Task 3); `Button`, `TextField`, `ErrorBanner` (Task 4)
- Produces: `EventForm`, final `/dashboard/events/new` and `/dashboard/events/:id/edit` pages.

- [ ] **Step 1: Write the failing test — `src/components/events/EventForm.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EventForm } from "./EventForm";

describe("EventForm", () => {
  it("submits name and date for a new event", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: true });
    render(<EventForm onSubmit={onSubmit} submitLabel="Create event" />);

    await userEvent.type(screen.getByLabelText("Event name"), "Summer BBQ Party");
    await userEvent.type(screen.getByLabelText("Event date"), "2026-07-20");
    await userEvent.click(screen.getByRole("button", { name: "Create event" }));

    expect(onSubmit).toHaveBeenCalledWith({ name: "Summer BBQ Party", date: "2026-07-20" });
  });

  it("pre-fills fields from initialValues", () => {
    render(
      <EventForm
        initialValues={{ name: "Ana & João's Wedding", date: "2026-11-14" }}
        onSubmit={vi.fn()}
        submitLabel="Save changes"
      />,
    );
    expect(screen.getByLabelText("Event name")).toHaveValue("Ana & João's Wedding");
    expect(screen.getByLabelText("Event date")).toHaveValue("2026-11-14");
  });

  it("shows an error message on failure", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: false, error: "Name is taken" });
    render(<EventForm onSubmit={onSubmit} submitLabel="Create event" />);

    await userEvent.type(screen.getByLabelText("Event name"), "Dup");
    await userEvent.type(screen.getByLabelText("Event date"), "2026-07-20");
    await userEvent.click(screen.getByRole("button", { name: "Create event" }));

    expect(await screen.findByText("Name is taken")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Create `src/components/events/EventForm.tsx`**

```tsx
import { useActionState } from "react";
import { Button } from "../ui/Button";
import { TextField } from "../ui/TextField";
import { ErrorBanner } from "../ui/ErrorBanner";
import type { EventFormProps } from "../../types/contracts";

type FormState = { status: "idle" | "error"; message?: string };

export function EventForm({ initialValues, onSubmit, submitLabel }: EventFormProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_previous, formData) => {
      const name = String(formData.get("name") ?? "");
      const date = String(formData.get("date") ?? "");
      const result = await onSubmit({ name, date });
      return result.ok ? { status: "idle" } : { status: "error", message: result.error };
    },
    { status: "idle" },
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <TextField label="Event name" name="name" defaultValue={initialValues?.name} required />
      <TextField
        label="Event date"
        name="date"
        type="date"
        defaultValue={initialValues?.date}
        required
      />
      {state.status === "error" ? <ErrorBanner message={state.message ?? "Save failed"} /> : null}
      <Button type="submit" isLoading={isPending}>
        {submitLabel}
      </Button>
    </form>
  );
}
```

- [ ] **Step 3: Run test to verify it passes**

Run: `npm test -- EventForm`
Expected: PASS (3 tests).

- [ ] **Step 4: Write the failing test — `src/pages/CreateEventPage.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CreateEventPage } from "./CreateEventPage";

describe("CreateEventPage", () => {
  it("renders an empty event form with a create label", () => {
    render(<CreateEventPage />);
    expect(screen.getByLabelText("Event name")).toHaveValue("");
    expect(screen.getByRole("button", { name: "Create event" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Replace `src/pages/CreateEventPage.tsx`**

```tsx
import { EventForm } from "../components/events/EventForm";
import type { SubmitResult } from "../types/domain";

export function CreateEventPage() {
  async function handleCreate(): Promise<SubmitResult> {
    return { ok: true };
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-900">Create event</h1>
      <EventForm onSubmit={handleCreate} submitLabel="Create event" />
    </div>
  );
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- CreateEventPage`
Expected: PASS.

- [ ] **Step 7: Write the failing test — `src/pages/EditEventPage.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { EditEventPage } from "./EditEventPage";

describe("EditEventPage", () => {
  it("pre-fills the form with the event's existing name and date", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard/events/1/edit"]}>
        <Routes>
          <Route path="/dashboard/events/:id/edit" element={<EditEventPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByLabelText("Event name")).toHaveValue("Ana & João's Wedding");
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 8: Replace `src/pages/EditEventPage.tsx`**

```tsx
import { useParams } from "react-router-dom";
import { EventForm } from "../components/events/EventForm";
import { mockEvents } from "../mocks/events";
import type { SubmitResult } from "../types/domain";

export function EditEventPage() {
  const { id } = useParams();
  const event = mockEvents.find((e) => e.id === Number(id));

  async function handleUpdate(): Promise<SubmitResult> {
    return { ok: true };
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-900">Edit event</h1>
      <EventForm
        initialValues={event ? { name: event.name, date: event.date } : undefined}
        onSubmit={handleUpdate}
        submitLabel="Save changes"
      />
    </div>
  );
}
```

- [ ] **Step 9: Run test to verify it passes**

Run: `npm test -- EditEventPage`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add src/components/events/EventForm.tsx src/components/events/EventForm.test.tsx src/pages/CreateEventPage.tsx src/pages/CreateEventPage.test.tsx src/pages/EditEventPage.tsx src/pages/EditEventPage.test.tsx
git commit -m "Add EventForm and implement CreateEventPage and EditEventPage"
```

---

## Task 16: Owner gift management page

**Files:**
- Create: `src/components/gifts/GiftForm.tsx`
- Create: `src/components/gifts/GiftForm.test.tsx`
- Modify: `src/pages/EventGiftsPage.tsx`
- Create: `src/pages/EventGiftsPage.test.tsx`

**Interfaces:**
- Consumes: `GiftFormProps` (Task 3); `GiftList` (Task 9, used here with `renderAction` left `undefined`); `fetchMockGifts` (Task 3)
- Produces: `GiftForm`, final `/dashboard/events/:id/gifts` page.

- [ ] **Step 1: Write the failing test — `src/components/gifts/GiftForm.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GiftForm } from "./GiftForm";

describe("GiftForm", () => {
  it("submits name, description, and price", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: true });
    render(<GiftForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Gift name"), "Blender");
    await userEvent.type(screen.getByLabelText("Description (optional)"), "500W");
    await userEvent.type(screen.getByLabelText("Price (optional)"), "250");
    await userEvent.click(screen.getByRole("button", { name: /add gift/i }));

    expect(onSubmit).toHaveBeenCalledWith({ name: "Blender", description: "500W", price: 250 });
  });
});
```

- [ ] **Step 2: Create `src/components/gifts/GiftForm.tsx`**

```tsx
import { useActionState } from "react";
import { Button } from "../ui/Button";
import { TextField } from "../ui/TextField";
import { ErrorBanner } from "../ui/ErrorBanner";
import type { GiftFormProps } from "../../types/contracts";

type FormState = { status: "idle" | "error"; message?: string };

export function GiftForm({ onSubmit }: GiftFormProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_previous, formData) => {
      const name = String(formData.get("name") ?? "");
      const description = String(formData.get("description") ?? "") || undefined;
      const rawPrice = String(formData.get("price") ?? "");
      const price = rawPrice ? Number(rawPrice) : undefined;
      const result = await onSubmit({ name, description, price });
      return result.ok ? { status: "idle" } : { status: "error", message: result.error };
    },
    { status: "idle" },
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <TextField label="Gift name" name="name" required />
      <TextField label="Description (optional)" name="description" />
      <TextField label="Price (optional)" name="price" type="number" min="0" step="0.01" />
      {state.status === "error" ? <ErrorBanner message={state.message ?? "Could not add gift"} /> : null}
      <Button type="submit" isLoading={isPending}>
        Add gift
      </Button>
    </form>
  );
}
```

- [ ] **Step 3: Run test to verify it passes**

Run: `npm test -- GiftForm`
Expected: PASS.

- [ ] **Step 4: Write the failing test — `src/pages/EventGiftsPage.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { EventGiftsPage } from "./EventGiftsPage";

describe("EventGiftsPage", () => {
  it("lists the event's gifts and a form to add a new one", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard/events/1/gifts"]}>
        <Routes>
          <Route path="/dashboard/events/:id/gifts" element={<EventGiftsPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText("Blender")).toBeInTheDocument();
    expect(screen.getByLabelText("Gift name")).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Replace `src/pages/EventGiftsPage.tsx`**

```tsx
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { GiftList } from "../components/gifts/GiftList";
import { GiftForm } from "../components/gifts/GiftForm";
import { fetchMockGifts } from "../mocks/gifts";
import type { SubmitResult } from "../types/domain";

export function EventGiftsPage() {
  const { id } = useParams();
  const eventId = Number(id);
  const giftsPromise = useMemo(() => fetchMockGifts(eventId), [eventId]);

  async function handleAddGift(): Promise<SubmitResult> {
    return { ok: true };
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">Gifts</h1>
      <GiftList giftsPromise={giftsPromise} />
      <div>
        <h2 className="mb-2 text-lg font-semibold text-slate-900">Add a gift</h2>
        <GiftForm onSubmit={handleAddGift} />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- EventGiftsPage`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/gifts/GiftForm.tsx src/components/gifts/GiftForm.test.tsx src/pages/EventGiftsPage.tsx src/pages/EventGiftsPage.test.tsx
git commit -m "Add GiftForm and implement EventGiftsPage"
```

---

## Task 17: Owner guest list page

**Files:**
- Create: `src/components/guests/GuestList.tsx`
- Create: `src/components/guests/GuestList.test.tsx`
- Modify: `src/pages/EventGuestsPage.tsx`
- Create: `src/pages/EventGuestsPage.test.tsx`

**Interfaces:**
- Consumes: `GuestListProps` (Task 3); `fetchMockGuests` (Task 3)
- Produces: `GuestList`, final `/dashboard/events/:id/guests` page.

- [ ] **Step 1: Write the failing test — `src/components/guests/GuestList.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GuestList } from "./GuestList";
import type { Guest } from "../../types/domain";

const guests: Guest[] = [
  { id: 1, name: "Carla Souza", email: "carla@example.com" },
  { id: 2, name: "Bruno Lima", email: "bruno@example.com" },
];

describe("GuestList", () => {
  it("renders each guest's name and email", async () => {
    render(<GuestList guestsPromise={Promise.resolve(guests)} />);
    expect(await screen.findByText("Carla Souza")).toBeInTheDocument();
    expect(screen.getByText("bruno@example.com")).toBeInTheDocument();
  });

  it("shows an empty state when there are no guests", async () => {
    render(<GuestList guestsPromise={Promise.resolve([])} />);
    expect(await screen.findByText(/no guests/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Create `src/components/guests/GuestList.tsx`**

```tsx
import { Suspense, use } from "react";
import { EmptyState } from "../ui/EmptyState";
import { Spinner } from "../ui/Spinner";
import type { GuestListProps } from "../../types/contracts";

function GuestListContent({ guestsPromise }: GuestListProps) {
  const guests = use(guestsPromise);

  if (guests.length === 0) {
    return <EmptyState message="No guests have RSVP'd yet." />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {guests.map((guest) => (
        <li key={guest.id} className="rounded-md border border-slate-200 p-3">
          <p className="font-medium text-slate-900">{guest.name}</p>
          <p className="text-sm text-slate-500">{guest.email}</p>
        </li>
      ))}
    </ul>
  );
}

export function GuestList(props: GuestListProps) {
  return (
    <Suspense fallback={<Spinner label="Loading guests…" />}>
      <GuestListContent {...props} />
    </Suspense>
  );
}
```

- [ ] **Step 3: Run test to verify it passes**

Run: `npm test -- GuestList`
Expected: PASS (2 tests).

- [ ] **Step 4: Write the failing test — `src/pages/EventGuestsPage.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { EventGuestsPage } from "./EventGuestsPage";

describe("EventGuestsPage", () => {
  it("lists the event's RSVP'd guests", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard/events/1/guests"]}>
        <Routes>
          <Route path="/dashboard/events/:id/guests" element={<EventGuestsPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText("Carla Souza")).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Replace `src/pages/EventGuestsPage.tsx`**

```tsx
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { GuestList } from "../components/guests/GuestList";
import { fetchMockGuests } from "../mocks/guests";

export function EventGuestsPage() {
  const { id } = useParams();
  const eventId = Number(id);
  const guestsPromise = useMemo(() => fetchMockGuests(eventId), [eventId]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-900">Guests</h1>
      <GuestList guestsPromise={guestsPromise} />
    </div>
  );
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- EventGuestsPage`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/guests/GuestList.tsx src/components/guests/GuestList.test.tsx src/pages/EventGuestsPage.tsx src/pages/EventGuestsPage.test.tsx
git commit -m "Add GuestList and implement EventGuestsPage"
```

---

## Task 18: Owner orders page

**Files:**
- Create: `src/components/orders/OrderList.tsx`
- Create: `src/components/orders/OrderList.test.tsx`
- Modify: `src/pages/EventOrdersPage.tsx`
- Create: `src/pages/EventOrdersPage.test.tsx`

**Interfaces:**
- Consumes: `OrderListProps` (Task 3); `fetchMockOrders` (Task 3)
- Produces: `OrderList`, final `/dashboard/events/:id/orders` page. This screen is built against the nonexistent-order-read endpoint documented in `missing-features.md` item 9.

- [ ] **Step 1: Write the failing test — `src/components/orders/OrderList.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OrderList } from "./OrderList";
import type { OrderSummary } from "../../types/domain";

const orders: OrderSummary[] = [
  {
    id: 1,
    giftName: "Bed Sheets",
    guestName: "Carla Souza",
    guestEmail: "carla@example.com",
    status: "PENDING",
  },
];

describe("OrderList", () => {
  it("renders each order's gift, guest, and status", async () => {
    render(<OrderList ordersPromise={Promise.resolve(orders)} />);
    expect(await screen.findByText("Bed Sheets")).toBeInTheDocument();
    expect(screen.getByText("Carla Souza")).toBeInTheDocument();
    expect(screen.getByText("PENDING")).toBeInTheDocument();
  });

  it("shows an empty state when there are no orders", async () => {
    render(<OrderList ordersPromise={Promise.resolve([])} />);
    expect(await screen.findByText(/no gifts claimed/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Create `src/components/orders/OrderList.tsx`**

```tsx
import { Suspense, use } from "react";
import { EmptyState } from "../ui/EmptyState";
import { Spinner } from "../ui/Spinner";
import type { OrderListProps } from "../../types/contracts";

function OrderListContent({ ordersPromise }: OrderListProps) {
  const orders = use(ordersPromise);

  if (orders.length === 0) {
    return <EmptyState message="No gifts claimed yet." />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {orders.map((order) => (
        <li key={order.id} className="rounded-md border border-slate-200 p-3">
          <p className="font-medium text-slate-900">{order.giftName}</p>
          <p className="text-sm text-slate-500">
            {order.guestName} · {order.guestEmail}
          </p>
          <p className="text-sm text-indigo-600">{order.status}</p>
        </li>
      ))}
    </ul>
  );
}

export function OrderList(props: OrderListProps) {
  return (
    <Suspense fallback={<Spinner label="Loading orders…" />}>
      <OrderListContent {...props} />
    </Suspense>
  );
}
```

- [ ] **Step 3: Run test to verify it passes**

Run: `npm test -- OrderList`
Expected: PASS (2 tests).

- [ ] **Step 4: Write the failing test — `src/pages/EventOrdersPage.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { EventOrdersPage } from "./EventOrdersPage";

describe("EventOrdersPage", () => {
  it("lists the event's claimed-gift orders", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard/events/1/orders"]}>
        <Routes>
          <Route path="/dashboard/events/:id/orders" element={<EventOrdersPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText("Bed Sheets")).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Replace `src/pages/EventOrdersPage.tsx`**

```tsx
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { OrderList } from "../components/orders/OrderList";
import { fetchMockOrders } from "../mocks/orders";

export function EventOrdersPage() {
  const { id } = useParams();
  const eventId = Number(id);
  const ordersPromise = useMemo(() => fetchMockOrders(eventId), [eventId]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-900">Claimed gifts</h1>
      <OrderList ordersPromise={ordersPromise} />
    </div>
  );
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- EventOrdersPage`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/orders src/pages/EventOrdersPage.tsx src/pages/EventOrdersPage.test.tsx
git commit -m "Add OrderList and implement EventOrdersPage"
```

---

## Task 19: README and final full-app smoke test

**Files:**
- Create: `README.md`
- Create: `src/router.test.tsx`

**Interfaces:**
- Consumes: everything (final integration check)
- Produces: nothing further consumed — this is the terminal task.

- [ ] **Step 1: Write the failing test — `src/router.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("full app navigation", () => {
  it("navigates from browse to an event's detail page and back", async () => {
    render(<App />);

    expect(await screen.findByText("Summer BBQ Party")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Summer BBQ Party"));

    expect(await screen.findByRole("heading", { name: "Summer BBQ Party" })).toBeInTheDocument();
    expect(await screen.findByText("Cooler Box")).toBeInTheDocument();
  });

  it("navigates to the login page from the nav bar", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("link", { name: "Log in" }));
    expect(await screen.findByLabelText("Password")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails or passes**

Run: `npm test -- router.test`
Expected: PASS if all prior tasks wired routes correctly — this test exercises no new code, only cross-task integration. If it fails, fix the routing/page code from the relevant earlier task (do not add new abstractions here).

- [ ] **Step 3: Create `README.md`**

```markdown
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
```

- [ ] **Step 4: Run the full test suite**

Run: `npm test`
Expected: every test file across all 19 tasks passes.

- [ ] **Step 5: Commit**

```bash
git add README.md src/router.test.tsx
git commit -m "Add README and full-app navigation smoke test"
```
