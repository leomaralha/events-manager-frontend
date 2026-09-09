import { Suspense, use } from "react";
import { EventCard } from "./EventCard";
import { EmptyState } from "../ui/EmptyState";
import { Spinner } from "../ui/Spinner";
import type { EventListProps } from "../../types/contracts";

function EventListContent({ eventsPromise, filterQuery }: EventListProps) {
  const events = use(eventsPromise);
  const filtered = events.filter((event) =>
    event.name.toLowerCase().includes(filterQuery.toLowerCase()),
  );

  if (filtered.length === 0) {
    return <EmptyState message="No events match your search." />;
  }

  return (
    <div className="grid gap-3">
      {filtered.map((event) => (
        <EventCard key={event.id} event={event} href={`/events/${event.slug}`} />
      ))}
    </div>
  );
}

export function EventList(props: EventListProps) {
  return (
    <Suspense fallback={<Spinner label="Loading events…" />}>
      <EventListContent {...props} />
    </Suspense>
  );
}
