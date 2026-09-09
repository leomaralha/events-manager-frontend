import { render, screen } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { EventDetail } from "./EventDetail";
import type { EventDetails } from "../../types/domain";

const details: EventDetails = {
  id: 1,
  slug: "summer-bbq",
  name: "Summer BBQ Party",
  date: "2026-07-20",
  giftCount: 1,
  guestCount: 0,
};

// Rendering is wrapped in React's async `act` because EventDetail suspends on
// mount via `use()`; React Testing Library's `render` only wraps the initial
// mount in a synchronous act call, which leaves the Suspense retry unable to
// fire once the (already-resolved) promise settles.
describe("EventDetail", () => {
  it("renders the event's name, date, gift count, and guest count", async () => {
    await act(async () => {
      render(<EventDetail eventPromise={Promise.resolve(details)} />);
    });
    expect(screen.getByText("Summer BBQ Party")).toBeInTheDocument();
    expect(screen.getByText("2026-07-20")).toBeInTheDocument();
    expect(screen.getByText(/1 gift/i)).toBeInTheDocument();
    expect(screen.getByText(/0 guests/i)).toBeInTheDocument();
  });
});
