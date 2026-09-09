import type { EventSummary, EventDetails } from "../types/domain";

export const mockEvents: EventSummary[] = [
  { id: 1, slug: "ana-e-joao", name: "Ana & João's Wedding", date: "2026-11-14" },
  { id: 2, slug: "summer-bbq", name: "Summer BBQ Party", date: "2026-07-20" },
  { id: 3, slug: "baby-shower-lu", name: "Lu's Baby Shower", date: "2026-08-02" },
];

// This mock data is always available synchronously, so the returned promise
// is tagged with the `status`/`value` fields React's `use()` hook checks
// before suspending (see react-dom's `trackUsedThenable`). That lets `use()`
// read the value on its very first call instead of throwing and waiting for
// a Suspense retry, which real screens never need for already-known data.
function resolvedThenable<T>(value: T): Promise<T> {
  const promise = Promise.resolve(value) as Promise<T> & { status?: string; value?: T };
  promise.status = "fulfilled";
  promise.value = value;
  return promise;
}

export function fetchMockEvents(): Promise<EventSummary[]> {
  return resolvedThenable(mockEvents);
}

export function fetchMockEventDetails(slug: string): Promise<EventDetails> {
  const event = mockEvents.find((e) => e.slug === slug);
  if (!event) return Promise.reject(new Error(`Event not found: ${slug}`));
  return resolvedThenable({ ...event, giftCount: 4, guestCount: 12 });
}
