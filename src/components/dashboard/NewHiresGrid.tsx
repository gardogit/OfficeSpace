import React, { useState, memo, useMemo } from 'react';
import { Employee } from '../../types';
import { Card } from '../ui';
import { EmployeeCard } from './EmployeeCard';
import { EmployeeModal } from './EmployeeModal';

export interface NewHiresGridProps {
  newHires: Employee[];
  title?: string;
  className?: string;
  maxColumns?: 2 | 3 | 4;
}

const NewHiresGridComponent: React.FC<NewHiresGridProps> = ({
  newHires,
  title = "Nuevos Empleados",
  className = '',
  maxColumns = 4
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  // Sort employees by start date (most recent first) - memoized for performance
  const sortedNewHires = useMemo(() => {
    return [...newHires].sort((a, b) => {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }, [newHires]);

  if (newHires.length === 0) {
    return (
      <Card title={title} className={className}>
        <div className="text-center py-8">
          <div className="text-gray-400 dark:text-gray-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">No hay nuevos empleados para mostrar</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card title={title} className={className}>
        <div className={`grid gap-4 ${
          maxColumns === 2 
            ? 'grid-cols-1 sm:grid-cols-2' 
            : maxColumns === 3 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {sortedNewHires.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
        
        {newHires.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            {newHires.length} nuevo{newHires.length !== 1 ? 's' : ''} empleado{newHires.length !== 1 ? 's' : ''}
          </div>
        )}
      </Card>

      <EmployeeModal
        employee={selectedEmployee}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

// Memoize component to prevent unnecessary re-renders
export const NewHiresGrid = memo(NewHiresGridComponent, (prevProps, nextProps) => {
  return (
    prevProps.newHires === nextProps.newHires &&
    prevProps.title === nextProps.title &&
    prevProps.className === nextProps.className &&
    prevProps.maxColumns === nextProps.maxColumns
  );
});

NewHiresGrid.displayName = 'NewHiresGrid';

export default NewHiresGrid;