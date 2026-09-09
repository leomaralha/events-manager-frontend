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
