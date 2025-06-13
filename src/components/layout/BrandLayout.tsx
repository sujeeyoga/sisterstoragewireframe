
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface BrandLayoutProps {
  children: React.ReactNode;
}

const BrandLayout: React.FC<BrandLayoutProps> = ({ children }) => {
  const location = useLocation();

  // Add a class to the body when the component mounts
  useEffect(() => {
    document.body.classList.add('animate-fade-in');
    document.body.classList.add('brand-layout');
    
    // Remove animation class when component unmounts
    return () => {
      document.body.classList.remove('animate-fade-in');
      document.body.classList.remove('brand-layout');
    };
  }, [location.pathname]);

  // Handle smooth scrolling for anchor links
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <main>
        {children}
      </main>
    </div>
  );
};

export default BrandLayout;
