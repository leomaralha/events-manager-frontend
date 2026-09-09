import { Link } from "react-router-dom";
import type { EventCardProps } from "../../types/contracts";

export function EventCard({ event, href }: EventCardProps) {
  return (
    <Link
      to={href}
      className="block rounded-md border border-slate-200 p-4 hover:border-indigo-400 hover:shadow-sm"
    >
      <p className="font-medium text-slate-900">{event.name}</p>
      <p className="text-sm text-slate-500">{event.date}</p>
    </Link>
  );
}
