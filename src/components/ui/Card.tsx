import React from 'react';

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'highlighted' | 'elevated';
  interactive?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className = '', 
  variant = 'default',
  interactive = false,
  onClick
}) => {
  const baseClasses = 'bg-white rounded-lg border transition-all duration-250 ease-out';
  
  const variantClasses = {
    default: 'card-default',
    compact: 'card-compact',
    highlighted: 'card-highlighted',
    elevated: 'card-elevated'
  };

  const interactiveClasses = interactive || onClick ? 'cursor-pointer hover-lift focus-ring' : '';
  
  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${interactiveClasses} ${className}`;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  const CardComponent = onClick ? 'button' : 'div';

  return (
    <CardComponent 
      className={cardClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick && title ? `Abrir ${title}` : undefined}
    >
      {title && (
        <h3 className="heading-4 mb-4 text-balance">
          {title}
        </h3>
      )}
      <div className="animate-fade-in">
        {children}
      </div>
    </CardComponent>
  );
};

export default Card;