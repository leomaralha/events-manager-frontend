import { EventForm } from "../components/events/EventForm";
import type { SubmitResult } from "../types/domain";

export function CreateEventPage() {
  async function handleCreate(): Promise<SubmitResult> {
    return { ok: true };
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-900">Create event</h1>
      <EventForm onSubmit={handleCreate} submitLabel="Create event" />
    </div>
  );
}
