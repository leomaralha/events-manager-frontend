import { Suspense, use } from "react";
import { EmptyState } from "../ui/EmptyState";
import { Spinner } from "../ui/Spinner";
import type { GuestListProps } from "../../types/contracts";

function GuestListContent({ guestsPromise }: GuestListProps) {
  const guests = use(guestsPromise);

  if (guests.length === 0) {
    return <EmptyState message="No guests have RSVP'd yet." />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {guests.map((guest) => (
        <li key={guest.id} className="rounded-md border border-slate-200 p-3">
          <p className="font-medium text-slate-900">{guest.name}</p>
          <p className="text-sm text-slate-500">{guest.email}</p>
        </li>
      ))}
    </ul>
  );
}

export function GuestList(props: GuestListProps) {
  return (
    <Suspense fallback={<Spinner label="Loading guests…" />}>
      <GuestListContent {...props} />
    </Suspense>
  );
}
