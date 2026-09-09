import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { GiftList } from "../components/gifts/GiftList";
import { GiftForm } from "../components/gifts/GiftForm";
import { fetchMockGifts } from "../mocks/gifts";
import type { SubmitResult } from "../types/domain";

export function EventGiftsPage() {
  const { id } = useParams();
  const eventId = Number(id);
  const giftsPromise = useMemo(() => fetchMockGifts(eventId), [eventId]);

  async function handleAddGift(): Promise<SubmitResult> {
    return { ok: true };
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">Gifts</h1>
      <GiftList giftsPromise={giftsPromise} />
      <div>
        <h2 className="mb-2 text-lg font-semibold text-slate-900">Add a gift</h2>
        <GiftForm onSubmit={handleAddGift} />
      </div>
    </div>
  );
}
