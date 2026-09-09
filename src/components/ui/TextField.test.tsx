import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("renders a labeled input and accepts typing", async () => {
    render(<TextField label="Email" name="email" />);
    const input = screen.getByLabelText("Email");
    await userEvent.type(input, "a@b.com");
    expect(input).toHaveValue("a@b.com");
  });

  it("shows an error message when provided", () => {
    render(<TextField label="Email" name="email" error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });
});
