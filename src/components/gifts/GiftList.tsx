import { Suspense, use } from "react";
import { EmptyState } from "../ui/EmptyState";
import { Spinner } from "../ui/Spinner";
import type { GiftListProps } from "../../types/contracts";

function GiftListContent({ giftsPromise, renderAction }: GiftListProps) {
  const gifts = use(giftsPromise);

  if (gifts.length === 0) {
    return <EmptyState message="No gifts registered yet." />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {gifts.map((gift) => (
        <li
          key={gift.id}
          className="flex items-center justify-between rounded-md border border-slate-200 p-3"
        >
          <div>
            <p className="font-medium text-slate-900">{gift.name}</p>
            {gift.price != null ? <p className="text-sm text-slate-500">${gift.price}</p> : null}
            {gift.claimed ? <p className="text-sm text-indigo-600">Claimed</p> : null}
          </div>
          {renderAction ? renderAction(gift) : null}
        </li>
      ))}
    </ul>
  );
}

export function GiftList(props: GiftListProps) {
  return (
    <Suspense fallback={<Spinner label="Loading gifts…" />}>
      <GiftListContent {...props} />
    </Suspense>
  );
}
