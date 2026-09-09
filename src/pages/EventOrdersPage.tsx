import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { OrderList } from "../components/orders/OrderList";
import { fetchMockOrders } from "../mocks/orders";

export function EventOrdersPage() {
  const { id } = useParams();
  const eventId = Number(id);
  const ordersPromise = useMemo(() => fetchMockOrders(eventId), [eventId]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-900">Claimed gifts</h1>
      <OrderList ordersPromise={ordersPromise} />
    </div>
  );
}
