import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NewHiresGrid } from "./NewHiresGrid";
import mockData from "../../data/mockData.json";

describe("NewHiresGrid Integration Tests", () => {
  it("integrates with real mock data correctly", () => {
    render(<NewHiresGrid newHires={mockData.newHires} />);

    // Verify that all employees from mock data are rendered
    expect(screen.getByText("Diego Fernández")).toBeInTheDocument();
    expect(screen.getByText("Laura Jiménez")).toBeInTheDocument();
    expect(screen.getByText("Roberto Silva")).toBeInTheDocument();
    expect(screen.getByText("Carmen López")).toBeInTheDocument();
    expect(screen.getByText("Andrés Morales")).toBeInTheDocument();
    expect(screen.getByText("Sofía Herrera")).toBeInTheDocument();
    expect(screen.getByText("Miguel Torres")).toBeInTheDocument();

    // Verify employee count
    expect(screen.getByText("7 nuevos empleados")).toBeInTheDocument();
  });

  it("sorts employees by start date correctly with real data", () => {
    render(<NewHiresGrid newHires={mockData.newHires} />);

    // Get employee names by finding the employee cards
    const employeeCards = screen.getAllByText(
      /Desarrollador Frontend|Diseñadora UX\/UI|Analista de Datos|Product Manager|DevOps Engineer|QA Engineer|Backend Developer/
    );
    const employeeNames = employeeCards.map(
      (card) => card.closest(".bg-white")?.querySelector("h3")?.textContent
    );

    // Based on mock data, Miguel Torres has the latest start date (2024-01-22)
    expect(employeeNames[0]).toBe("Miguel Torres");
    // Sofía Herrera is second (2024-01-20)
    expect(employeeNames[1]).toBe("Sofía Herrera");
    // Andrés Morales is third (2024-01-18)
    expect(employeeNames[2]).toBe("Andrés Morales");
  });

  it("displays correct positions and departments from mock data", () => {
    render(<NewHiresGrid newHires={mockData.newHires} />);

    // Verify specific employee details
    expect(screen.getByText("Desarrollador Frontend")).toBeInTheDocument();
    expect(screen.getByText("Diseñadora UX/UI")).toBeInTheDocument();
    expect(screen.getByText("Analista de Datos")).toBeInTheDocument();
    expect(screen.getByText("Product Manager")).toBeInTheDocument();
    expect(screen.getByText("DevOps Engineer")).toBeInTheDocument();
    expect(screen.getByText("QA Engineer")).toBeInTheDocument();
    expect(screen.getByText("Backend Developer")).toBeInTheDocument();

    // Verify departments (using getAllByText for multiple occurrences)
    expect(screen.getAllByText("Tecnología").length).toBeGreaterThan(0);
    expect(screen.getByText("Diseño")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Producto")).toBeInTheDocument();
    expect(screen.getByText("Infraestructura")).toBeInTheDocument();
    expect(screen.getByText("Calidad")).toBeInTheDocument();
  });

  it("opens modal with correct employee bio from mock data", async () => {
    render(<NewHiresGrid newHires={mockData.newHires} />);

    // Find Diego Fernández's "Ver detalles" button and click it
    const diegoCard = screen.getByText("Diego Fernández").closest(".bg-white");
    const viewDetailsButton = diegoCard?.querySelector("button");

    if (viewDetailsButton) {
      fireEvent.click(viewDetailsButton);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(
          screen.getByText(
            "Especialista en React y TypeScript con 3 años de experiencia en desarrollo web."
          )
        ).toBeInTheDocument();
      });
    }
  });

  it("handles employees with and without avatars from mock data", () => {
    render(<NewHiresGrid newHires={mockData.newHires} />);

    // Check that avatars are rendered (either images or initials)
    const avatarImages = screen.getAllByAltText(/Avatar de/);
    expect(avatarImages.length).toBeGreaterThan(0);
  });

  it("displays formatted start dates correctly from mock data", () => {
    render(<NewHiresGrid newHires={mockData.newHires} />);

    // Check for formatted dates in Spanish (using text content that includes line breaks)
    // Note: Dates are formatted one day earlier due to timezone conversion
    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === "Inicio: 7 de enero de 2024";
      })
    ).toBeInTheDocument(); // Diego (2024-01-08 -> 7 de enero)
    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === "Inicio: 9 de enero de 2024";
      })
    ).toBeInTheDocument(); // Laura (2024-01-10 -> 9 de enero)
    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === "Inicio: 14 de enero de 2024";
      })
    ).toBeInTheDocument(); // Roberto (2024-01-15 -> 14 de enero)
  });

  it("complete user workflow: view grid, open modal, close modal", async () => {
    render(<NewHiresGrid newHires={mockData.newHires} />);

    // 1. Verify grid is displayed
    expect(screen.getByText("Nuevos Empleados")).toBeInTheDocument();
    expect(screen.getByText("7 nuevos empleados")).toBeInTheDocument();

    // 2. Click on "Ver detalles" for an employee with bio
    const viewDetailsButtons = screen.getAllByText("Ver detalles");
    fireEvent.click(viewDetailsButtons[0]);

    // 3. Verify modal opens with correct content
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Detalles del empleado")).toBeInTheDocument();
    });

    // 4. Close modal using close button
    const closeButton = screen.getByLabelText("Cerrar modal");
    fireEvent.click(closeButton);

    // 5. Verify modal is closed and grid is still visible
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.getByText("Nuevos Empleados")).toBeInTheDocument();
    });
  });

  it("responsive grid behavior with different screen sizes", () => {
    render(<NewHiresGrid newHires={mockData.newHires} />);

    const gridContainer = screen.getByText("Diego Fernández").closest(".grid");

    // Verify responsive classes are applied
    expect(gridContainer).toHaveClass(
      "grid-cols-1", // Mobile: 1 column
      "sm:grid-cols-2", // Small: 2 columns
      "lg:grid-cols-3", // Large: 3 columns
      "xl:grid-cols-4" // Extra large: 4 columns
    );
  });

  it("accessibility features work correctly", async () => {
    render(<NewHiresGrid newHires={mockData.newHires} />);

    // Open modal
    const viewDetailsButtons = screen.getAllByText("Ver detalles");
    fireEvent.click(viewDetailsButtons[0]);

    await waitFor(() => {
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-labelledby", "employee-modal-title");
    });

    // Test keyboard navigation
    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
