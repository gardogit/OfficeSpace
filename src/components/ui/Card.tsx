import React from 'react';

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'highlighted';
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className = '', 
  variant = 'default' 
}) => {
  const baseClasses = 'bg-white rounded-lg border border-gray-200 transition-shadow duration-200';
  
  const variantClasses = {
    default: 'p-6 shadow-sm hover:shadow-md',
    compact: 'p-4 shadow-sm hover:shadow-md',
    highlighted: 'p-6 shadow-md hover:shadow-lg border-primary-200 bg-primary-50'
  };

  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className={cardClasses}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;