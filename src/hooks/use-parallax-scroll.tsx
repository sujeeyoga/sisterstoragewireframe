
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
  const performanceMarkRef = useRef<string>('');
  
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

    // Performance monitoring
    if (typeof window !== 'undefined' && window.performance) {
      performanceMarkRef.current = `parallax-update-${Date.now()}`;
      performance.mark(performanceMarkRef.current);
    }

    const scrollY = window.pageYOffset;
    const deltaY = scrollY - lastScrollY.current;
    
    // Only update if there's a meaningful change (increased threshold for mobile)
    const threshold = 'ontouchstart' in window ? 2 : 1;
    if (Math.abs(deltaY) > threshold) {
      const newOffset = scrollY * speed;
      setOffset(newOffset);
      lastScrollY.current = scrollY;
    }

    // Performance measurement
    if (performanceMarkRef.current && typeof window !== 'undefined' && window.performance) {
      try {
        performance.measure(
          'parallax-update-duration',
          performanceMarkRef.current
        );
      } catch (e) {
        // Ignore performance measurement errors
      }
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

    // Use passive listeners for better scroll performance
    window.addEventListener('scroll', handleScroll, { 
      passive: true,
      capture: false 
    });
    
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
