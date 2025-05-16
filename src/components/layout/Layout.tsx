
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLocation } from "react-router-dom";
import SaleBanner from "../SaleBanner";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Function to check if the current page is a blog post or product detail
  // These pages might need special handling in the future
  const isDetailPage = () => {
    return location.pathname.includes('/shop/') || location.pathname.includes('/blog/');
  };

  // Add a class to the body when the component mounts
  useEffect(() => {
    // Add animated state to body when page loads
    document.body.classList.add('animate-fade-in');
    
    // Remove animation class when component unmounts
    return () => {
      document.body.classList.remove('animate-fade-in');
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
      <Navbar />
      <SaleBanner />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
