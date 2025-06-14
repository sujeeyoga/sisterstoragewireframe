
import React, { createElement, ReactNode, CSSProperties } from 'react';
import { useAnimatedText } from '@/hooks/use-animated-text';

interface AnimatedTextProps {
  as?: React.ElementType;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  animation?: 'breath-fade-up' | 'breath-fade-up-1' | 'breath-fade-up-2' | 'breath-fade-up-3' | 'breath-fade-up-4' | 'breath-fade-up-5';
  words?: boolean;
  delay?: number;
  duration?: number;
  container?: boolean;
}

export const AnimatedText = ({
  as = 'span',
  children,
  className = '',
  style,
  animation = 'breath-fade-up',
  words = false,
  delay = 0,
  duration = 1.5,
  container = false,
}: AnimatedTextProps) => {
  const { ref, renderAnimatedText, applyAnimationToContainer } = useAnimatedText({
    animation,
    words,
    duration,
  });

  const combinedStyle = {
    ...style,
    animationDelay: delay ? `${delay}ms` : undefined
  };

  if (container) {
    return createElement(
      as,
      { ref, className, style: combinedStyle },
      applyAnimationToContainer(children)
    );
  }

  return createElement(
    as,
    { ref, className, style: combinedStyle },
    typeof children === 'string'
      ? renderAnimatedText(children)
      : children
  );
};

export default AnimatedText;
