import { apiFetch } from "../services/api";
import type { EventSummary, EventDetails } from "../types/domain";

export const mockEvents: EventSummary[] = [
  {
    id: 1,
    slug: "ana-e-joao",
    name: "Ana & João's Wedding",
    date: "2026-11-14",
  },
  { id: 2, slug: "summer-bbq", name: "Summer BBQ Party", date: "2026-07-20" },
  {
    id: 3,
    slug: "baby-shower-lu",
    name: "Lu's Baby Shower",
    date: "2026-08-02",
  },
];

export async function fetchMockEvents(): Promise<EventSummary[]> {
  const events = await apiFetch<{
    weddings: {
      coupleName: string;
      createdAt: string;
      id: number;
      ownerId: number;
      slug: string;
      weddingDate: string;
    }[];
  }>("/wedding?shouldReturnAll=true");
  return events.weddings.map((wedding) => {
    return {
      date: wedding.weddingDate,
      id: wedding.id,
      name: wedding.coupleName,
      slug: wedding.slug,
    } as EventSummary;
  });
}

export async function fetchMockEventDetails(slug: string): Promise<EventDetails> {
  const weddingDetails = await apiFetch<{
    wedding: {
      coupleName: string;
      createdAt: string;
      id: number;
      ownerId: number;
      slug: string;
      weddingDate: string;
    };
    guests: { id: number; name: string; email: string; createdAt: string }[];
    gifts: {
      id: number;
      name: string;
      description: string;
      price: string;
      weddingId: number;
    }[];
    giftCount: number;
    guestCount: number;
  }>(`/weddings/${slug}`);
  const eventDetails = {
    date: weddingDetails.wedding.weddingDate,
    giftCount: weddingDetails.giftCount,
    guestCount: weddingDetails.guestCount,
    id: weddingDetails.wedding.id,
    name: weddingDetails.wedding.coupleName,
    slug: weddingDetails.wedding.slug,
  }
  return eventDetails
}
