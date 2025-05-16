
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
  const { direction } = useScrollDirection(5);
  
  // Return if user prefers reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) return;
    
    let animationFrameId: number | null = null;
    let debounceTimer: NodeJS.Timeout | null = null;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Clear any pending animation frames to prevent stacking
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          if (debounceTimer) clearTimeout(debounceTimer);
          
          // Debounce the visibility change with a small delay
          debounceTimer = setTimeout(() => {
            // Use requestAnimationFrame to sync with the browser's repaint cycle
            animationFrameId = requestAnimationFrame(() => {
              if (entry.isIntersecting) {
                if (!hasAnimated || scrollFadeDirection === 'both') {
                  setIsVisible(true);
                  if (scrollFadeDirection !== 'both') {
                    setHasAnimated(true);
                  }
                }
              } else {
                // Only hide elements when scroll direction matches
                if (scrollFadeDirection === 'both' || 
                   (scrollFadeDirection === 'up' && direction === 'up') ||
                   (scrollFadeDirection === 'down' && direction === 'down')) {
                  setIsVisible(false);
                }
              }
            });
          }, 50); // Small debounce to prevent rapid toggling
        });
      },
      { 
        threshold: threshold,
        rootMargin: rootMargin,
      }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
      // Clean up timers and animation frames
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [threshold, hasAnimated, direction, rootMargin, scrollFadeDirection]);

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
      className={`${className}`}
      style={{ 
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
        transition: `opacity ${duration * 1.5}s cubic-bezier(0.16, 1, 0.3, 1), 
                    transform ${duration * 1.2}s cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: delay ? `${delay}s` : undefined,
        willChange: 'opacity, transform'
      }}
      id={id}
    >
      {children}
    </div>
  );
};

export default ScrollFadeContainer;
