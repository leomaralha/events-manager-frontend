import { Suspense, use } from "react";
import { Spinner } from "../ui/Spinner";
import type { EventDetailProps } from "../../types/contracts";

function EventDetailContent({ eventPromise }: EventDetailProps) {
  const event = use(eventPromise);

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold text-slate-900">{event.name}</h1>
      <p className="text-slate-500">{event.date}</p>
      <p className="text-sm text-slate-500">
        {event.giftCount} gift{event.giftCount === 1 ? "" : "s"} · {event.guestCount} guest
        {event.guestCount === 1 ? "" : "s"}
      </p>
    </div>
  );
}

export function EventDetail(props: EventDetailProps) {
  return (
    <Suspense fallback={<Spinner label="Loading event…" />}>
      <EventDetailContent {...props} />
    </Suspense>
  );
}
