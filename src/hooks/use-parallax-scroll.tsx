
import { useEffect, useState, useRef, useCallback } from 'react';
import { useIntersectionObserver } from './use-intersection-observer';

interface ParallaxScrollOptions {
  speed?: number;
  threshold?: number;
  disabled?: boolean;
}

export const useParallaxScroll = ({
  speed = 0.5,
  threshold = 0.1,
  disabled = false
}: ParallaxScrollOptions = {}) => {
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number>();
  const lastScrollY = useRef(0);
  
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Use intersection observer to only animate when visible
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold,
    triggerOnce: false,
    skip: disabled || prefersReducedMotion
  });

  const updateOffset = useCallback(() => {
    if (!isIntersecting || disabled || prefersReducedMotion) return;

    const scrollY = window.pageYOffset;
    const deltaY = scrollY - lastScrollY.current;
    
    // Only update if there's a meaningful change
    if (Math.abs(deltaY) > 1) {
      const newOffset = scrollY * speed;
      setOffset(newOffset);
      lastScrollY.current = scrollY;
    }
  }, [isIntersecting, disabled, prefersReducedMotion, speed]);

  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(updateOffset);
  }, [updateOffset]);

  useEffect(() => {
    if (disabled || prefersReducedMotion) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll, disabled, prefersReducedMotion]);

  return { ref, offset, isIntersecting };
};

export default useParallaxScroll;
