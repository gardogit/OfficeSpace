import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmployeeCard } from './EmployeeCard';
import { Employee } from '../../types';

const mockEmployee: Employee = {
  id: 'emp-001',
  name: 'Diego Fernández',
  position: 'Desarrollador Frontend',
  department: 'Tecnología',
  startDate: '2024-01-08T00:00:00Z',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Especialista en React y TypeScript con 3 años de experiencia.'
};

const mockEmployeeWithoutBio: Employee = {
  id: 'emp-002',
  name: 'Laura Jiménez',
  position: 'Diseñadora UX/UI',
  department: 'Diseño',
  startDate: '2024-01-10T00:00:00Z',
  avatar: 'https://example.com/avatar2.jpg'
};

describe('EmployeeCard', () => {
  it('renders employee information correctly', () => {
    render(<EmployeeCard employee={mockEmployee} />);
    
    expect(screen.getByText('Diego Fernández')).toBeInTheDocument();
    expect(screen.getByText('Desarrollador Frontend')).toBeInTheDocument();
    expect(screen.getByText('Tecnología')).toBeInTheDocument();
  });

  it('formats start date correctly', () => {
    render(<EmployeeCard employee={mockEmployee} />);
    
    // The date should be formatted in Spanish locale (text is split across elements)
    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Inicio: 7 de enero de 2024';
    })).toBeInTheDocument();
  });

  it('renders avatar with employee name', () => {
    render(<EmployeeCard employee={mockEmployee} />);
    
    const avatar = screen.getByAltText('Avatar de Diego Fernández');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('shows "Ver detalles" button when employee has bio', () => {
    render(<EmployeeCard employee={mockEmployee} />);
    
    expect(screen.getByText('Ver detalles')).toBeInTheDocument();
  });

  it('does not show "Ver detalles" button when employee has no bio', () => {
    render(<EmployeeCard employee={mockEmployeeWithoutBio} />);
    
    expect(screen.queryByText('Ver detalles')).not.toBeInTheDocument();
  });

  it('calls onViewDetails when "Ver detalles" button is clicked', () => {
    const mockOnViewDetails = vi.fn();
    render(<EmployeeCard employee={mockEmployee} onViewDetails={mockOnViewDetails} />);
    
    const viewDetailsButton = screen.getByText('Ver detalles');
    fireEvent.click(viewDetailsButton);
    
    expect(mockOnViewDetails).toHaveBeenCalledWith(mockEmployee);
    expect(mockOnViewDetails).toHaveBeenCalledTimes(1);
  });

  it('does not call onViewDetails when button is not clicked', () => {
    const mockOnViewDetails = vi.fn();
    render(<EmployeeCard employee={mockEmployee} onViewDetails={mockOnViewDetails} />);
    
    expect(mockOnViewDetails).not.toHaveBeenCalled();
  });

  it('handles missing onViewDetails prop gracefully', () => {
    render(<EmployeeCard employee={mockEmployee} />);
    
    const viewDetailsButton = screen.getByText('Ver detalles');
    
    // Should not throw error when clicked without onViewDetails prop
    expect(() => fireEvent.click(viewDetailsButton)).not.toThrow();
  });

  it('applies hover effects with proper CSS classes', () => {
    render(<EmployeeCard employee={mockEmployee} />);
    
    const cardElement = screen.getByText('Diego Fernández').closest('.bg-white');
    expect(cardElement).toHaveClass('hover:shadow-lg', 'transition-shadow');
  });

  it('has proper text styling for different elements', () => {
    render(<EmployeeCard employee={mockEmployee} />);
    
    const nameElement = screen.getByText('Diego Fernández');
    const positionElement = screen.getByText('Desarrollador Frontend');
    const departmentElement = screen.getByText('Tecnología');
    
    expect(nameElement).toHaveClass('font-semibold', 'text-gray-900');
    expect(positionElement).toHaveClass('text-primary-600', 'font-medium');
    expect(departmentElement).toHaveClass('text-gray-600');
  });

  it('centers content properly', () => {
    render(<EmployeeCard employee={mockEmployee} />);
    
    const cardContent = screen.getByText('Diego Fernández').closest('.text-center');
    expect(cardContent).toBeInTheDocument();
    
    const flexContainer = screen.getByText('Diego Fernández').closest('.flex-col');
    expect(flexContainer).toHaveClass('items-center');
  });

  it('handles employee without avatar', () => {
    const employeeWithoutAvatar: Employee = {
      ...mockEmployee,
      avatar: undefined
    };
    
    render(<EmployeeCard employee={employeeWithoutAvatar} />);
    
    // Avatar component should still render with initials
    const avatarElement = screen.getByTitle('Diego Fernández');
    expect(avatarElement).toBeInTheDocument();
  });

  it('formats different date correctly', () => {
    const employeeWithDifferentDate: Employee = {
      ...mockEmployee,
      startDate: '2023-12-25T00:00:00Z'
    };
    
    render(<EmployeeCard employee={employeeWithDifferentDate} />);
    
    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Inicio: 24 de diciembre de 2023';
    })).toBeInTheDocument();
  });
});