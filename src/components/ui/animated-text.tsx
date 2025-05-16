import React, { createElement, ReactNode } from 'react';
import { useAnimatedText } from '@/hooks/use-animated-text';

interface AnimatedTextProps {
  as?: React.ElementType;
  children: ReactNode;
  className?: string;
  animation?: 'breath-fade-up' | 'breath-fade-up-1' | 'breath-fade-up-2' | 'breath-fade-up-3' | 'breath-fade-up-4' | 'breath-fade-up-5';
  words?: boolean;
  delay?: number;
  duration?: number; // Added duration parameter
  container?: boolean; // Flag to animate as container
}

export const AnimatedText = ({
  as = 'span',
  children,
  className = '',
  animation = 'breath-fade-up',
  words = false,
  delay = 0,
  duration = 1.5, // Default slower animation
  container = false, // Default to text animation
}: AnimatedTextProps) => {
  const { ref, renderAnimatedText, applyAnimationToContainer } = useAnimatedText({
    animation,
    words,
    duration,
  });

  // If container mode is enabled, wrap children in animated container
  if (container) {
    return createElement(
      as,
      { ref, className, style: { animationDelay: delay ? `${delay}ms` : undefined } },
      applyAnimationToContainer(children)
    );
  }

  // Otherwise use the standard text animation
  return createElement(
    as,
    { ref, className, style: { animationDelay: delay ? `${delay}ms` : undefined } },
    typeof children === 'string'
      ? renderAnimatedText(children)
      : children
  );
};

export default AnimatedText;
