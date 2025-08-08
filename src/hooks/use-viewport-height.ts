import { useEffect } from 'react';

// Sets a reliable CSS --vh variable that matches the real viewport height on mobile
// Use in styles as: height: calc(var(--vh, 1vh) * 100)
export const useViewportHeight = () => {
  useEffect(() => {
    const setVh = () => {
      const vh = (window.visualViewport?.height ?? window.innerHeight) * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();

    const onResize = () => setVh();
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize);
    window.visualViewport?.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      window.visualViewport?.removeEventListener('resize', onResize);
    };
  }, []);
};

export default useViewportHeight;
