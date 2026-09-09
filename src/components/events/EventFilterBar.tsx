import { TextField } from "../ui/TextField";
import type { EventFilterBarProps } from "../../types/contracts";

export function EventFilterBar({ value, onChange }: EventFilterBarProps) {
  return (
    <TextField
      label="Filter by name"
      name="event-filter"
      value={value}
      placeholder="Search events…"
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
