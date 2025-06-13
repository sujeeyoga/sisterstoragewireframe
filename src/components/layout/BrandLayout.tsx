
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
      {/* Fixed Navigation Arrow */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-50 w-12 h-12 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black border border-white/20 hover:border-white flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 shadow-lg"
        style={{ borderRadius: '0px' }}
        aria-label="Back to home page"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>
      
      <main>
        {children}
      </main>
    </div>
  );
};

export default BrandLayout;
