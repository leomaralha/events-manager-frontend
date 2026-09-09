import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GiftForm } from "./GiftForm";

describe("GiftForm", () => {
  it("submits name, description, and price", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: true });
    render(<GiftForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Gift name"), "Blender");
    await userEvent.type(screen.getByLabelText("Description (optional)"), "500W");
    await userEvent.type(screen.getByLabelText("Price (optional)"), "250");
    await userEvent.click(screen.getByRole("button", { name: /add gift/i }));

    expect(onSubmit).toHaveBeenCalledWith({ name: "Blender", description: "500W", price: 250 });
  });
});
