import { useRef, useEffect } from 'react';

export const useScrollProgress = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate progress: 0 when element enters viewport, 1 when it leaves
      const scrollProgress = Math.max(0, Math.min(1, 
        (viewportHeight - rect.top) / (viewportHeight + rect.height)
      ));
      
      ref.current.style.setProperty('--scroll', scrollProgress.toString());
    };

    handleScroll(); // Initial call
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return ref;
};
