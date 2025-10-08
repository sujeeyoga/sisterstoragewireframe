
import { useEffect, useState, useRef, useCallback } from 'react';

interface OptimizedParallaxOptions {
  speed?: number;
  threshold?: number;
  disabled?: boolean;
}

export const useOptimizedParallax = ({
  speed = 0.5,
  threshold = 0.1,
  disabled = false
}: OptimizedParallaxOptions = {}) => {
  const [offset, setOffset] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const observerRef = useRef<IntersectionObserver>();
  const lastScrollY = useRef(0);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Intersection Observer setup
  useEffect(() => {
    if (disabled || prefersReducedMotion || !elementRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin: '50px 0px'
      }
    );

    observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, disabled, prefersReducedMotion]);

  // Optimized scroll handler
  const updateOffset = useCallback(() => {
    if (!isVisible || disabled || prefersReducedMotion) return;

    const scrollY = window.pageYOffset;
    const deltaY = Math.abs(scrollY - lastScrollY.current);
    
    // Only update if there's meaningful change (increased threshold)
    if (deltaY > 5) {
      const newOffset = scrollY * speed;
      setOffset(newOffset);
      lastScrollY.current = scrollY;
    }
  }, [isVisible, disabled, prefersReducedMotion, speed]);

  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(updateOffset);
  }, [updateOffset]);

  // Scroll event listener
  useEffect(() => {
    if (disabled || prefersReducedMotion) return;

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

  return { 
    ref: elementRef, 
    offset, 
    isVisible,
    prefersReducedMotion 
  };
};

export default useOptimizedParallax;
