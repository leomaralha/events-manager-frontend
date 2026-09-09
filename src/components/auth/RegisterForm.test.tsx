import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RegisterForm } from "./RegisterForm";

describe("RegisterForm", () => {
  it("submits name, email, and password", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: true });
    render(<RegisterForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Name"), "Ana Silva");
    await userEvent.type(screen.getByLabelText("Email"), "ana@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "secret123");
    await userEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Ana Silva",
      email: "ana@example.com",
      password: "secret123",
    });
  });

  it("shows an error message on failure", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: false, error: "Email already in use" });
    render(<RegisterForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Name"), "Ana Silva");
    await userEvent.type(screen.getByLabelText("Email"), "ana@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "secret123");
    await userEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(await screen.findByText("Email already in use")).toBeInTheDocument();
  });
});
