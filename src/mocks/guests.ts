import type { Guest } from "../types/domain";

const mockGuestsByEvent: Record<number, Guest[]> = {
  1: [
    { id: 1, name: "Carla Souza", email: "carla@example.com" },
    { id: 2, name: "Bruno Lima", email: "bruno@example.com" },
  ],
  2: [],
  3: [{ id: 3, name: "Marta Alves", email: "marta@example.com" }],
};

export function fetchMockGuests(eventId: number): Promise<Guest[]> {
  return Promise.resolve(mockGuestsByEvent[eventId] ?? []);
}
