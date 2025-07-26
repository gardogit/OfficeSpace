import React from "react";
import { Employee } from "../../types";
import { Avatar, Card, Button } from "../ui";

export interface EmployeeCardProps {
  employee: Employee;
  onViewDetails?: (employee: Employee) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onViewDetails,
}) => {
  const formatStartDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
    });
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(employee);
    }
  };

  return (
    <Card
      variant="compact"
      className="text-center group"
      interactive={!!onViewDetails}
      onClick={onViewDetails ? handleViewDetails : undefined}
    >
      <div className="flex flex-col items-center">
        <div className="relative">
          <Avatar
            src={employee.avatar}
            name={employee.name}
            size="lg"
            className="mx-auto group-hover:ring-2 group-hover:ring-primary-200 dark:group-hover:ring-primary-700 group-hover:ring-offset-2"
            showStatus={true}
            status="online"
          />
        </div>

        <div className="space-y-1 text-center mt-2">
          <h3 className="heading-4 text-balance group-hover:text-primary-700 dark:group-hover:text-primary-400">
            {employee.name}
          </h3>
          <p className="body-small text-primary-600 dark:text-primary-400 font-medium">
            {employee.position}
          </p>
          <p className="caption text-gray-500 dark:text-gray-400">{employee.department}</p>
        </div>

        <div className="badge badge-secondary">
          Inicio: {formatStartDate(employee.startDate)}
        </div>

        {employee.bio && !onViewDetails && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewDetails}
            className="mt-2 opacity-0 group-hover:opacity-100"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          >
            Ver detalles
          </Button>
        )}
      </div>
    </Card>
  );
};

export default EmployeeCard;
