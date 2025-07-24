import React from 'react';

// Base skeleton component
export const Skeleton: React.FC<{ 
  className?: string; 
  width?: string; 
  height?: string;
}> = ({ className = '', width, height }) => {
  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

// Card skeleton loader
export const CardSkeleton: React.FC<{ showImage?: boolean }> = ({ showImage = false }) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
    {showImage && (
      <Skeleton className="w-full h-48 mb-4" />
    )}
    <Skeleton className="h-6 w-3/4 mb-3" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

// News carousel skeleton
export const NewsCarouselSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    <Skeleton className="w-full h-64" />
    <div className="p-6">
      <Skeleton className="h-8 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    {/* Navigation dots */}
    <div className="flex justify-center space-x-2 pb-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="w-2 h-2 rounded-full" />
      ))}
    </div>
  </div>
);

// Events list skeleton
export const EventsListSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg">
          <div className="flex-shrink-0">
            <Skeleton className="w-12 h-12 rounded" />
          </div>
          <div className="flex-1 min-w-0">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Employee grid skeleton
export const EmployeeGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col items-center text-center">
          <Skeleton className="w-16 h-16 rounded-full mb-4" />
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-2/3 mb-1" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// Quick links skeleton
export const QuickLinksSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
    <Skeleton className="h-5 w-1/2 mb-4" />
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  </div>
);

// Spaces list skeleton
export const SpacesListSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
    <Skeleton className="h-5 w-1/2 mb-4" />
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-3 border border-gray-100 rounded">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-full mb-1" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Launch pad skeleton
export const LaunchPadSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
    <Skeleton className="h-5 w-1/2 mb-4" />
    <div className="grid grid-cols-3 gap-3">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="flex flex-col items-center p-2">
          <Skeleton className="w-8 h-8 rounded mb-2" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  </div>
);

// Header skeleton
export const HeaderSkeleton: React.FC = () => (
  <div className="bg-white border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-10 w-64" />
      <div className="flex items-center space-x-4">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  </div>
);

// Navigation skeleton
export const NavigationSkeleton: React.FC = () => (
  <div className="bg-white border-b border-gray-200 px-6 py-3">
    <div className="flex space-x-8">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-6 w-20" />
      ))}
    </div>
  </div>
);

// Sidebar skeleton
export const SidebarSkeleton: React.FC = () => (
  <div className="space-y-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <Skeleton className="h-5 w-1/2 mb-4" />
        <div className="space-y-3">
          {[...Array(4)].map((_, j) => (
            <div key={j} className="flex items-center space-x-3">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Full dashboard skeleton
export const DashboardSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    <HeaderSkeleton />
    <NavigationSkeleton />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <NewsCarouselSkeleton />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EventsListSkeleton />
            <EmployeeGridSkeleton />
          </div>
        </div>
        <div className="space-y-6">
          <SidebarSkeleton />
        </div>
      </div>
    </div>
  </div>
);

// Loading state with progress indicator
export const LoadingWithProgress: React.FC<{ 
  message?: string; 
  progress?: number;
}> = ({ message = 'Cargando...', progress }) => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
      {progress !== undefined && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-primary-600">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
    <p className="mt-4 text-sm text-gray-600">{message}</p>
  </div>
);

// Shimmer effect for better loading experience
export const ShimmerSkeleton: React.FC<{ 
  className?: string; 
  width?: string; 
  height?: string;
}> = ({ className = '', width, height }) => {
  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div
      className={`relative overflow-hidden bg-gray-200 rounded ${className}`}
      style={style}
      aria-hidden="true"
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
    </div>
  );
};