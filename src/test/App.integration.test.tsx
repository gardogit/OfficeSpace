import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";

describe("App Integration", () => {
  it("renders all main dashboard components", () => {
    render(<App />);

    // Check that header is rendered
    expect(screen.getByRole("banner")).toBeInTheDocument();

    // Check that main content sections are rendered (titles were removed from Inicio section)
    // News carousel should be present
    expect(
      screen.getByRole("region", { name: /carrusel de noticias/i })
    ).toBeInTheDocument();

    // Check that sidebar tabs are rendered
    expect(screen.getByRole("tab", { name: /enlaces/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /espacios/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /apps/i })).toBeInTheDocument();
  });

  it("verifies complete dashboard integration", () => {
    render(<App />);

    // Verify all major components are integrated
    expect(screen.getByText("Corporate Hub")).toBeInTheDocument(); // Header
    expect(screen.getByRole("tab", { name: /inicio/i })).toBeInTheDocument(); // Navigation

    // Main content (titles removed from Inicio section)
    expect(
      screen.getByRole("region", { name: /carrusel de noticias/i })
    ).toBeInTheDocument(); // News

    // Sidebar tabs (new implementation)
    expect(screen.getByRole("tab", { name: /enlaces/i })).toBeInTheDocument(); // Quick Links tab
    expect(screen.getByRole("tab", { name: /espacios/i })).toBeInTheDocument(); // Spaces tab
    expect(screen.getByRole("tab", { name: /apps/i })).toBeInTheDocument(); // Apps tab
  });
});
