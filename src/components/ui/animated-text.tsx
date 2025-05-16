
import React, { createElement, ReactNode } from 'react';
import { useAnimatedText } from '@/hooks/use-animated-text';

interface AnimatedTextProps {
  as?: React.ElementType;
  children: ReactNode;
  className?: string;
  animation?: 'breath-fade-up' | 'breath-fade-up-1' | 'breath-fade-up-2' | 'breath-fade-up-3' | 'breath-fade-up-4' | 'breath-fade-up-5';
  words?: boolean;
  delay?: number;
}

export const AnimatedText = ({
  as = 'span',
  children,
  className = '',
  animation = 'breath-fade-up',
  words = false,
  delay = 0,
}: AnimatedTextProps) => {
  const { ref, renderAnimatedText } = useAnimatedText({
    animation,
    words,
  });

  return createElement(
    as,
    { ref, className, style: { animationDelay: delay ? `${delay}ms` : undefined } },
    typeof children === 'string'
      ? renderAnimatedText(children)
      : children
  );
};

export default AnimatedText;
