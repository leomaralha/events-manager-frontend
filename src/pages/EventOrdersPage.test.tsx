import { render, screen } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { EventOrdersPage } from "./EventOrdersPage";

describe("EventOrdersPage", () => {
  it("lists the event's claimed-gift orders", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/dashboard/events/1/orders"]}>
          <Routes>
            <Route path="/dashboard/events/:id/orders" element={<EventOrdersPage />} />
          </Routes>
        </MemoryRouter>,
      );
    });
    expect(await screen.findByText("Bed Sheets")).toBeInTheDocument();
  });
});
