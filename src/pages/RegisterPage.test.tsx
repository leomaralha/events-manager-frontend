import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RegisterPage } from "./RegisterPage";

describe("RegisterPage", () => {
  it("renders the registration form", () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });
});
