
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLocation } from "react-router-dom";
import SaleBanner from "../SaleBanner";
import AnimatedText from "../ui/animated-text";

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

  // Apply section animations to main content by wrapping children
  const animatedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    
    return (
      <AnimatedText
        as="div"
        container={true}
        animation={`breath-fade-up-${(index % 5) + 1}` as any}
        delay={index * 150}
        duration={2} // Slower animation for sections
      >
        {child}
      </AnimatedText>
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <SaleBanner />
      <main className="flex-grow pt-16">
        {animatedChildren}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
