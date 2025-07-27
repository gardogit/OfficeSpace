import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { QuickLinks } from "./QuickLinks";
import { QuickLink } from "../../types";

// Mock de window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, "open", {
  value: mockWindowOpen,
  writable: true,
});

describe("QuickLinks", () => {
  const mockLinks: QuickLink[] = [
    {
      id: "link-001",
      title: "Portal de Empleados",
      url: "https://portal.empresa.com",
      category: "Recursos Humanos",
      icon: "👥",
    },
    {
      id: "link-002",
      title: "Sistema de Tickets",
      url: "https://tickets.empresa.com",
      category: "Soporte IT",
      icon: "🎫",
    },
    {
      id: "link-003",
      title: "Documentación Técnica",
      url: "https://docs.empresa.com",
      category: "Desarrollo",
      icon: "📚",
    },
    {
      id: "link-004",
      title: "Repositorio de Código",
      url: "https://git.empresa.com",
      category: "Desarrollo",
      icon: "💻",
    },
  ];

  beforeEach(() => {
    mockWindowOpen.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderizado básico", () => {
    it("renderiza correctamente con enlaces", () => {
      render(<QuickLinks links={mockLinks} />);

      // Verificar que se renderiza el componente
      expect(
        screen.getByRole("navigation", { name: "Enlaces rápidos" })
      ).toBeInTheDocument();
    });

    it("renderiza mensaje cuando no hay enlaces", () => {
      render(<QuickLinks links={[]} />);

      expect(
        screen.getByText("No hay enlaces rápidos disponibles")
      ).toBeInTheDocument();
    });

    it("aplica className personalizado", () => {
      const { container } = render(
        <QuickLinks links={mockLinks} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Agrupación por categorías", () => {
    it("agrupa enlaces por categoría correctamente", () => {
      render(<QuickLinks links={mockLinks} />);

      // Verificar headers de categorías (convertidas a mayúsculas)
      expect(screen.getByText(/recursos humanos/i)).toBeInTheDocument();
      expect(screen.getByText(/soporte it/i)).toBeInTheDocument();
      expect(screen.getByText(/desarrollo/i)).toBeInTheDocument();
    });

    it("muestra enlaces bajo sus categorías correspondientes", () => {
      render(<QuickLinks links={mockLinks} />);

      // Verificar que los enlaces están presentes
      expect(screen.getByText("Portal de Empleados")).toBeInTheDocument();
      expect(screen.getByText("Sistema de Tickets")).toBeInTheDocument();
      expect(screen.getByText("Documentación Técnica")).toBeInTheDocument();
      expect(screen.getByText("Repositorio de Código")).toBeInTheDocument();
    });

    it("agrupa múltiples enlaces en la misma categoría", () => {
      render(<QuickLinks links={mockLinks} />);

      // La categoría "Desarrollo" debe tener 2 enlaces
      const desarrolloSection = screen.getByText(/desarrollo/i).closest("div");
      const desarrolloLinks = desarrolloSection?.querySelectorAll("button");
      expect(desarrolloLinks).toHaveLength(2);
    });
  });

  describe("Iconos y elementos visuales", () => {
    it("muestra iconos cuando están disponibles", () => {
      render(<QuickLinks links={mockLinks} />);

      // Los iconos se renderizan como texto emoji
      expect(screen.getByText("👥")).toBeInTheDocument();
      expect(screen.getByText("🎫")).toBeInTheDocument();
      expect(screen.getByText("📚")).toBeInTheDocument();
      expect(screen.getByText("💻")).toBeInTheDocument();
    });

    it("muestra indicador de enlace externo", () => {
      render(<QuickLinks links={mockLinks} />);

      // Verificar que hay iconos de enlace externo (SVG)
      const externalLinkIcons = screen.getAllByRole("img", { hidden: true });
      expect(externalLinkIcons.length).toBeGreaterThan(0);
    });

    it("maneja enlaces sin icono correctamente", () => {
      const linksWithoutIcon: QuickLink[] = [
        {
          id: "link-no-icon",
          title: "Enlace sin icono",
          url: "https://example.com",
          category: "Test",
        },
      ];

      render(<QuickLinks links={linksWithoutIcon} />);

      expect(screen.getByText("Enlace sin icono")).toBeInTheDocument();
    });
  });

  describe("Navegación y interacción", () => {
    it("abre enlace en nueva pestaña al hacer clic", () => {
      render(<QuickLinks links={mockLinks} />);

      const portalLink = screen.getByText("Portal de Empleados");
      fireEvent.click(portalLink);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        "https://portal.empresa.com",
        "_blank",
        "noopener,noreferrer"
      );
    });

    it("maneja múltiples clics en diferentes enlaces", () => {
      render(<QuickLinks links={mockLinks} />);

      fireEvent.click(screen.getByText("Portal de Empleados"));
      fireEvent.click(screen.getByText("Sistema de Tickets"));

      expect(mockWindowOpen).toHaveBeenCalledTimes(2);
      expect(mockWindowOpen).toHaveBeenNthCalledWith(
        1,
        "https://portal.empresa.com",
        "_blank",
        "noopener,noreferrer"
      );
      expect(mockWindowOpen).toHaveBeenNthCalledWith(
        2,
        "https://tickets.empresa.com",
        "_blank",
        "noopener,noreferrer"
      );
    });
  });

  describe("Accesibilidad", () => {
    it("tiene rol de navegación apropiado", () => {
      render(<QuickLinks links={mockLinks} />);

      expect(
        screen.getByRole("navigation", { name: "Enlaces rápidos" })
      ).toBeInTheDocument();
    });

    it("botones tienen etiquetas aria apropiadas", () => {
      render(<QuickLinks links={mockLinks} />);

      expect(
        screen.getByLabelText("Abrir Portal de Empleados en nueva pestaña")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Abrir Sistema de Tickets en nueva pestaña")
      ).toBeInTheDocument();
    });

    it("iconos tienen aria-hidden apropiado", () => {
      render(<QuickLinks links={mockLinks} />);

      const emojiIcons = screen.getAllByRole("img", { hidden: true });
      emojiIcons.forEach((icon) => {
        expect(icon).toHaveAttribute("aria-hidden", "true");
      });
    });

    it("botones son focusables y tienen estilos de focus", () => {
      render(<QuickLinks links={mockLinks} />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveClass(
          "focus:outline-none",
          "focus:ring-2",
          "focus:ring-blue-500"
        );
      });
    });
  });

  describe("Estilos y clases CSS", () => {
    it("aplica estilos hover correctamente", () => {
      render(<QuickLinks links={mockLinks} />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveClass("hover:text-gray-900", "hover:bg-gray-50");
      });
    });

    it("headers de categoría tienen estilos apropiados", () => {
      render(<QuickLinks links={mockLinks} />);

      const categoryHeaders = screen.getAllByRole("heading", { level: 3 });
      categoryHeaders.forEach((header) => {
        expect(header).toHaveClass(
          "text-sm",
          "font-medium",
          "text-gray-700",
          "uppercase",
          "tracking-wide"
        );
      });
    });

    it("enlaces tienen truncate para texto largo", () => {
      const longTitleLink: QuickLink[] = [
        {
          id: "long-link",
          title:
            "Este es un título muy largo que debería ser truncado para evitar problemas de layout",
          url: "https://example.com",
          category: "Test",
          icon: "📝",
        },
      ];

      render(<QuickLinks links={longTitleLink} />);

      const linkText = screen.getByText(
        "Este es un título muy largo que debería ser truncado para evitar problemas de layout"
      );
      expect(linkText).toHaveClass("truncate");
    });
  });

  describe("Casos edge", () => {
    it("maneja categorías con caracteres especiales", () => {
      const specialCategoryLinks: QuickLink[] = [
        {
          id: "special-1",
          title: "Enlace especial",
          url: "https://example.com",
          category: "Categoría con Ñ & Símbolos!",
          icon: "⚡",
        },
      ];

      render(<QuickLinks links={specialCategoryLinks} />);

      expect(
        screen.getByText(/categoría con ñ & símbolos!/i)
      ).toBeInTheDocument();
    });

    it("maneja URLs malformadas sin romper el componente", () => {
      const malformedUrlLinks: QuickLink[] = [
        {
          id: "malformed",
          title: "Enlace con URL malformada",
          url: "not-a-valid-url",
          category: "Test",
        },
      ];

      render(<QuickLinks links={malformedUrlLinks} />);

      const link = screen.getByText("Enlace con URL malformada");
      fireEvent.click(link);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        "not-a-valid-url",
        "_blank",
        "noopener,noreferrer"
      );
    });

    it("maneja lista vacía de enlaces", () => {
      render(<QuickLinks links={[]} />);

      expect(
        screen.getByText("No hay enlaces rápidos disponibles")
      ).toBeInTheDocument();
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });
  });
});
