
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Gallery from "./pages/Gallery";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
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
import PaymentSuccess from "./pages/PaymentSuccess";
import AdminSetup from "./pages/AdminSetup";
import { ProtectedRoutes } from "./components/auth/ProtectedRoutes";
import { AdminProtectedRoute } from "./components/auth/AdminProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            
            <BrowserRouter>
            <CartDrawer />
            <Routes>
              {/* Public routes - always accessible */}
              <Route path="/admin-setup" element={<AdminSetup />} />
              <Route path="/payment-success" element={<PageTransition><PaymentSuccess /></PageTransition>} />
              
              {/* Protected routes - show Coming Soon if not authenticated */}
              <Route path="/" element={<ProtectedRoutes><PageTransition><Index /></PageTransition></ProtectedRoutes>} />
              <Route path="/shop" element={<ProtectedRoutes><PageTransition><Shop /></PageTransition></ProtectedRoutes>} />
              <Route path="/open-box" element={<ProtectedRoutes><PageTransition><OpenBox /></PageTransition></ProtectedRoutes>} />
              <Route path="/gallery" element={<ProtectedRoutes><PageTransition><Gallery /></PageTransition></ProtectedRoutes>} />
              <Route path="/shop/:productId" element={<ProtectedRoutes><PageTransition><ProductDetail /></PageTransition></ProtectedRoutes>} />
              <Route path="/checkout" element={<ProtectedRoutes><PageTransition><Checkout /></PageTransition></ProtectedRoutes>} />
              <Route path="/blog" element={<ProtectedRoutes><PageTransition><Blog /></PageTransition></ProtectedRoutes>} />
              <Route path="/blog/:id" element={<ProtectedRoutes><PageTransition><BlogPost /></PageTransition></ProtectedRoutes>} />
              <Route path="/brand/*" element={<ProtectedRoutes><PageTransition><Brand /></PageTransition></ProtectedRoutes>} />
              <Route path="/content/:slug" element={<ProtectedRoutes><PageTransition><ContentPage /></PageTransition></ProtectedRoutes>} />
              <Route path="/hero-gallery-demo" element={<ProtectedRoutes><PageTransition><HeroGalleryDemo /></PageTransition></ProtectedRoutes>} />
              <Route path="/our-story" element={<ProtectedRoutes><PageTransition><OurStory /></PageTransition></ProtectedRoutes>} />
              <Route path="/admin/*" element={<AdminProtectedRoute><Admin /></AdminProtectedRoute>} />
              <Route path="/contact" element={<ProtectedRoutes><PageTransition><Contact /></PageTransition></ProtectedRoutes>} />
              <Route path="/gift" element={<ProtectedRoutes><PageTransition><Gift /></PageTransition></ProtectedRoutes>} />
              <Route path="/privacy-policy" element={<ProtectedRoutes><PageTransition><PrivacyPolicy /></PageTransition></ProtectedRoutes>} />
              <Route path="/terms-of-service" element={<ProtectedRoutes><PageTransition><TermsOfService /></PageTransition></ProtectedRoutes>} />
              <Route path="/accessibility" element={<ProtectedRoutes><PageTransition><Accessibility /></PageTransition></ProtectedRoutes>} />
              
              {/* Catch-all route */}
              <Route path="*" element={<ProtectedRoutes><PageTransition><NotFound /></PageTransition></ProtectedRoutes>} />
            </Routes>
            </BrowserRouter>
          </CartProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
