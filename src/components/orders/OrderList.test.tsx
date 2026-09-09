import { render, screen } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { OrderList } from "./OrderList";
import type { OrderSummary } from "../../types/domain";

const orders: OrderSummary[] = [
  {
    id: 1,
    giftName: "Bed Sheets",
    guestName: "Carla Souza",
    guestEmail: "carla@example.com",
    status: "PENDING",
  },
];

// Rendering is wrapped in React's async `act` because OrderList suspends on
// mount via `use()`; React Testing Library's `render` only wraps the initial
// mount in a synchronous act call, which leaves the Suspense retry unable to
// fire once the (already-resolved) promise settles.
describe("OrderList", () => {
  it("renders each order's gift, guest, and status", async () => {
    await act(async () => {
      render(<OrderList ordersPromise={Promise.resolve(orders)} />);
    });
    expect(screen.getByText("Bed Sheets")).toBeInTheDocument();
    expect(screen.getByText(/Carla Souza/)).toBeInTheDocument();
    expect(screen.getByText("PENDING")).toBeInTheDocument();
  });

  it("shows an empty state when there are no orders", async () => {
    await act(async () => {
      render(<OrderList ordersPromise={Promise.resolve([])} />);
    });
    expect(screen.getByText(/no gifts claimed/i)).toBeInTheDocument();
  });
});
