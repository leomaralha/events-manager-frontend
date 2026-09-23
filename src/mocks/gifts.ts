import { apiFetch } from "../services/api";
import type { Gift } from "../types/domain";

export async function fetchMockGifts(eventId: number): Promise<Gift[]> {
  const listGifts = await apiFetch<{
    gifts: {
      id: number;
      name: string;
      description: string;
      price: string;
      weddingId: number;
    }[];
  }>(`/gifts/${eventId}`);
  const gifts = listGifts.gifts.map((gift) => {
    return {
      id: gift.id,
      eventId: gift.weddingId,
      name: gift.name,
      description: gift.description,
      price: Number(gift.price),
      claimed: false,
    };
  });
  return gifts
}
