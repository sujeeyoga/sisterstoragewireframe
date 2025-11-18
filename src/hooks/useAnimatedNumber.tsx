import { useEffect, useState, useRef } from 'react';

export const useAnimatedNumber = (target: number, duration: number = 500) => {
  const [current, setCurrent] = useState(target);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const startValueRef = useRef<number>(target);

  useEffect(() => {
    startValueRef.current = current;
    startTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) return;

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const nextValue = startValueRef.current + (target - startValueRef.current) * easeProgress;
      setCurrent(nextValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCurrent(target);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [target, duration]);

  return current;
};
