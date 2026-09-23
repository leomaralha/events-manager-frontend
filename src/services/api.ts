import { getSessionToken } from "./session";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/** Carries the HTTP status so callers can tell "bad credentials" from "offline". */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  // An explicit Authorization header wins: sign-in needs to call /me with a
  // token that has not been committed to the session store yet.
  if (!headers.has("Authorization")) {
    const token = getSessionToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(data?.error ?? "Erro na requisição", response.status);
  }

  return data as T;
}
