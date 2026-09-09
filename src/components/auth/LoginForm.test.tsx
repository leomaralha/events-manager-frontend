import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  it("submits email and password", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: true, token: "t", expiresAt: "2026-12-01" });
    render(<LoginForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Email"), "ana@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "secret123");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(onSubmit).toHaveBeenCalledWith("ana@example.com", "secret123");
  });

  it("shows an error message on failure", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: false, error: "wrong password" });
    render(<LoginForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Email"), "ana@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "wrong");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText("wrong password")).toBeInTheDocument();
  });
});
