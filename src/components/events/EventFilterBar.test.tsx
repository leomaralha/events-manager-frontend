import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { EventFilterBar } from "./EventFilterBar";

function ControlledFilterBar({ onChange }: { onChange: (value: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <EventFilterBar
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange(next);
      }}
    />
  );
}

describe("EventFilterBar", () => {
  it("calls onChange as the user types", async () => {
    const onChange = vi.fn();
    render(<ControlledFilterBar onChange={onChange} />);
    await userEvent.type(screen.getByLabelText(/filter by name/i), "bbq");
    expect(onChange).toHaveBeenCalledWith("b");
    expect(onChange).toHaveBeenCalledWith("bbq");
  });
});
