import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RsvpForm } from "./RsvpForm";

describe("RsvpForm", () => {
  it("submits the entered name and email", async () => {
    const onRsvp = vi.fn().mockResolvedValue({ ok: true });
    render(<RsvpForm onRsvp={onRsvp} />);

    await userEvent.type(screen.getByLabelText("Your name"), "Carla Souza");
    await userEvent.type(screen.getByLabelText("Your email"), "carla@example.com");
    await userEvent.click(screen.getByRole("button", { name: /confirm/i }));

    expect(onRsvp).toHaveBeenCalledWith({ guestName: "Carla Souza", guestEmail: "carla@example.com" });
    expect(await screen.findByText(/you're confirmed/i)).toBeInTheDocument();
  });

  it("shows an error message when the submission fails", async () => {
    const onRsvp = vi.fn().mockResolvedValue({ ok: false, error: "Already confirmed" });
    render(<RsvpForm onRsvp={onRsvp} />);

    await userEvent.type(screen.getByLabelText("Your name"), "Carla Souza");
    await userEvent.type(screen.getByLabelText("Your email"), "carla@example.com");
    await userEvent.click(screen.getByRole("button", { name: /confirm/i }));

    expect(await screen.findByText("Already confirmed")).toBeInTheDocument();
  });
});
