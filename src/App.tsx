
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Brand from "./pages/Brand";
import ProductDetail from "./pages/ProductDetail";
import HeroGalleryDemo from "./pages/HeroGalleryDemo";
import ContentPage from "./pages/ContentPage";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Accessibility from "./pages/Accessibility";
import Contact from "./pages/Contact";
import Gift from "./pages/Gift";
import { CartProvider } from "./contexts/CartContext";
import CartDrawer from "../src/components/CartDrawer";
import OurStory from "./pages/OurStory";
import ScreenLoader from "./components/ui/ScreenLoader";
import React, { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          
          {/* Screen Loader */}
          {isLoading && <ScreenLoader onComplete={handleLoadingComplete} />}
          
          <BrowserRouter>
            <CartDrawer />
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/shop/:productId" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/brand/*" element={<Brand />} />
            <Route path="/content/:slug" element={<ContentPage />} />
            <Route path="/hero-gallery-demo" element={<HeroGalleryDemo />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gift" element={<Gift />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/accessibility" element={<Accessibility />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
