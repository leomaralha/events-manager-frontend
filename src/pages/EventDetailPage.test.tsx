import { render, screen } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { EventDetailPage } from "./EventDetailPage";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/events/:slug" element={<EventDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

// Rendering is wrapped in React's async `act` because EventDetailPage's
// EventDetail and GiftList suspend on mount via `use()`; React Testing
// Library's `render` only wraps the initial mount in a synchronous act call,
// which leaves the Suspense retry unable to fire once the (already-resolved)
// promise settles.
describe("EventDetailPage", () => {
  it("renders the event's details and gift list for a known slug", async () => {
    await act(async () => {
      renderAt("/events/summer-bbq");
    });
    expect(screen.getByText("Summer BBQ Party")).toBeInTheDocument();
    expect(screen.getByText("Cooler Box")).toBeInTheDocument();
  });
});
