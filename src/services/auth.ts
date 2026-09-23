import { ApiError, apiFetch } from "./api";
import { clearSession, type StoredSession } from "./session";
import type { AuthUser } from "../types/domain";

/**
 * An *instrumented* promise, in React's sense: `use()` reads `status`/`value`
 * off the thenable and returns synchronously when it has already settled,
 * suspending only while it is genuinely pending. React sets these fields
 * itself for promises it has suspended on; setting them up front lets a known
 * answer render without ever showing a fallback.
 */
type Thenable<T> = Promise<T> & {
  status?: "pending" | "fulfilled" | "rejected";
  value?: T;
  reason?: unknown;
};

function instrument<T>(promise: Promise<T>): Thenable<T> {
  const thenable = promise as Thenable<T>;
  if (thenable.status) return thenable;

  thenable.status = "pending";
  thenable.then(
    (value) => {
      if (thenable.status === "pending") {
        thenable.status = "fulfilled";
        thenable.value = value;
      }
    },
    (reason) => {
      if (thenable.status === "pending") {
        thenable.status = "rejected";
        thenable.reason = reason;
      }
    },
  );
  return thenable;
}

function fulfilled<T>(value: T): Thenable<T> {
  const thenable = Promise.resolve(value) as Thenable<T>;
  thenable.status = "fulfilled";
  thenable.value = value;
  return thenable;
}

/**
 * `use()` re-reads its argument on every render, so a token must always map to
 * the *same* thenable — a fresh promise per render would suspend the tree
 * forever. This cache provides that stability and dedupes the `/me` request.
 */
const userByToken = new Map<string, Thenable<AuthUser | null>>();

/** Shared settled thenable for "nobody is logged in" — never suspends. */
const NO_USER = fulfilled<AuthUser | null>(null);

export async function requestLogin(
  email: string,
  password: string,
): Promise<StoredSession> {
  const result = await apiFetch<{ token: string; expiresAt?: string }>(
    "/user/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
  );

  return { token: result.token, expiresAt: result.expiresAt ?? null };
}

/**
 * The current user for a token, as a promise that is stable across renders and
 * instrumented so `use()` can read it without suspending once it has settled.
 */
export function currentUserFor(token: string | null): Promise<AuthUser | null> {
  if (!token) return NO_USER;

  let thenable = userByToken.get(token);
  if (!thenable) {
    thenable = instrument(fetchCurrentUser(token));
    userByToken.set(token, thenable);
  }
  return thenable;
}

/**
 * Settles `/me` before the token is published to the session store, so the
 * render that picks up the new token reads an already-fulfilled thenable
 * instead of flashing a Suspense fallback over an already-visible app.
 */
export async function primeCurrentUser(token: string): Promise<AuthUser | null> {
  return currentUserFor(token);
}

export function forgetCurrentUser(token: string | null): void {
  if (token) userByToken.delete(token);
}

/**
 * Deliberately never rejects: a failed `/me` means "not signed in", which the
 * UI can render, rather than an error thrown at a boundary.
 */
async function fetchCurrentUser(token: string): Promise<AuthUser | null> {
  try {
    const payload = await apiFetch<AuthUser | { user: AuthUser }>("users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return normalizeUser(payload);
  } catch (error) {
    // Only a rejected credential means the session is dead. A network blip or
    // a 500 must not silently sign the user out — the token stays put and the
    // next reload retries.
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      forgetCurrentUser(token);
      clearSession();
    }
    return null;
  }
}

/** Accepts either a bare user or the `{ user }` envelope the API also uses. */
function normalizeUser(payload: AuthUser | { user: AuthUser } | null): AuthUser | null {
  const user =
    payload && typeof payload === "object" && "user" in payload
      ? payload.user
      : payload;

  if (!user || typeof user !== "object") return null;

  const { id, name, email } = user as Partial<AuthUser>;
  if (id === undefined || typeof name !== "string" || typeof email !== "string") {
    return null;
  }

  return { id: Number(id), name, email };
}
