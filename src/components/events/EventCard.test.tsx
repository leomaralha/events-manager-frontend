import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { EventCard } from "./EventCard";

describe("EventCard", () => {
  it("renders the event name, date, and a link to its href", () => {
    render(
      <MemoryRouter>
        <EventCard
          event={{ id: 1, slug: "summer-bbq", name: "Summer BBQ Party", date: "2026-07-20" }}
          href="/events/summer-bbq"
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Summer BBQ Party")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/events/summer-bbq");
  });
});
