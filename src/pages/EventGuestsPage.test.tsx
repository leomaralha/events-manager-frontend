import { render, screen } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { EventGuestsPage } from "./EventGuestsPage";

describe("EventGuestsPage", () => {
  it("lists the event's RSVP'd guests", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/dashboard/events/1/guests"]}>
          <Routes>
            <Route path="/dashboard/events/:id/guests" element={<EventGuestsPage />} />
          </Routes>
        </MemoryRouter>,
      );
    });
    expect(await screen.findByText("Carla Souza")).toBeInTheDocument();
  });
});
