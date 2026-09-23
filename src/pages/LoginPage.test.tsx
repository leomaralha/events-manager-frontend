import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { MockAuthProvider } from "../context/AuthContext";
import { LoginPage } from "./LoginPage";

describe("LoginPage", () => {
  it("renders the login form", () => {
    render(
      <MockAuthProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </MockAuthProvider>,
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });
});
