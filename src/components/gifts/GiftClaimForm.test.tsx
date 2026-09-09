import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GiftClaimForm } from "./GiftClaimForm";
import type { Gift } from "../../types/domain";

const gift: Gift = { id: 1, eventId: 1, name: "Blender", price: 250, claimed: false };

describe("GiftClaimForm", () => {
  it("opens a form and submits claim details", async () => {
    const onClaim = vi.fn().mockResolvedValue({ ok: true });
    render(<GiftClaimForm gift={gift} onClaim={onClaim} />);

    await userEvent.click(screen.getByRole("button", { name: /claim this gift/i }));
    await userEvent.type(screen.getByLabelText("Your name"), "Bruno Lima");
    await userEvent.type(screen.getByLabelText("Your email"), "bruno@example.com");
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(onClaim).toHaveBeenCalledWith({
      guestName: "Bruno Lima",
      guestEmail: "bruno@example.com",
      message: "",
    });
    expect(await screen.findByText(/thanks for claiming/i)).toBeInTheDocument();
  });

  it("shows an error when the claim fails", async () => {
    const onClaim = vi.fn().mockResolvedValue({ ok: false, error: "Already claimed" });
    render(<GiftClaimForm gift={gift} onClaim={onClaim} />);

    await userEvent.click(screen.getByRole("button", { name: /claim this gift/i }));
    await userEvent.type(screen.getByLabelText("Your name"), "Bruno Lima");
    await userEvent.type(screen.getByLabelText("Your email"), "bruno@example.com");
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText("Already claimed")).toBeInTheDocument();
  });
});
