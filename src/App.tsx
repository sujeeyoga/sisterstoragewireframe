
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Gallery from "./pages/Gallery";
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
import Checkout from "./pages/Checkout";
import { CartProvider } from "./contexts/CartContext";
import CartDrawer from "../src/components/CartDrawer";
import OurStory from "./pages/OurStory";
import Admin from "./pages/Admin";
import PageTransition from "./components/layout/PageTransition";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          
          <BrowserRouter>
            <CartDrawer />
            <Routes>
              <Route path="/" element={<PageTransition><Index /></PageTransition>} />
              <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
              <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
              <Route path="/shop/:productId" element={<PageTransition><ProductDetail /></PageTransition>} />
              <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
              <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
              <Route path="/brand/*" element={<PageTransition><Brand /></PageTransition>} />
              <Route path="/content/:slug" element={<PageTransition><ContentPage /></PageTransition>} />
              <Route path="/hero-gallery-demo" element={<PageTransition><HeroGalleryDemo /></PageTransition>} />
              <Route path="/our-story" element={<PageTransition><OurStory /></PageTransition>} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
              <Route path="/gift" element={<PageTransition><Gift /></PageTransition>} />
              <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
              <Route path="/terms-of-service" element={<PageTransition><TermsOfService /></PageTransition>} />
              <Route path="/accessibility" element={<PageTransition><Accessibility /></PageTransition>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
