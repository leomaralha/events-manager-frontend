import { render, screen } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { EventGiftsPage } from "./EventGiftsPage";

describe("EventGiftsPage", () => {
  it("lists the event's gifts and a form to add a new one", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/dashboard/events/1/gifts"]}>
          <Routes>
            <Route path="/dashboard/events/:id/gifts" element={<EventGiftsPage />} />
          </Routes>
        </MemoryRouter>,
      );
    });
    expect(await screen.findByText("Blender")).toBeInTheDocument();
    expect(screen.getByLabelText("Gift name")).toBeInTheDocument();
  });
});
