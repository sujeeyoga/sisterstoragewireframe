import React, { useEffect } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <>{children}</>;
};

export default PageTransition;