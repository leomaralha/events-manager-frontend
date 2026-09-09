import { Link } from "react-router-dom";
import { EventCard } from "../components/events/EventCard";
import { mockEvents } from "../mocks/events";
import { Button } from "../components/ui/Button";

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Your events</h1>
        <Link to="/dashboard/events/new">
          <Button>Create event</Button>
        </Link>
      </div>
      <div className="grid gap-3">
        {mockEvents.map((event) => (
          <EventCard key={event.id} event={event} href={`/dashboard/events/${event.id}/edit`} />
        ))}
      </div>
    </div>
  );
}
