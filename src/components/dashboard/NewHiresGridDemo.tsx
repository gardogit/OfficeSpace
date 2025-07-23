import React from 'react';
import { NewHiresGrid } from './NewHiresGrid';
import mockData from '../../data/mockData.json';

/**
 * Demo component for NewHiresGrid
 * Shows the component with mock data for development and testing
 */
export const NewHiresGridDemo: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          NewHiresGrid Demo
        </h1>
        
        <div className="space-y-8">
          {/* Full grid with all employees */}
          <NewHiresGrid
            newHires={mockData.newHires}
            title="Nuevos Empleados - Completo"
          />
          
          {/* Limited grid with first 3 employees */}
          <NewHiresGrid
            newHires={mockData.newHires.slice(0, 3)}
            title="Nuevos Empleados - Limitado"
          />
          
          {/* Empty state */}
          <NewHiresGrid
            newHires={[]}
            title="Estado Vacío"
          />
        </div>
      </div>
    </div>
  );
};

export default NewHiresGridDemo;