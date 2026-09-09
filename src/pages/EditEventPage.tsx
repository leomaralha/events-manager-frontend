import { useParams } from "react-router-dom";
import { EventForm } from "../components/events/EventForm";
import { mockEvents } from "../mocks/events";
import type { SubmitResult } from "../types/domain";

export function EditEventPage() {
  const { id } = useParams();
  const event = mockEvents.find((e) => e.id === Number(id));

  async function handleUpdate(): Promise<SubmitResult> {
    return { ok: true };
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-900">Edit event</h1>
      <EventForm
        initialValues={event ? { name: event.name, date: event.date } : undefined}
        onSubmit={handleUpdate}
        submitLabel="Save changes"
      />
    </div>
  );
}
