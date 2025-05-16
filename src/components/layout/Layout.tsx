
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLocation } from "react-router-dom";
import SaleBanner from "../SaleBanner";
import ScrollFadeContainer from "../ui/scroll-fade-container";

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

  // Apply scroll animations to main content by wrapping children
  const scrollAnimatedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    
    return (
      <ScrollFadeContainer
        scrollFadeDirection="both"
        threshold={0.1}
        delay={index * 0.1}
        duration={0.8}
        className="mb-8"
      >
        {child}
      </ScrollFadeContainer>
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <SaleBanner />
      <main className="flex-grow pt-16">
        {scrollAnimatedChildren}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
