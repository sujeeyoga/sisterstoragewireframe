
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
import OpenBox from "./pages/OpenBox";
import { CartProvider } from "./contexts/CartContext";
import CartDrawer from "../src/components/CartDrawer";
import OurStory from "./pages/OurStory";
import Admin from "./pages/Admin";
import PageTransition from "./components/layout/PageTransition";
import ComingSoon from "./pages/ComingSoon";

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
              <Route path="*" element={<PageTransition><ComingSoon /></PageTransition>} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
