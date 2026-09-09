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
