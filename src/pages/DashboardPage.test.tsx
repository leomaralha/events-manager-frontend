import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { DashboardPage } from "./DashboardPage";

describe("DashboardPage", () => {
  it("lists the owner's events with links to manage each one", () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Ana & João's Wedding")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /create event/i })).toHaveAttribute(
      "href",
      "/dashboard/events/new",
    );
  });
});
