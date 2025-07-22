
import { useEffect, useRef, useState, useCallback } from 'react';

interface IntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  triggerOnce?: boolean;
  skip?: boolean;
}

interface IntersectionObserverReturn<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T>;
  isIntersecting: boolean;
  hasIntersected: boolean;
  entry: IntersectionObserverEntry | null;
}

export const useIntersectionObserver = <T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  rootMargin = '0px',
  root = null,
  triggerOnce = true,
  skip = false
}: IntersectionObserverOptions = {}): IntersectionObserverReturn<T> => {
  const ref = useRef<T>(null);
  const observerRef = useRef<IntersectionObserver>();
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

    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
      root
    });

    const currentElement = ref.current;
    observerRef.current.observe(currentElement);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = undefined;
      }
    };
  }, [threshold, rootMargin, root, skip, handleIntersection]);

  // Handle triggerOnce cleanup
  useEffect(() => {
    if (triggerOnce && hasIntersected && observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = undefined;
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
