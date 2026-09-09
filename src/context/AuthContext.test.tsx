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
