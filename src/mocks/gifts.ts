import type { Gift } from "../types/domain";

const mockGiftsByEvent: Record<number, Gift[]> = {
  1: [
    { id: 101, eventId: 1, name: "Blender", description: "500W, glass jar", price: 250, claimed: false },
    { id: 102, eventId: 1, name: "Bed Sheets", description: "Queen size, cotton", price: 180, claimed: true },
  ],
  2: [
    { id: 201, eventId: 2, name: "Cooler Box", price: 90, claimed: false },
  ],
  3: [
    { id: 301, eventId: 3, name: "Stroller", price: 600, claimed: false },
  ],
};

export function fetchMockGifts(eventId: number): Promise<Gift[]> {
  return Promise.resolve(mockGiftsByEvent[eventId] ?? []);
}
