
import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { useScrollDirection } from '@/hooks/use-scroll-direction';

interface ScrollFadeContainerProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  scrollFadeDirection?: 'both' | 'up' | 'down';
  duration?: number;
  delay?: number;
  rootMargin?: string;
  id?: string;
}

export const ScrollFadeContainer = ({
  children,
  className = '',
  threshold = 0.2,
  scrollFadeDirection = 'both',
  duration = 0.8,
  delay = 0,
  rootMargin = '-100px 0px',
  id,
}: ScrollFadeContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { direction, isScrolling } = useScrollDirection(5);
  
  // Return if user prefers reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Determine if the element is entering or exiting the viewport
          if (entry.isIntersecting) {
            if (!hasAnimated || scrollFadeDirection === 'both') {
              setIsVisible(true);
              if (scrollFadeDirection !== 'both') {
                setHasAnimated(true);
              }
            }
          } else {
            // Only hide elements when scrolling in the opposite direction if 'both' mode is on
            if (scrollFadeDirection === 'both' && isScrolling) {
              setIsVisible(false);
            }
          }
        });
      },
      { 
        threshold,
        rootMargin,
      }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [threshold, hasAnimated, direction, isScrolling, rootMargin, scrollFadeDirection]);

  // Determine whether to animate based on scroll direction
  const shouldAnimate = () => {
    if (scrollFadeDirection === 'both') return true;
    if (scrollFadeDirection === 'up' && direction === 'up') return true;
    if (scrollFadeDirection === 'down' && direction === 'down') return true;
    return false;
  };

  // Return content immediately without animation for users who prefer reduced motion
  if (prefersReducedMotion) {
    return (
      <div ref={containerRef} className={className} id={id}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`transition-opacity duration-500 ${className} ${
        isVisible && shouldAnimate()
          ? 'animate-scroll-fade-in'
          : isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        animationDuration: `${duration}s`,
        animationDelay: delay ? `${delay}s` : undefined
      }}
      id={id}
    >
      {children}
    </div>
  );
};

export default ScrollFadeContainer;
