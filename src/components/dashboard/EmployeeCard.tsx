import React, { useState } from 'react';
import { Employee } from '../../types';
import { Avatar, Card, Button } from '../ui';

export interface EmployeeCardProps {
  employee: Employee;
  onViewDetails?: (employee: Employee) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onViewDetails
}) => {
  const formatStartDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(employee);
    }
  };

  return (
    <Card variant="compact" className="text-center hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col items-center space-y-3">
        <Avatar
          src={employee.avatar}
          name={employee.name}
          size="lg"
          className="mx-auto"
        />
        
        <div className="space-y-1">
          <h3 className="font-semibold text-gray-900 text-lg">
            {employee.name}
          </h3>
          <p className="text-primary-600 font-medium">
            {employee.position}
          </p>
          <p className="text-gray-600 text-sm">
            {employee.department}
          </p>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
          Inicio: {formatStartDate(employee.startDate)}
        </div>

        {employee.bio && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewDetails}
            className="text-primary-600 hover:text-primary-700"
          >
            Ver detalles
          </Button>
        )}
      </div>
    </Card>
  );
};

export default EmployeeCard;