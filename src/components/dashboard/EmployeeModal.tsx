import React, { useEffect } from 'react';
import { Employee } from '../../types';
import { Avatar, Button } from '../ui';

export interface EmployeeModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  employee,
  isOpen,
  onClose
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !employee) {
    return null;
  }

  const formatStartDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="employee-modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h2 id="employee-modal-title" className="text-xl font-semibold text-gray-900">
              Detalles del empleado
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Cerrar modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* Employee Info */}
          <div className="text-center space-y-4">
            <Avatar
              src={employee.avatar}
              name={employee.name}
              size="lg"
              className="mx-auto w-20 h-20 text-xl"
            />
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">
                {employee.name}
              </h3>
              <p className="text-primary-600 font-semibold text-lg">
                {employee.position}
              </p>
              <p className="text-gray-600">
                {employee.department}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-left space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Fecha de inicio:</span>
                <p className="text-gray-900">{formatStartDate(employee.startDate)}</p>
              </div>
              
              {employee.bio && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Biografía:</span>
                  <p className="text-gray-900 mt-1">{employee.bio}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;