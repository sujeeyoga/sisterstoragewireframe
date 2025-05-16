
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLocation } from "react-router-dom";
import SaleBanner from "../SaleBanner";
import useScrollDirection from "@/hooks/use-scroll-direction";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isAtTop, position, direction, isScrolling } = useScrollDirection(10);
  const isMobile = useIsMobile();
  
  // Calculate header transform and effects based on scroll position
  const headerShrinkFactor = Math.min(1, Math.max(0.95, 1 - (position / 300)));
  const headerShadowOpacity = Math.min(0.15, (position / 200));
  
  // Calculate header visibility transform for mobile
  const shouldHideHeader = isMobile && direction === 'down' && position > 150 && !isAtTop;
  const headerVisibilityTransform = shouldHideHeader ? 'translateY(-100%)' : 'translateY(0)';

  // Function to check if the current page is a blog post or product detail
  // These pages might need special handling in the future
  const isDetailPage = () => {
    return location.pathname.includes('/shop/') || location.pathname.includes('/blog/');
  };

  // Add a class to the body when the component mounts
  useEffect(() => {
    // Add animated state to body when page loads
    document.body.classList.add('animate-fade-in');
    
    // Pinterest-style layout needs additional styling
    if (location.pathname === '/shop') {
      document.body.classList.add('pinterest-layout');
    } else {
      document.body.classList.remove('pinterest-layout');
    }
    
    // Remove animation class when component unmounts
    return () => {
      document.body.classList.remove('animate-fade-in');
      document.body.classList.remove('pinterest-layout');
    };
  }, [location.pathname]);

  // Handle smooth scrolling for anchor links
  useEffect(() => {
    // Check if the location contains a hash
    if (location.hash) {
      // Get the element to scroll to
      const element = document.querySelector(location.hash);
      if (element) {
        // Wait a bit for the page to render
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      }
    } else {
      // Scroll to top when changing pages
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <div 
        className="header-container fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          transform: `${headerVisibilityTransform} scale(${headerShrinkFactor})`,
          transformOrigin: 'top center',
          boxShadow: `0 4px 20px rgba(0,0,0,${headerShadowOpacity})`,
        }}
      >
        <Navbar position={position} />
        <SaleBanner position={position} />
      </div>
      <main className="flex-grow pt-32">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
