import { render, screen } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { GuestList } from "./GuestList";
import type { Guest } from "../../types/domain";

const guests: Guest[] = [
  { id: 1, name: "Carla Souza", email: "carla@example.com" },
  { id: 2, name: "Bruno Lima", email: "bruno@example.com" },
];

// Rendering is wrapped in React's async `act` because GuestList suspends on
// mount via `use()`; React Testing Library's `render` only wraps the initial
// mount in a synchronous act call, which leaves the Suspense retry unable to
// fire once the (already-resolved) promise settles.
describe("GuestList", () => {
  it("renders each guest's name and email", async () => {
    await act(async () => {
      render(<GuestList guestsPromise={Promise.resolve(guests)} />);
    });
    expect(screen.getByText("Carla Souza")).toBeInTheDocument();
    expect(screen.getByText("bruno@example.com")).toBeInTheDocument();
  });

  it("shows an empty state when there are no guests", async () => {
    await act(async () => {
      render(<GuestList guestsPromise={Promise.resolve([])} />);
    });
    expect(screen.getByText(/no guests/i)).toBeInTheDocument();
  });
});
