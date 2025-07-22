
import { useEffect, useRef, useCallback } from 'react';

interface OptimizedScrollOptions {
  throttle?: number;
  passive?: boolean;
  onScroll: (scrollY: number) => void;
}

export const useOptimizedScroll = ({
  throttle = 16, // ~60fps
  passive = true,
  onScroll
}: OptimizedScrollOptions) => {
  const rafRef = useRef<number>();
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const scrollY = window.pageYOffset;
      
      // Only update if there's a meaningful change
      if (Math.abs(scrollY - lastScrollY.current) > 1) {
        onScroll(scrollY);
        lastScrollY.current = scrollY;
      }
    });
  }, [onScroll]);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    window.addEventListener('scroll', handleScroll, { passive });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll, passive]);
};
