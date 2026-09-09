import { render, screen } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { GiftList } from "./GiftList";
import type { Gift } from "../../types/domain";

const gifts: Gift[] = [
  { id: 1, eventId: 1, name: "Blender", price: 250, claimed: false },
  { id: 2, eventId: 1, name: "Bed Sheets", price: 180, claimed: true },
];

// Rendering is wrapped in React's async `act` because GiftList suspends on
// mount via `use()`; React Testing Library's `render` only wraps the initial
// mount in a synchronous act call, which leaves the Suspense retry unable to
// fire once the (already-resolved) promise settles.
describe("GiftList", () => {
  it("renders each gift's name, price, and claimed status", async () => {
    await act(async () => {
      render(<GiftList giftsPromise={Promise.resolve(gifts)} />);
    });
    expect(screen.getByText("Blender")).toBeInTheDocument();
    expect(screen.getByText("Bed Sheets")).toBeInTheDocument();
    expect(screen.getByText(/claimed/i)).toBeInTheDocument();
  });

  it("renders a per-gift action when renderAction is provided", async () => {
    await act(async () => {
      render(
        <GiftList
          giftsPromise={Promise.resolve(gifts)}
          renderAction={(gift) => <button>Claim {gift.name}</button>}
        />,
      );
    });
    expect(screen.getByRole("button", { name: "Claim Blender" })).toBeInTheDocument();
  });

  it("shows an empty state when there are no gifts", async () => {
    await act(async () => {
      render(<GiftList giftsPromise={Promise.resolve([])} />);
    });
    expect(screen.getByText(/no gifts/i)).toBeInTheDocument();
  });
});
