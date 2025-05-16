
import { useState, useEffect } from 'react';

interface ScrollDirectionState {
  direction: 'up' | 'down' | 'none';
  position: number;
  isAtTop: boolean;
  isScrolling: boolean;
}

export const useScrollDirection = (
  threshold: number = 10, 
  initialDirection: 'up' | 'down' | 'none' = 'none'
): ScrollDirectionState => {
  const [scrollState, setScrollState] = useState<ScrollDirectionState>({
    direction: initialDirection,
    position: typeof window !== 'undefined' ? window.pageYOffset : 0,
    isAtTop: true,
    isScrolling: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let scrollTimeout: NodeJS.Timeout;
    let lastScrollY = window.pageYOffset;
    let ticking = false;
    let animationFrameId: number | null = null;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? 'down' : 
                         scrollY < lastScrollY ? 'up' : 'none';
      
      // Only update state if we've scrolled past the threshold and direction has changed
      if (
        Math.abs(scrollY - lastScrollY) > threshold && 
        direction !== scrollState.direction
      ) {
        setScrollState({
          direction,
          position: scrollY,
          isAtTop: scrollY <= 10,
          isScrolling: true,
        });
      } else if (!scrollState.isScrolling) {
        setScrollState(prev => ({
          ...prev,
          isScrolling: true,
        }));
      }
      
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        // Cancel any existing animation frame to prevent stacking
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        
        // Request a new animation frame
        animationFrameId = window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setScrollState(prev => ({
          ...prev,
          isScrolling: false,
        }));
      }, 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [threshold, scrollState.direction]);

  return scrollState;
};

export default useScrollDirection;
