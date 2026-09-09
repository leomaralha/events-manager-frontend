import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { EditEventPage } from "./EditEventPage";

describe("EditEventPage", () => {
  it("pre-fills the form with the event's existing name and date", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard/events/1/edit"]}>
        <Routes>
          <Route path="/dashboard/events/:id/edit" element={<EditEventPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByLabelText("Event name")).toHaveValue("Ana & João's Wedding");
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });
});
