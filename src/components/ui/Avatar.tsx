import React, { useState } from 'react';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg'
  };

  const baseClasses = 'inline-flex items-center justify-center rounded-full bg-gray-500 text-white font-medium';
  const avatarClasses = `${baseClasses} ${sizeClasses[size]} ${className}`;

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

  // Show image if src is provided and no error occurred
  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={`Avatar de ${name}`}
        className={`${avatarClasses} object-cover`}
        onError={handleImageError}
      />
    );
  }

  // Show initials fallback
  return (
    <div className={avatarClasses} title={name}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;