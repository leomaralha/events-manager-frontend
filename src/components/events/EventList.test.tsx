import { render, screen } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { EventList } from "./EventList";
import type { EventSummary } from "../../types/domain";

const events: EventSummary[] = [
  { id: 1, slug: "ana-e-joao", name: "Ana & João's Wedding", date: "2026-11-14" },
  { id: 2, slug: "summer-bbq", name: "Summer BBQ Party", date: "2026-07-20" },
];

// Rendering is wrapped in React's async `act` because EventList suspends on
// mount via `use()`; React Testing Library's `render` only wraps the initial
// mount in a synchronous act call, which leaves the Suspense retry unable to
// fire once the (already-resolved) promise settles.
describe("EventList", () => {
  it("renders every event when the filter query is empty", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <EventList eventsPromise={Promise.resolve(events)} filterQuery="" />
        </MemoryRouter>,
      );
    });
    expect(screen.getByText("Ana & João's Wedding")).toBeInTheDocument();
    expect(screen.getByText("Summer BBQ Party")).toBeInTheDocument();
  });

  it("filters events by name, case-insensitively", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <EventList eventsPromise={Promise.resolve(events)} filterQuery="bbq" />
        </MemoryRouter>,
      );
    });
    expect(screen.getByText("Summer BBQ Party")).toBeInTheDocument();
    expect(screen.queryByText("Ana & João's Wedding")).not.toBeInTheDocument();
  });

  it("shows an empty state when nothing matches", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <EventList eventsPromise={Promise.resolve(events)} filterQuery="zzz" />
        </MemoryRouter>,
      );
    });
    expect(screen.getByText(/no events match/i)).toBeInTheDocument();
  });
});
