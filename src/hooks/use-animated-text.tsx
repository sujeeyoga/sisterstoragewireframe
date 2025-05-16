import { useEffect, useRef, useState } from 'react';

type AnimationType = 'breath-fade-up' | 'breath-fade-up-1' | 'breath-fade-up-2' | 'breath-fade-up-3' | 'breath-fade-up-4' | 'breath-fade-up-5';

interface UseAnimatedTextProps {
  threshold?: number;
  rootMargin?: string;
  animation?: AnimationType;
  words?: boolean;
}

export const useAnimatedText = ({
  threshold = 0.2,
  rootMargin = '0px',
  animation = 'breath-fade-up',
  words = false,
}: UseAnimatedTextProps = {}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isAnimated) {
          setIsVisible(true);
          setIsAnimated(true);
          // Once animated, no need to keep observing
          observer.unobserve(ref.current as Element);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin, isAnimated]);

  // Return if user prefers reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Function to wrap text in animation spans
  const renderAnimatedText = (text: string) => {
    if (prefersReducedMotion) {
      return <>{text}</>;
    }

    if (!isVisible) {
      return <span className="opacity-0">{text}</span>;
    }

    if (words) {
      // Split by words and animate each word
      return text.split(' ').map((word, i) => (
        <span
          key={i}
          className={`inline-block ${animation}-${(i % 5) + 1}`}
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          {word}&nbsp;
        </span>
      ));
    } else {
      // Apply animation to the whole text
      return <span className={`inline-block animate-${animation}`}>{text}</span>;
    }
  };

  return { ref, isVisible, renderAnimatedText };
};

export default useAnimatedText;
