import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ThemeProvider } from "../contexts/ThemeContext";
import { SidebarTabs } from "../components/layout/SidebarTabs";
import mockData from "../data/mockData.json";

// Mock window.matchMedia for theme context
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

const SidebarTabsWithTheme = () => (
  <ThemeProvider>
    <SidebarTabs
      quickLinks={mockData.quickLinks}
      spaces={mockData.spaces}
      applications={mockData.applications}
    />
  </ThemeProvider>
);

// Mock window.innerWidth
const mockWindowWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event("resize"));
};

describe("SidebarTabs Responsive", () => {
  beforeEach(() => {
    // Reset to desktop size
    mockWindowWidth(1200);
  });

  afterEach(() => {
    // Clean up
    mockWindowWidth(1200);
  });

  it("shows content panel by default on desktop", () => {
    render(<SidebarTabsWithTheme />);

    // Content should be visible on desktop
    expect(screen.getByText("Portal de Empleados")).toBeInTheDocument();

    // No close button should be visible on desktop
    expect(screen.queryByLabelText("Cerrar panel")).not.toBeInTheDocument();
  });

  it("hides content panel on mobile by default", async () => {
    // Start with mobile size
    mockWindowWidth(800);
    render(<SidebarTabsWithTheme />);

    // Content should be hidden on mobile initially
    expect(screen.queryByText("Portal de Empleados")).not.toBeInTheDocument();
  });

  it("shows content panel when tab is clicked on mobile", async () => {
    // Start with mobile size
    mockWindowWidth(800);
    render(<SidebarTabsWithTheme />);

    // Click on Enlaces tab
    const enlacesTab = screen.getByRole("tab", { name: /enlaces/i });
    fireEvent.click(enlacesTab);

    await waitFor(() => {
      // Content should now be visible
      expect(screen.getByText("Portal de Empleados")).toBeInTheDocument();
      // Close button should be visible
      expect(screen.getByLabelText("Cerrar panel")).toBeInTheDocument();
    });
  });

  it("toggles content panel when same tab is clicked twice on mobile", async () => {
    render(<SidebarTabsWithTheme />);

    // Switch to mobile
    mockWindowWidth(800);

    const enlacesTab = screen.getByRole("tab", { name: /enlaces/i });

    // First click - show content
    fireEvent.click(enlacesTab);

    await waitFor(() => {
      expect(screen.getByText("Portal de Empleados")).toBeInTheDocument();
    });

    // Second click - hide content
    fireEvent.click(enlacesTab);

    await waitFor(() => {
      expect(screen.queryByText("Portal de Empleados")).not.toBeInTheDocument();
    });
  });

  it("switches content when different tab is clicked on mobile", async () => {
    render(<SidebarTabsWithTheme />);

    // Switch to mobile
    mockWindowWidth(800);

    // Click on Enlaces tab
    const enlacesTab = screen.getByRole("tab", { name: /enlaces/i });
    fireEvent.click(enlacesTab);

    await waitFor(() => {
      expect(screen.getByText("Portal de Empleados")).toBeInTheDocument();
    });

    // Click on Espacios tab
    const espaciosTab = screen.getByRole("tab", { name: /espacios/i });
    fireEvent.click(espaciosTab);

    await waitFor(() => {
      // Should show spaces content
      expect(screen.getByText("Proyecto Alpha")).toBeInTheDocument();
      // Should still show close button
      expect(screen.getByLabelText("Cerrar panel")).toBeInTheDocument();
    });
  });

  it("closes content panel when close button is clicked on mobile", async () => {
    render(<SidebarTabsWithTheme />);

    // Switch to mobile
    mockWindowWidth(800);

    // Open content panel
    const enlacesTab = screen.getByRole("tab", { name: /enlaces/i });
    fireEvent.click(enlacesTab);

    await waitFor(() => {
      expect(screen.getByText("Portal de Empleados")).toBeInTheDocument();
    });

    // Click close button
    const closeButton = screen.getByLabelText("Cerrar panel");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText("Portal de Empleados")).not.toBeInTheDocument();
    });
  });

  it("shows overlay background on mobile when content is open", async () => {
    render(<SidebarTabsWithTheme />);

    // Switch to mobile
    mockWindowWidth(800);

    // Open content panel
    const enlacesTab = screen.getByRole("tab", { name: /enlaces/i });
    fireEvent.click(enlacesTab);

    await waitFor(() => {
      // Check for overlay (it has aria-hidden="true")
      const overlay = document.querySelector(
        ".fixed.inset-0.bg-black.bg-opacity-50"
      );
      expect(overlay).toBeInTheDocument();
    });
  });

  it("closes content when overlay is clicked on mobile", async () => {
    render(<SidebarTabsWithTheme />);

    // Switch to mobile
    mockWindowWidth(800);

    // Open content panel
    const enlacesTab = screen.getByRole("tab", { name: /enlaces/i });
    fireEvent.click(enlacesTab);

    await waitFor(() => {
      expect(screen.getByText("Portal de Empleados")).toBeInTheDocument();
    });

    // Click overlay
    const overlay = document.querySelector(
      ".fixed.inset-0.bg-black.bg-opacity-50"
    );
    if (overlay) {
      fireEvent.click(overlay);
    }

    await waitFor(() => {
      expect(screen.queryByText("Portal de Empleados")).not.toBeInTheDocument();
    });
  });

  it("shows correct tab title in mobile header", async () => {
    render(<SidebarTabsWithTheme />);

    // Switch to mobile
    mockWindowWidth(800);

    // Open Enlaces tab
    const enlacesTab = screen.getByRole("tab", { name: /enlaces/i });
    fireEvent.click(enlacesTab);

    await waitFor(() => {
      expect(screen.getByText("Enlaces")).toBeInTheDocument();
    });

    // Switch to Espacios tab
    const espaciosTab = screen.getByRole("tab", { name: /espacios/i });
    fireEvent.click(espaciosTab);

    await waitFor(() => {
      expect(screen.getByText("Espacios")).toBeInTheDocument();
    });
  });

  it("automatically hides content when switching from desktop to mobile", async () => {
    render(<SidebarTabsWithTheme />);

    // Start on desktop - content should be visible
    expect(screen.getByText("Portal de Empleados")).toBeInTheDocument();

    // Switch to mobile
    mockWindowWidth(800);

    await waitFor(() => {
      // Content should be hidden
      expect(screen.queryByText("Portal de Empleados")).not.toBeInTheDocument();
    });
  });
});
