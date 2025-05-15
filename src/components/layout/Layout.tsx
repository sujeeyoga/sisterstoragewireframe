
import React from "react";
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="mt-16 md:mt-20">
        <SaleBanner />
      </div>
      <main className="flex-grow pt-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
