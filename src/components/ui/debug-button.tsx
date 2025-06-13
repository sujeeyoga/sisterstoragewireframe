
import React from 'react';
import { Button as OriginalButton } from '@/components/ui/button';

interface DebugButtonProps extends React.ComponentProps<typeof OriginalButton> {
  children: React.ReactNode;
}

const DebugButton = ({ children, ...props }: DebugButtonProps) => {
  // Debug: Check if children is an array or has multiple elements
  React.useEffect(() => {
    if (React.Children.count(children) > 1) {
      console.error('Button has multiple children:', React.Children.toArray(children));
    }
  }, [children]);

  return (
    <OriginalButton {...props}>
      {children}
    </OriginalButton>
  );
};

export default DebugButton;
