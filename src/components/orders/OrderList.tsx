import { Suspense, use } from "react";
import { EmptyState } from "../ui/EmptyState";
import { Spinner } from "../ui/Spinner";
import type { OrderListProps } from "../../types/contracts";

function OrderListContent({ ordersPromise }: OrderListProps) {
  const orders = use(ordersPromise);

  if (orders.length === 0) {
    return <EmptyState message="No gifts claimed yet." />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {orders.map((order) => (
        <li key={order.id} className="rounded-md border border-slate-200 p-3">
          <p className="font-medium text-slate-900">{order.giftName}</p>
          <p className="text-sm text-slate-500">
            {order.guestName} · {order.guestEmail}
          </p>
          <p className="text-sm text-indigo-600">{order.status}</p>
        </li>
      ))}
    </ul>
  );
}

export function OrderList(props: OrderListProps) {
  return (
    <Suspense fallback={<Spinner label="Loading orders…" />}>
      <OrderListContent {...props} />
    </Suspense>
  );
}
