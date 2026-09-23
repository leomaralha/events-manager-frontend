/**
 * The stored session is the single source of truth for "is someone logged in".
 * It lives in localStorage so a reload keeps you signed in, and it is exposed
 * as an external store so React can subscribe to it with `useSyncExternalStore`
 * — that is what makes a logout in one tab take effect in every other tab.
 */

// Versioned key so a future change to the stored shape can't be read back as
// the old one, and so stale sessions are dropped rather than mis-parsed.
const STORAGE_KEY = "events-manager.session:v1";

export interface StoredSession {
  token: string;
  /** ISO timestamp from the login response, or null if the API omitted it. */
  expiresAt: string | null;
}

const listeners = new Set<() => void>();

// `undefined` means "not read from localStorage yet". localStorage is a
// synchronous, relatively expensive API and getSnapshot runs on every render,
// so the parsed value is cached in memory and only re-read when it changes.
let cachedSession: StoredSession | null | undefined;

function hasExpired(session: StoredSession): boolean {
  if (!session.expiresAt) return false;
  const expiresAt = Date.parse(session.expiresAt);
  return Number.isFinite(expiresAt) && expiresAt <= Date.now();
}

function readSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof (parsed as { token?: unknown }).token !== "string"
    ) {
      return null;
    }

    const { token, expiresAt } = parsed as { token: string; expiresAt?: unknown };
    const session: StoredSession = {
      token,
      expiresAt: typeof expiresAt === "string" ? expiresAt : null,
    };

    return hasExpired(session) ? null : session;
  } catch {
    // Private browsing, disabled storage, or corrupt JSON — treat as logged out.
    return null;
  }
}

/**
 * getSnapshot for `useSyncExternalStore`: must be cheap and must return the
 * same reference until the session actually changes, so it never writes to
 * storage and never allocates a new object for an unchanged session.
 */
export function getSession(): StoredSession | null {
  if (cachedSession === undefined) {
    cachedSession = readSession();
  } else if (cachedSession !== null && hasExpired(cachedSession)) {
    cachedSession = null;
  }
  return cachedSession;
}

/** getServerSnapshot: there is no session while rendering on the server. */
export function getServerSession(): StoredSession | null {
  return null;
}

export function getSessionToken(): string | null {
  return getSession()?.token ?? null;
}

export function setSession(session: StoredSession | null): void {
  cachedSession = session;
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage is unavailable; the in-memory session still works for this tab.
  }
  emit();
}

export function clearSession(): void {
  setSession(null);
}

function handleStorageEvent(event: StorageEvent) {
  if (event.storageArea && event.storageArea !== localStorage) return;
  // `key === null` means the whole store was cleared.
  if (event.key !== null && event.key !== STORAGE_KEY) return;
  cachedSession = undefined; // invalidate; the next read re-parses
  emit();
}

export function subscribeToSession(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1) {
    window.addEventListener("storage", handleStorageEvent);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", handleStorageEvent);
    }
  };
}

function emit() {
  for (const listener of listeners) listener();
}
