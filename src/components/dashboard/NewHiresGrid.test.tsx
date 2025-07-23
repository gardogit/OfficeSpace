import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NewHiresGrid } from './NewHiresGrid';
import { Employee } from '../../types';

// Mock data for testing
const mockEmployees: Employee[] = [
  {
    id: 'emp-001',
    name: 'Diego Fernández',
    position: 'Desarrollador Frontend',
    department: 'Tecnología',
    startDate: '2024-01-08T00:00:00Z',
    avatar: 'https://example.com/avatar1.jpg',
    bio: 'Especialista en React y TypeScript con 3 años de experiencia.'
  },
  {
    id: 'emp-002',
    name: 'Laura Jiménez',
    position: 'Diseñadora UX/UI',
    department: 'Diseño',
    startDate: '2024-01-10T00:00:00Z',
    avatar: 'https://example.com/avatar2.jpg',
    bio: 'Diseñadora con pasión por crear experiencias intuitivas.'
  },
  {
    id: 'emp-003',
    name: 'Roberto Silva',
    position: 'Analista de Datos',
    department: 'Analytics',
    startDate: '2024-01-15T00:00:00Z',
    bio: 'Experto en análisis de datos y machine learning.'
  }
];

describe('NewHiresGrid', () => {
  it('renders with default title', () => {
    render(<NewHiresGrid newHires={mockEmployees} />);
    
    expect(screen.getByText('Nuevos Empleados')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    const customTitle = 'Empleados Recientes';
    render(<NewHiresGrid newHires={mockEmployees} title={customTitle} />);
    
    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  it('renders all employee cards', () => {
    render(<NewHiresGrid newHires={mockEmployees} />);
    
    expect(screen.getByText('Diego Fernández')).toBeInTheDocument();
    expect(screen.getByText('Laura Jiménez')).toBeInTheDocument();
    expect(screen.getByText('Roberto Silva')).toBeInTheDocument();
  });

  it('displays employee information correctly', () => {
    render(<NewHiresGrid newHires={mockEmployees} />);
    
    // Check first employee details
    expect(screen.getByText('Diego Fernández')).toBeInTheDocument();
    expect(screen.getByText('Desarrollador Frontend')).toBeInTheDocument();
    expect(screen.getByText('Tecnología')).toBeInTheDocument();
  });

  it('sorts employees by start date (most recent first)', () => {
    render(<NewHiresGrid newHires={mockEmployees} />);
    
    // Get employee names specifically (excluding the card title)
    const employeeCards = screen.getAllByText(/Desarrollador Frontend|Diseñadora UX\/UI|Analista de Datos/);
    const employeeNames = employeeCards.map(card => 
      card.closest('.bg-white')?.querySelector('h3')?.textContent
    );
    
    // Roberto Silva has the most recent start date (2024-01-15)
    expect(employeeNames[0]).toBe('Roberto Silva');
    // Laura Jiménez is second (2024-01-10)
    expect(employeeNames[1]).toBe('Laura Jiménez');
    // Diego Fernández is third (2024-01-08)
    expect(employeeNames[2]).toBe('Diego Fernández');
  });

  it('displays employee count', () => {
    render(<NewHiresGrid newHires={mockEmployees} />);
    
    expect(screen.getByText('3 nuevos empleados')).toBeInTheDocument();
  });

  it('displays singular form for single employee', () => {
    render(<NewHiresGrid newHires={[mockEmployees[0]]} />);
    
    expect(screen.getByText('1 nuevo empleado')).toBeInTheDocument();
  });

  it('shows empty state when no employees', () => {
    render(<NewHiresGrid newHires={[]} />);
    
    expect(screen.getByText('No hay nuevos empleados para mostrar')).toBeInTheDocument();
    expect(screen.queryByText('nuevos empleados')).not.toBeInTheDocument();
  });

  it('opens modal when "Ver detalles" is clicked', async () => {
    render(<NewHiresGrid newHires={mockEmployees} />);
    
    // Find and click the first "Ver detalles" button
    const viewDetailsButtons = screen.getAllByText('Ver detalles');
    fireEvent.click(viewDetailsButtons[0]);
    
    // Check if modal is opened
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Detalles del empleado')).toBeInTheDocument();
    });
  });

  it('displays employee bio in modal', async () => {
    render(<NewHiresGrid newHires={mockEmployees} />);
    
    // Click on Diego's "Ver detalles" button
    const viewDetailsButtons = screen.getAllByText('Ver detalles');
    fireEvent.click(viewDetailsButtons[2]); // Diego is third in sorted order
    
    await waitFor(() => {
      expect(screen.getByText('Especialista en React y TypeScript con 3 años de experiencia.')).toBeInTheDocument();
    });
  });

  it('closes modal when close button is clicked', async () => {
    render(<NewHiresGrid newHires={mockEmployees} />);
    
    // Open modal
    const viewDetailsButtons = screen.getAllByText('Ver detalles');
    fireEvent.click(viewDetailsButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    // Close modal
    const closeButton = screen.getByLabelText('Cerrar modal');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes modal when backdrop is clicked', async () => {
    render(<NewHiresGrid newHires={mockEmployees} />);
    
    // Open modal
    const viewDetailsButtons = screen.getAllByText('Ver detalles');
    fireEvent.click(viewDetailsButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    // Click backdrop (the modal overlay itself)
    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes modal when Escape key is pressed', async () => {
    render(<NewHiresGrid newHires={mockEmployees} />);
    
    // Open modal
    const viewDetailsButtons = screen.getAllByText('Ver detalles');
    fireEvent.click(viewDetailsButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    // Press Escape key
    fireEvent.keyDown(document, { key: 'Escape' });
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    const customClass = 'custom-grid-class';
    render(<NewHiresGrid newHires={mockEmployees} className={customClass} />);
    
    const cardElement = screen.getByText('Nuevos Empleados').closest('.custom-grid-class');
    expect(cardElement).toBeInTheDocument();
  });

  it('has proper responsive grid classes', () => {
    render(<NewHiresGrid newHires={mockEmployees} />);
    
    const gridContainer = screen.getByText('Diego Fernández').closest('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4');
  });

  it('does not show "Ver detalles" button for employees without bio', () => {
    const employeeWithoutBio: Employee = {
      id: 'emp-no-bio',
      name: 'Sin Bio',
      position: 'Tester',
      department: 'QA',
      startDate: '2024-01-01T00:00:00Z'
    };
    
    render(<NewHiresGrid newHires={[employeeWithoutBio]} />);
    
    expect(screen.queryByText('Ver detalles')).not.toBeInTheDocument();
  });
});