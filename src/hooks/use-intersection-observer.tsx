import { useEffect, useRef, useState, useCallback } from 'react';

interface IntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  triggerOnce?: boolean;
  skip?: boolean;
}

interface IntersectionObserverReturn {
  ref: React.RefObject<HTMLElement>;
  isIntersecting: boolean;
  hasIntersected: boolean;
  entry: IntersectionObserverEntry | null;
}

export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = '0px',
  root = null,
  triggerOnce = true,
  skip = false
}: IntersectionObserverOptions = {}): IntersectionObserverReturn => {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setEntry(entry);
    setIsIntersecting(entry.isIntersecting);
    
    if (entry.isIntersecting && !hasIntersected) {
      setHasIntersected(true);
    }
  }, [hasIntersected]);

  useEffect(() => {
    if (skip || !ref.current) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
      root
    });

    const currentElement = ref.current;
    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      observer.disconnect();
    };
  }, [threshold, rootMargin, root, skip, handleIntersection]);

  // Cleanup if triggerOnce and already intersected
  useEffect(() => {
    if (triggerOnce && hasIntersected && ref.current) {
      const observer = new IntersectionObserver(() => {});
      observer.disconnect();
    }
  }, [triggerOnce, hasIntersected]);

  return {
    ref,
    isIntersecting,
    hasIntersected,
    entry
  };
};

export default useIntersectionObserver;