import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { EventDetailPage } from "./EventDetailPage";

// Rendering is wrapped in React's async `act` because EventDetailPage's
// EventDetail and GiftList suspend on mount via `use()`; React Testing
// Library's `render` only wraps the initial mount in a synchronous act call,
// which leaves the Suspense retry unable to fire once the (already-resolved)
// promise settles.
async function renderAt(path: string) {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/events/:slug" element={<EventDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
  });
}

describe("EventDetailPage", () => {
  it("renders the event's details and gift list for a known slug", async () => {
    await renderAt("/events/summer-bbq");
    expect(await screen.findByText("Summer BBQ Party")).toBeInTheDocument();
    expect(await screen.findByText("Cooler Box")).toBeInTheDocument();
  });

  it("lets a guest RSVP", async () => {
    await renderAt("/events/summer-bbq");
    await screen.findByText("Summer BBQ Party");

    await userEvent.type(screen.getByLabelText("Your name"), "Carla Souza");
    await userEvent.type(screen.getByLabelText("Your email"), "carla@example.com");
    await userEvent.click(screen.getByRole("button", { name: /confirm/i }));

    expect(await screen.findByText(/you're confirmed/i)).toBeInTheDocument();
  });

  it("lets a guest claim an unclaimed gift", async () => {
    await renderAt("/events/summer-bbq");
    await screen.findByText("Cooler Box");

    await userEvent.click(screen.getByRole("button", { name: /claim this gift/i }));
    const nameFields = screen.getAllByLabelText("Your name");
    const emailFields = screen.getAllByLabelText("Your email");
    await userEvent.type(nameFields[nameFields.length - 1], "Bruno Lima");
    await userEvent.type(emailFields[emailFields.length - 1], "bruno@example.com");
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText(/thanks for claiming/i)).toBeInTheDocument();
  });
});
