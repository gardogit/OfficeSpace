import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EmployeeModal } from './EmployeeModal';
import { Employee } from '../../types';

const mockEmployee: Employee = {
  id: 'emp-001',
  name: 'Diego Fernández',
  position: 'Desarrollador Frontend',
  department: 'Tecnología',
  startDate: '2024-01-08T00:00:00Z',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Especialista en React y TypeScript con 3 años de experiencia en desarrollo web.'
};

const mockEmployeeWithoutBio: Employee = {
  id: 'emp-002',
  name: 'Laura Jiménez',
  position: 'Diseñadora UX/UI',
  department: 'Diseño',
  startDate: '2024-01-10T00:00:00Z',
  avatar: 'https://example.com/avatar2.jpg'
};

describe('EmployeeModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  afterEach(() => {
    // Clean up any body style changes
    document.body.style.overflow = 'unset';
  });

  it('does not render when isOpen is false', () => {
    render(
      <EmployeeModal
        employee={mockEmployee}
        isOpen={false}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not render when employee is null', () => {
    render(
      <EmployeeModal
        employee={null}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true and employee is provided', () => {
    render(
      <EmployeeModal
        employee={mockEmployee}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Detalles del empleado')).toBeInTheDocument();
  });

  it('displays employee information correctly', () => {
    render(
      <EmployeeModal
        employee={mockEmployee}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByText('Diego Fernández')).toBeInTheDocument();
    expect(screen.getByText('Desarrollador Frontend')).toBeInTheDocument();
    expect(screen.getByText('Tecnología')).toBeInTheDocument();
  });

  it('formats start date correctly', () => {
    render(
      <EmployeeModal
        employee={mockEmployee}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByText('7 de enero de 2024')).toBeInTheDocument();
  });

  it('displays employee bio when available', () => {
    render(
      <EmployeeModal
        employee={mockEmployee}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByText('Biografía:')).toBeInTheDocument();
    expect(screen.getByText('Especialista en React y TypeScript con 3 años de experiencia en desarrollo web.')).toBeInTheDocument();
  });

  it('does not display bio section when employee has no bio', () => {
    render(
      <EmployeeModal
        employee={mockEmployeeWithoutBio}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.queryByText('Biografía:')).not.toBeInTheDocument();
  });

  it('renders avatar with correct props', () => {
    render(
      <EmployeeModal
        employee={mockEmployee}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    const avatar = screen.getByAltText('Avatar de Diego Fernández');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <EmployeeModal
        employee={mockEmployee}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    const closeButton = screen.getByLabelText('Cerrar modal');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when "Cerrar" button is clicked', () => {
    render(
      <EmployeeModal
        employee={mockEmployee}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    const closeButton = screen.getByRole('button', { name: 'Cerrar' });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    render(
      <EmployeeModal
        employee={mockEmployee}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    // Click the backdrop (the modal overlay itself)
    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    render(
      <EmployeeModal
        employee={mockEmployee}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    const modalContent = screen.getByText('Diego Fernández');
    fireEvent.click(modalContent);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', async () => {
    render(
      <EmployeeModal
        employee={mockEmployee}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('does not call onClose when other keys are pressed', async () => {
    render(
      <EmployeeModal
        employee={mockEmployee}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Space' });
    
    await waitFor(() => {
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it('prevents body scroll when modal is open', () => {
    render(
      <EmployeeModal
        employee={mockEmployee}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when modal is closed', () => {
    const { rerender } = render(
      <EmployeeModal
        employee={mockEmployee}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(
      <EmployeeModal
        employee={mockEmployee}
        isOpen={false}
        onClose={mockOnClose}
      />
    );
    
    expect(document.body.style.overflow).toBe('unset');
  });

  it('has proper accessibility attributes', () => {
    render(
      <EmployeeModal
        employee={mockEmployee}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'employee-modal-title');
    
    const title = screen.getByText('Detalles del empleado');
    expect(title).toHaveAttribute('id', 'employee-modal-title');
  });

  it('has proper z-index for overlay', () => {
    render(
      <EmployeeModal
        employee={mockEmployee}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    const backdrop = screen.getByRole('dialog');
    expect(backdrop).toHaveClass('z-50');
  });

  it('handles modal content overflow with scrolling', () => {
    render(
      <EmployeeModal
        employee={mockEmployee}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    const modalContent = screen.getByRole('dialog').querySelector('.max-h-\\[90vh\\]');
    expect(modalContent).toHaveClass('overflow-y-auto');
  });
});