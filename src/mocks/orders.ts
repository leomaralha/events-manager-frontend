import type { OrderSummary } from "../types/domain";

const mockOrdersByEvent: Record<number, OrderSummary[]> = {
  1: [
    {
      id: 1,
      giftName: "Bed Sheets",
      guestName: "Carla Souza",
      guestEmail: "carla@example.com",
      status: "PENDING",
    },
  ],
  2: [],
  3: [],
};

export function fetchMockOrders(eventId: number): Promise<OrderSummary[]> {
  return Promise.resolve(mockOrdersByEvent[eventId] ?? []);
}
