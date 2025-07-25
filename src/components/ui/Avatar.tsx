import React, { useState } from 'react';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  showStatus?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
  status,
  showStatus = false,
  interactive = false,
  onClick
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl'
  };

  const statusSizeClasses = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5'
  };

  const statusColors = {
    online: 'bg-success-500',
    offline: 'bg-gray-400',
    away: 'bg-warning-500',
    busy: 'bg-error-500'
  };

  const baseClasses = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 ease-out';
  const interactiveClasses = interactive || onClick ? 'cursor-pointer hover:ring-2 hover:ring-primary-200 hover:ring-offset-2 focus-ring' : '';
  
  // Generate background color based on name for consistency
  const getBackgroundColor = (fullName: string): string => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'
    ];
    
    const hash = fullName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarClasses = `${baseClasses} ${sizeClasses[size]} ${interactiveClasses} ${
    src && !imageError ? '' : `${getBackgroundColor(name)} text-white`
  } ${className}`;

  // Generate initials from name
  const getInitials = (fullName: string): string => {
    if (!fullName.trim()) return '?';
    
    return fullName
      .trim()
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageError = () => {
    setImageError(true);
  };

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

  const AvatarComponent = onClick ? 'button' : 'div';

  return (
    <div className="relative inline-block">
      <AvatarComponent
        className={avatarClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        aria-label={onClick ? `Ver perfil de ${name}` : undefined}
        title={name}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={`Avatar de ${name}`}
            className="w-full h-full object-cover rounded-full"
            onError={handleImageError}
          />
        ) : (
          <span className="select-none">
            {getInitials(name)}
          </span>
        )}
      </AvatarComponent>
      
      {showStatus && status && (
        <span 
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-white ${statusSizeClasses[size]} ${statusColors[status]}`}
          aria-label={`Estado: ${status}`}
        />
      )}
    </div>
  );
};

export default Avatar;