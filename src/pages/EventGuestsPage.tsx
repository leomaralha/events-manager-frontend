import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { GuestList } from "../components/guests/GuestList";
import { fetchMockGuests } from "../mocks/guests";

export function EventGuestsPage() {
  const { id } = useParams();
  const eventId = Number(id);
  const guestsPromise = useMemo(() => fetchMockGuests(eventId), [eventId]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-900">Guests</h1>
      <GuestList guestsPromise={guestsPromise} />
    </div>
  );
}
