import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { EventDetail } from "../components/events/EventDetail";
import { GiftList } from "../components/gifts/GiftList";
import { fetchMockEventDetails } from "../mocks/events";
import { fetchMockGifts } from "../mocks/gifts";
import { mockEvents } from "../mocks/events";

export function EventDetailPage() {
  const { slug = "" } = useParams();
  const eventPromise = useMemo(() => fetchMockEventDetails(slug), [slug]);
  const eventId = mockEvents.find((e) => e.slug === slug)?.id ?? 0;
  const giftsPromise = useMemo(() => fetchMockGifts(eventId), [eventId]);

  return (
    <div className="flex flex-col gap-6">
      <EventDetail eventPromise={eventPromise} />
      <div>
        <h2 className="mb-2 text-lg font-semibold text-slate-900">Gifts</h2>
        <GiftList giftsPromise={giftsPromise} />
      </div>
    </div>
  );
}
