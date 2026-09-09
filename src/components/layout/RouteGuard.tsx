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
