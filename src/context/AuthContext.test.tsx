import { act, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, MockAuthProvider, useAuth } from "./AuthContext";
import { setSession } from "../services/session";

function Probe() {
  const { currentUser, signIn, signOut } = useAuth();
  return (
    <div>
      <span data-testid="user">{currentUser ? currentUser.name : "guest"}</span>
      <button onClick={() => void signIn("ana@example.com", "hunter2")}>Login</button>
      <button onClick={signOut}>Logout</button>
    </div>
  );
}

const STORAGE_KEY = "events-manager.session:v1";

/**
 * A tree that suspends on its first render has to be flushed inside an awaited
 * `act`, otherwise React never retries the boundary under the test renderer.
 */
async function renderSuspending(ui: ReactElement) {
  // A tree that suspends on its first render has to be flushed inside an
  // awaited act, or React never retries the boundary under the test renderer.
  await act(async () => {
    render(ui);
    // Let the /me response chain settle inside this act scope so React's
    // retry of the suspended boundary is flushed here too.
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
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

describe("AuthProvider", () => {
  beforeEach(() => {
    // Go through the store so its in-memory cache is reset too, not just
    // localStorage — the cache outlives a single test in the same worker.
    setSession(null);
    vi.restoreAllMocks();
  });

  afterEach(() => {
    setSession(null);
  });

  it("renders as a guest when no session is stored, without calling the API", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    expect(await screen.findByTestId("user")).toHaveTextContent("guest");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("restores the user from /me when a token is already stored", async () => {
    setSession({ token: "stored-token", expiresAt: null });

    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(jsonResponse({ id: 7, name: "Ana", email: "ana@example.com" }));

    await renderSuspending(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    expect(await screen.findByTestId("user")).toHaveTextContent("Ana");

    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toMatch(/\/me$/);
    expect(new Headers(init.headers).get("Authorization")).toBe("Bearer stored-token");
  });

  it("stores the token and exposes the user after a successful sign-in", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url.endsWith("/user/login")) {
        return jsonResponse({ token: "fresh-token", expiresAt: "2099-01-01T00:00:00.000Z" });
      }
      return jsonResponse({ id: 7, name: "Ana", email: "ana@example.com" });
    });

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    // signIn publishes the session after an await, so the resulting store
    // update lands outside a plain click's act scope.
    await act(async () => {
      screen.getByRole("button", { name: "Login" }).click();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.getByTestId("user")).toHaveTextContent("Ana");
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")).toEqual({
      token: "fresh-token",
      expiresAt: "2099-01-01T00:00:00.000Z",
    });
  });

  it("drops the stored token on sign-out", async () => {
    setSession({ token: "logout-token", expiresAt: null });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ id: 7, name: "Ana", email: "ana@example.com" }),
    );

    await renderSuspending(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    expect(await screen.findByTestId("user")).toHaveTextContent("Ana");

    await act(async () => {
      screen.getByRole("button", { name: "Logout" }).click();
    });

    expect(screen.getByTestId("user")).toHaveTextContent("guest");
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("clears a rejected token instead of leaving a dead session behind", async () => {
    setSession({ token: "rejected-token", expiresAt: null });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ error: "Token inválido" }, 401),
    );

    await renderSuspending(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    expect(await screen.findByTestId("user")).toHaveTextContent("guest");
    await waitFor(() => expect(localStorage.getItem(STORAGE_KEY)).toBeNull());
  });

  it("ignores a stored session whose expiry has already passed", async () => {
    setSession({ token: "old-token", expiresAt: "2000-01-01T00:00:00.000Z" });
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    expect(await screen.findByTestId("user")).toHaveTextContent("guest");
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe("AuthProvider sign-in failures", () => {
  beforeEach(() => {
    setSession(null);
    vi.restoreAllMocks();
  });

  afterEach(() => {
    setSession(null);
  });

  it("reports an error and stores nothing when /me cannot resolve the new token", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url.endsWith("/user/login")) {
        return jsonResponse({ token: "unusable-token", expiresAt: null });
      }
      return jsonResponse({ error: "Token inválido" }, 401);
    });

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    await act(async () => {
      screen.getByRole("button", { name: "Login" }).click();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.getByTestId("user")).toHaveTextContent("guest");
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
