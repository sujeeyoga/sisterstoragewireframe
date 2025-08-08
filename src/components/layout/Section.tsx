
import React from 'react';
import { cn } from '@/lib/utils';

export type SectionSpacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SectionWidth = 'full' | 'contained' | 'narrow' | 'ultra-wide';
export type SectionBackground = 'transparent' | 'white' | 'gray' | 'dark' | 'brand-pink' | 'brand-orange';

interface SectionProps {
  children: React.ReactNode;
  spacing?: SectionSpacing;
  width?: SectionWidth;
  background?: SectionBackground;
  className?: string;
  id?: string;
  as?: 'section' | 'div' | 'article' | 'aside';
}

const Section: React.FC<SectionProps> = ({
  children,
  spacing = 'md',
  width = 'contained',
  background = 'transparent',
  className = '',
  id,
  as: Component = 'section'
}) => {
  // Spacing utilities - Enhanced hierarchy
  const spacingMap = {
    xs: 'py-4 md:py-6',      // Tight spacing for subsections
    sm: 'py-8 md:py-12',     // Small spacing for minor sections  
    md: 'py-12 md:py-16',    // Default medium spacing
    lg: 'py-16 md:py-24',    // Large spacing for major sections
    xl: 'py-24 md:py-32'     // Extra large for hero-adjacent sections
  };

  // Width utilities
  const widthMap = {
    full: 'w-full',
    contained: 'container-custom',
    narrow: 'max-w-4xl mx-auto px-4',
    'ultra-wide': 'max-w-7xl mx-auto px-4'
  };

  // Background utilities
  const backgroundMap = {
    transparent: '',
    white: 'bg-white',
    gray: 'bg-gray-50',
    dark: 'bg-black text-white',
    'brand-pink': 'bg-[#E90064] text-white',
    'brand-orange': 'bg-[#FF8021] text-white'
  };

  return (
    <Component 
      id={id}
      className={cn(
        spacingMap[spacing],
        backgroundMap[background],
        className
      )}
    >
      <div className={widthMap[width]}>
        {children}
      </div>
    </Component>
  );
};

export default Section;
