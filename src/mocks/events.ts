import type { EventSummary, EventDetails } from "../types/domain";

export const mockEvents: EventSummary[] = [
  { id: 1, slug: "ana-e-joao", name: "Ana & João's Wedding", date: "2026-11-14" },
  { id: 2, slug: "summer-bbq", name: "Summer BBQ Party", date: "2026-07-20" },
  { id: 3, slug: "baby-shower-lu", name: "Lu's Baby Shower", date: "2026-08-02" },
];

export function fetchMockEvents(): Promise<EventSummary[]> {
  return Promise.resolve(mockEvents);
}

export function fetchMockEventDetails(slug: string): Promise<EventDetails> {
  const event = mockEvents.find((e) => e.slug === slug);
  if (!event) return Promise.reject(new Error(`Event not found: ${slug}`));
  return Promise.resolve({ ...event, giftCount: 4, guestCount: 12 });
}
