import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EventForm } from "./EventForm";

describe("EventForm", () => {
  it("submits name and date for a new event", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: true });
    render(<EventForm onSubmit={onSubmit} submitLabel="Create event" />);

    await userEvent.type(screen.getByLabelText("Event name"), "Summer BBQ Party");
    await userEvent.type(screen.getByLabelText("Event date"), "2026-07-20");
    await userEvent.click(screen.getByRole("button", { name: "Create event" }));

    expect(onSubmit).toHaveBeenCalledWith({ name: "Summer BBQ Party", date: "2026-07-20" });
  });

  it("pre-fills fields from initialValues", () => {
    render(
      <EventForm
        initialValues={{ name: "Ana & João's Wedding", date: "2026-11-14" }}
        onSubmit={vi.fn()}
        submitLabel="Save changes"
      />,
    );
    expect(screen.getByLabelText("Event name")).toHaveValue("Ana & João's Wedding");
    expect(screen.getByLabelText("Event date")).toHaveValue("2026-11-14");
  });

  it("shows an error message on failure", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: false, error: "Name is taken" });
    render(<EventForm onSubmit={onSubmit} submitLabel="Create event" />);

    await userEvent.type(screen.getByLabelText("Event name"), "Dup");
    await userEvent.type(screen.getByLabelText("Event date"), "2026-07-20");
    await userEvent.click(screen.getByRole("button", { name: "Create event" }));

    expect(await screen.findByText("Name is taken")).toBeInTheDocument();
  });
});
