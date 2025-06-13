
import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { useScrollDirection } from '@/hooks/use-scroll-direction';

export type AnimationPreset = 'subtle' | 'medium' | 'dramatic' | 'none';
export type AnimationDirection = 'both' | 'up' | 'down';

interface EnhancedScrollFadeProps {
  children: ReactNode;
  className?: string;
  preset?: AnimationPreset;
  direction?: AnimationDirection;
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  id?: string;
  once?: boolean;
}

export const EnhancedScrollFade: React.FC<EnhancedScrollFadeProps> = ({
  children,
  className = '',
  preset = 'medium',
  direction = 'both',
  threshold = 0.2,
  rootMargin = '-50px 0px',
  delay = 0,
  id,
  once = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { direction: scrollDirection } = useScrollDirection(5);
  
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Animation presets
  const presetConfig = {
    none: { duration: 0, translateY: 0, scale: 1 },
    subtle: { duration: 0.6, translateY: 10, scale: 0.99 },
    medium: { duration: 0.8, translateY: 20, scale: 0.98 },
    dramatic: { duration: 1.2, translateY: 40, scale: 0.95 }
  };

  const config = presetConfig[preset];

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion || preset === 'none') {
      setIsVisible(true);
      return;
    }
    
    let animationFrameId: number | null = null;
    let debounceTimer: NodeJS.Timeout | null = null;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          if (debounceTimer) clearTimeout(debounceTimer);
          
          debounceTimer = setTimeout(() => {
            animationFrameId = requestAnimationFrame(() => {
              if (entry.isIntersecting) {
                if (!hasAnimated || !once) {
                  setIsVisible(true);
                  if (once) setHasAnimated(true);
                }
              } else if (!once) {
                // Only hide if direction matches and not once-only
                if (direction === 'both' || 
                   (direction === 'up' && scrollDirection === 'up') ||
                   (direction === 'down' && scrollDirection === 'down')) {
                  setIsVisible(false);
                }
              }
            });
          }, 50);
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [threshold, rootMargin, direction, scrollDirection, hasAnimated, once, preset, prefersReducedMotion]);

  // Return immediately without animation for reduced motion or none preset
  if (prefersReducedMotion || preset === 'none') {
    return (
      <div ref={containerRef} className={className} id={id}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      id={id}
      style={{ 
        opacity: isVisible ? 1 : 0,
        transform: isVisible 
          ? 'translateY(0) scale(1)' 
          : `translateY(${config.translateY}px) scale(${config.scale})`,
        transition: `opacity ${config.duration}s cubic-bezier(0.16, 1, 0.3, 1), 
                    transform ${config.duration * 0.8}s cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: delay ? `${delay}s` : undefined,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
};

export default EnhancedScrollFade;
