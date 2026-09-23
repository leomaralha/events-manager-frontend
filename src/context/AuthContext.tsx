import {
  createContext,
  Suspense,
  use,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  currentUserFor,
  forgetCurrentUser,
  primeCurrentUser,
  requestLogin,
} from "../services/auth";
import {
  getServerSession,
  getSession,
  getSessionToken,
  setSession,
  subscribeToSession,
} from "../services/session";
import { Spinner } from "../components/ui/Spinner";
import type { AuthUser, LoginOutcome } from "../types/domain";
import type { AuthContextValue } from "../types/contracts";

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  // React 19: `use` reads context and, unlike useContext, may be called
  // conditionally.
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within an AuthContext provider");
  }
  return value;
}

/**
 * Real provider. The bearer token is the single source of truth: it is read
 * from the external session store, and the current user is simply whatever
 * `/me` answers for that token. There is no second copy of the user to keep in
 * sync, so token and user can never disagree.
 */
export function AuthProvider({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <Suspense fallback={fallback ?? <Spinner label="Restoring your session…" />}>
      <AuthSession>{children}</AuthSession>
    </Suspense>
  );
}

function AuthSession({ children }: { children: ReactNode }) {
  // Subscribing to the store — rather than holding the token in state — is what
  // makes a login or logout in one tab take effect in the others.
  const session = useSyncExternalStore(
    subscribeToSession,
    getSession,
    getServerSession,
  );

  // Always `use()` the thenable for the current token. It is already settled
  // whenever the answer is known — logged out, or a sign-in that pre-resolved
  // /me — so only a genuine cold start with a stored token suspends.
  const currentUser = use(currentUserFor(session?.token ?? null));

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,

      async signIn(email: string, password: string): Promise<LoginOutcome> {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();

        if (!normalizedEmail || !normalizedPassword) {
          return { ok: false, error: "Informe o email e a senha." };
        }

        try {
          const next = await requestLogin(normalizedEmail, normalizedPassword);
          // Resolve /me before publishing the token, so the re-render below
          // lands straight on the signed-in UI.
          const user = await primeCurrentUser(next.token);

          if (!user) {
            // A token we cannot resolve to a user is useless: every guarded
            // route would reject it. Fail the sign-in rather than leave the
            // app looking logged out right after a successful login.
            forgetCurrentUser(next.token);
            return {
              ok: false,
              error: "Não foi possível carregar seu perfil. Tente novamente.",
            };
          }

          setSession(next);

          return {
            ok: true,
            token: next.token,
            expiresAt: next.expiresAt ?? "",
          };
        } catch (error) {
          return {
            ok: false,
            error: error instanceof Error ? error.message : "Login failed",
          };
        }
      },

      signOut() {
        // There is no /logout endpoint: the bearer token lives only on the
        // client, so discarding it is the logout.
        forgetCurrentUser(getSessionToken());
        setSession(null);
      },
    }),
    [currentUser],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

/**
 * Demo/test provider for rendering a component in isolation without a network.
 * Production rendering goes through {@link AuthProvider}.
 */
export function MockAuthProvider({
  seedUser = null,
  children,
}: {
  seedUser?: AuthUser | null;
  children: ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(seedUser);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      async signIn(email: string) {
        setCurrentUser({ id: 1, name: "Test user", email });
        return { ok: true, token: "test-token", expiresAt: "" };
      },
      signOut: () => setCurrentUser(null),
    }),
    [currentUser],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
