import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { BrowseEventsPage } from "./BrowseEventsPage";

// Rendering is wrapped in React's async `act` because BrowseEventsPage's
// EventList suspends on mount via `use()`; React Testing Library's `render`
// only wraps the initial mount in a synchronous act call, which leaves the
// Suspense retry unable to fire once the (already-resolved) promise settles.
describe("BrowseEventsPage", () => {
  it("lists mock events and filters them by typing", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <BrowseEventsPage />
        </MemoryRouter>,
      );
    });
    expect(screen.getByText("Summer BBQ Party")).toBeInTheDocument();
    expect(screen.getByText("Ana & João's Wedding")).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/filter by name/i), "bbq");

    expect(screen.queryByText("Ana & João's Wedding")).not.toBeInTheDocument();
    expect(screen.getByText("Summer BBQ Party")).toBeInTheDocument();
  });
});
