import { useMemo, useState } from "react";
import { EventFilterBar } from "../components/events/EventFilterBar";
import { EventList } from "../components/events/EventList";
import { fetchMockEvents } from "../mocks/events";

export function BrowseEventsPage() {
  const [filterQuery, setFilterQuery] = useState("");
  const eventsPromise = useMemo(() => fetchMockEvents(), []);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-900">Browse events</h1>
      <EventFilterBar value={filterQuery} onChange={setFilterQuery} />
      <EventList eventsPromise={eventsPromise} filterQuery={filterQuery} />
    </div>
  );
}
