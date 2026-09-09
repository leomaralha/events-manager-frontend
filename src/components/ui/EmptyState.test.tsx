import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders the given message", () => {
    render(<EmptyState message="No events yet" />);
    expect(screen.getByText("No events yet")).toBeInTheDocument();
  });
});
