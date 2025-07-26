import React from "react";
import { Space } from "../../types";
import { IoPeopleOutline, IoChevronForwardOutline } from "react-icons/io5";

export interface SpacesListProps {
  spaces: Space[];
  className?: string;
}

/**
 * SpacesList - Lista de espacios de colaboración
 *
 * Muestra espacios de colaboración con indicadores de actividad.
 * Permite navegación a espacios específicos con información relevante.
 *
 * Requerimientos: 8.1, 8.2, 8.3, 8.4
 */
export const SpacesList: React.FC<SpacesListProps> = ({
  spaces,
  className = "",
}) => {
  const handleSpaceClick = (space: Space) => {
    // Simular navegación a espacio específico
    // En una implementación real, esto navegaría a la página del espacio
    console.log(`Navegando al espacio: ${space.name}`);
    // window.location.href = `/spaces/${space.id}`;
  };

  const formatLastActivity = (lastActivity: string): string => {
    const date = new Date(lastActivity);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Hace menos de 1 hora";
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`;
    }
  };

  const getActivityIndicator = (isActive: boolean, lastActivity: string) => {
    if (!isActive) {
      return {
        color: "bg-gray-400",
        label: "Inactivo",
      };
    }

    const date = new Date(lastActivity);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 2) {
      return {
        color: "bg-green-500",
        label: "Muy activo",
      };
    } else if (diffInHours < 24) {
      return {
        color: "bg-yellow-500",
        label: "Activo",
      };
    } else {
      return {
        color: "bg-orange-500",
        label: "Poco activo",
      };
    }
  };

  return (
    <div
      className={`space-y-3 ${className}`}
      role="navigation"
      aria-label="Espacios de colaboración"
    >
      {spaces.map((space) => {
        const activityIndicator = getActivityIndicator(
          space.isActive,
          space.lastActivity
        );

        return (
          <button
            key={space.id}
            onClick={() => handleSpaceClick(space)}
            className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            aria-label={`Acceder al espacio ${space.name}`}
          >
            <div className="flex items-start justify-between gap-3">
              {/* Información principal del espacio */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {space.name}
                  </h3>

                  {/* Indicador de actividad */}
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${activityIndicator.color}`}
                      title={activityIndicator.label}
                      aria-label={`Estado: ${activityIndicator.label}`}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                  {space.description}
                </p>

                <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <IoPeopleOutline className="w-3 h-3" aria-hidden="true" />
                    {space.memberCount} miembro
                    {space.memberCount !== 1 ? "s" : ""}
                  </div>

                  <div>{formatLastActivity(space.lastActivity)}</div>
                </div>
              </div>

              {/* Icono de navegación */}
              <div className="flex-shrink-0 mt-1">
                <IoChevronForwardOutline
                  className="w-4 h-4 text-gray-400 dark:text-gray-500"
                  aria-hidden="true"
                />
              </div>
            </div>
          </button>
        );
      })}

      {/* Mensaje cuando no hay espacios */}
      {spaces.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="flex flex-col items-center gap-2">
            <IoPeopleOutline
              className="w-8 h-8 text-gray-300 dark:text-gray-600"
              aria-hidden="true"
            />
            <p className="text-sm">
              No hay espacios de colaboración disponibles
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpacesList;
