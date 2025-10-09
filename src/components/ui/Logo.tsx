
import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '@/assets/sister-storage-logo-new.jpg';

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
      <div 
        className={`${sizeClasses[size]} flex items-center justify-center transition-all duration-300 hover:opacity-90`}
        style={{ 
          transform: `scale(${scale})`,
        }}
      >
        <img 
          src={logoImage} 
          alt="SISTER STORAGE" 
          className="h-full w-auto object-contain"
        />
      </div>
    </Link>
  );
};

export default Logo;
