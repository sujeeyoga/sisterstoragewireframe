
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  scrolled?: boolean;
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  scrolled = false,
  onClick
}) => {
  const sizeClasses = {
    sm: 'h-6 md:h-8',
    md: 'h-8 md:h-10',
    lg: 'h-10 md:h-12'
  };

  const scale = scrolled ? 0.95 : 1;

  return (
    <Link to="/" className={`relative z-10 ${className}`} onClick={onClick}>
      <img
        src="https://sisterstorage.com/wp-content/uploads/2025/02/Sister-Storage-Logo-Main-300x112.png"
        alt="Sister Storage - Elegant jewelry and keepsake storage solutions"
        className={`${sizeClasses[size]} w-auto transition-all duration-300 hover:opacity-90`}
        style={{ 
          transform: `scale(${scale})`,
        }}
        loading="eager"
      />
    </Link>
  );
};

export default Logo;
