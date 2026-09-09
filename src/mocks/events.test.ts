import { describe, expect, it } from "vitest";
import { fetchMockEvents, fetchMockEventDetails } from "./events";

describe("event mocks", () => {
  it("resolves the full mock event list", async () => {
    const events = await fetchMockEvents();
    expect(events).toHaveLength(3);
    expect(events[0].slug).toBe("ana-e-joao");
  });

  it("resolves details for a known slug", async () => {
    const details = await fetchMockEventDetails("summer-bbq");
    expect(details.name).toBe("Summer BBQ Party");
    expect(details.giftCount).toBe(4);
  });

  it("rejects for an unknown slug", async () => {
    await expect(fetchMockEventDetails("nope")).rejects.toThrow("Event not found");
  });
});
