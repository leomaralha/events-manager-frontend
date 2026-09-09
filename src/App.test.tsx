import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the browse-events page at the root route", () => {
    render(<App />);
    expect(screen.getByText(/Browse events/i)).toBeInTheDocument();
  });

  it("renders the nav bar with login/register links when logged out", () => {
    render(<App />);
    expect(screen.getByRole("link", { name: "Log in" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Register" })).toBeInTheDocument();
  });
});
