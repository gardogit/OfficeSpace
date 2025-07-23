import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NavigationBar, NavigationSection } from '../components/layout/NavigationBar';

// Mock sections for testing
const mockSections: NavigationSection[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'noticias', label: 'Noticias' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'equipo', label: 'Equipo' }
];

describe('NavigationBar', () => {
  it('renders all navigation sections', () => {
    render(<NavigationBar sections={mockSections} />);
    
    mockSections.forEach(section => {
      expect(screen.getByText(section.label)).toBeInTheDocument();
    });
  });

  it('marks first section as active by default', () => {
    render(<NavigationBar sections={mockSections} />);
    
    const firstSection = screen.getByText('Inicio');
    expect(firstSection).toHaveClass('text-blue-600');
    expect(firstSection).toHaveClass('border-b-2');
    expect(firstSection).toHaveClass('border-blue-600');
  });

  it('marks specified active section', () => {
    render(<NavigationBar sections={mockSections} activeSection="noticias" />);
    
    const activeSection = screen.getByText('Noticias');
    expect(activeSection).toHaveClass('text-blue-600');
    expect(activeSection).toHaveClass('border-b-2');
    expect(activeSection).toHaveClass('border-blue-600');
    
    const inactiveSection = screen.getByText('Inicio');
    expect(inactiveSection).toHaveClass('text-gray-500');
  });

  it('calls onSectionChange when section is clicked', () => {
    const mockOnSectionChange = vi.fn();
    render(
      <NavigationBar 
        sections={mockSections} 
        onSectionChange={mockOnSectionChange}
      />
    );
    
    const noticiasSection = screen.getByText('Noticias');
    fireEvent.click(noticiasSection);
    
    expect(mockOnSectionChange).toHaveBeenCalledWith('noticias');
  });

  it('updates active section on click when not controlled', () => {
    render(<NavigationBar sections={mockSections} />);
    
    const noticiasSection = screen.getByText('Noticias');
    fireEvent.click(noticiasSection);
    
    expect(noticiasSection).toHaveClass('text-blue-600');
    expect(noticiasSection).toHaveClass('border-b-2');
    expect(noticiasSection).toHaveClass('border-blue-600');
  });

  it('supports keyboard navigation', () => {
    const mockOnSectionChange = vi.fn();
    render(
      <NavigationBar 
        sections={mockSections} 
        onSectionChange={mockOnSectionChange}
      />
    );
    
    const noticiasSection = screen.getByText('Noticias');
    
    // Test Enter key
    fireEvent.keyDown(noticiasSection, { key: 'Enter' });
    expect(mockOnSectionChange).toHaveBeenCalledWith('noticias');
    
    // Test Space key
    fireEvent.keyDown(noticiasSection, { key: ' ' });
    expect(mockOnSectionChange).toHaveBeenCalledWith('noticias');
  });

  it('prevents default behavior on click and keyboard events', () => {
    render(<NavigationBar sections={mockSections} />);
    
    const noticiasSection = screen.getByText('Noticias');
    
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
    
    fireEvent(noticiasSection, clickEvent);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(<NavigationBar sections={mockSections} activeSection="inicio" />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Navegación principal');
    
    const inicioSection = screen.getByText('Inicio');
    expect(inicioSection).toHaveAttribute('role', 'tab');
    expect(inicioSection).toHaveAttribute('aria-selected', 'true');
    expect(inicioSection).toHaveAttribute('aria-controls', 'panel-inicio');
    expect(inicioSection).toHaveAttribute('tabIndex', '0');
    
    const noticiasSection = screen.getByText('Noticias');
    expect(noticiasSection).toHaveAttribute('aria-selected', 'false');
  });

  it('applies hover styles to inactive sections', () => {
    render(<NavigationBar sections={mockSections} activeSection="inicio" />);
    
    const noticiasSection = screen.getByText('Noticias');
    expect(noticiasSection).toHaveClass('hover:text-gray-700');
    expect(noticiasSection).toHaveClass('hover:border-b-2');
    expect(noticiasSection).toHaveClass('hover:border-gray-300');
  });

  it('renders with custom className', () => {
    const { container } = render(
      <NavigationBar sections={mockSections} className="custom-class" />
    );
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('handles empty sections array gracefully', () => {
    render(<NavigationBar sections={[]} />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav.querySelector('a')).toBeNull();
  });

  it('shows visual indicator for active section', () => {
    render(<NavigationBar sections={mockSections} activeSection="inicio" />);
    
    const inicioSection = screen.getByText('Inicio');
    const indicator = inicioSection.querySelector('span[aria-hidden="true"]');
    
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass('bg-blue-600');
    expect(indicator).toHaveClass('h-0.5');
  });

  it('maintains focus management', () => {
    render(<NavigationBar sections={mockSections} />);
    
    const sections = screen.getAllByRole('tab');
    sections.forEach(section => {
      expect(section).toHaveClass('focus:outline-none');
      expect(section).toHaveClass('focus:ring-2');
      expect(section).toHaveClass('focus:ring-blue-500');
    });
  });
});