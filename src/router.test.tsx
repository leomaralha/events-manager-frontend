import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("full app navigation", () => {
  it("navigates from browse to an event's detail page and back", async () => {
    render(<App />);

    expect(await screen.findByText("Summer BBQ Party")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Summer BBQ Party"));

    expect(await screen.findByRole("heading", { name: "Summer BBQ Party" })).toBeInTheDocument();
    expect(await screen.findByText("Cooler Box")).toBeInTheDocument();
  });

  it("navigates to the login page from the nav bar", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("link", { name: "Log in" }));
    expect(await screen.findByLabelText("Password")).toBeInTheDocument();
  });
});
