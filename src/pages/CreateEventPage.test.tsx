import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CreateEventPage } from "./CreateEventPage";

describe("CreateEventPage", () => {
  it("renders an empty event form with a create label", () => {
    render(<CreateEventPage />);
    expect(screen.getByLabelText("Event name")).toHaveValue("");
    expect(screen.getByRole("button", { name: "Create event" })).toBeInTheDocument();
  });
});
