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

// See the comment on `resolvedThenable` in `mocks/events.ts`: this data is
// always available synchronously, so the promise is tagged as already
// fulfilled to avoid an unnecessary Suspense throw/retry in `use()`.
function resolvedThenable<T>(value: T): Promise<T> {
  const promise = Promise.resolve(value) as Promise<T> & { status?: string; value?: T };
  promise.status = "fulfilled";
  promise.value = value;
  return promise;
}

export function fetchMockGifts(eventId: number): Promise<Gift[]> {
  return resolvedThenable(mockGiftsByEvent[eventId] ?? []);
}
