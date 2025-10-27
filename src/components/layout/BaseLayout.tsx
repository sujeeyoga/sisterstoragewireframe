import React, { useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SaleBanner from "@/components/SaleBanner";
import useScrollDirection from "@/hooks/use-scroll-direction";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft } from "lucide-react";
import { useVisitorPresence } from "@/hooks/useVisitorPresence";

export type LayoutVariant = 'standard' | 'brand' | 'minimal' | 'full';
export type SpacingVariant = 'none' | 'compact' | 'normal' | 'spacious';
export type BackgroundVariant = 'white' | 'gray' | 'dark' | 'gradient';

interface BaseLayoutProps {
  children: React.ReactNode;
  variant?: LayoutVariant;
  showFooter?: boolean;
  showSaleBanner?: boolean;
  spacing?: SpacingVariant;
  background?: BackgroundVariant;
  className?: string;
  pageId?: string;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  variant = 'standard',
  showFooter = true,
  showSaleBanner = true,
  spacing = 'normal',
  background = 'white',
  className = '',
  pageId
}) => {
  const location = useLocation();
  const { position } = useScrollDirection(10);
  const isMobile = useIsMobile();
  const navRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Track visitor presence (only track for non-admin pages)
  const shouldTrack = !location.pathname.startsWith('/admin');
  useVisitorPresence(shouldTrack);

  // Set loading to false after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // ===== UTILITY FUNCTIONS =====
  const getBackgroundClasses = () => {
    const backgroundMap = {
      white: 'bg-white',
      gray: 'bg-gray-50',
      dark: 'bg-black text-white',
      gradient: 'bg-gradient-to-br from-white via-gray-50 to-gray-100'
    };
    return backgroundMap[background];
  };

  const getMainPadding = () => {
    if (variant === 'brand' || variant === 'full') return 'pt-0';
    const spacingMap = {
      none: 'pt-6',
      compact: 'pt-6',
      normal: 'pt-8',
      spacious: 'pt-12'
    };
    return spacingMap[spacing];
  };

  // ===== EFFECTS =====
  
  // Track nav height for other sticky elements
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    
    const updateNavOffset = () => {
      const navHeight = el.getBoundingClientRect().height || 64;
      const containerEl = el.parentElement as HTMLElement | null;
      let containerPadding = 0;
      if (containerEl) {
        const styles = getComputedStyle(containerEl);
        const pt = parseFloat(styles.paddingTop || '0');
        const pb = parseFloat(styles.paddingBottom || '0');
        containerPadding = (isNaN(pt) ? 0 : pt) + (isNaN(pb) ? 0 : pb);
      }
      const extraSpacing = isMobile ? 0 : 12;
      const offset = Math.round(navHeight + containerPadding + extraSpacing);
      document.documentElement.style.setProperty('--sticky-nav-offset', `${offset}px`);
    };
    
    updateNavOffset();
    const resizeObserver = new ResizeObserver(updateNavOffset);
    resizeObserver.observe(el);
    window.addEventListener('resize', updateNavOffset);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateNavOffset);
    };
  }, [isMobile]);

  // Manage page-specific body classes
  useEffect(() => {
    const classes = [];
    
    if (variant === 'brand') classes.push('brand-layout');
    if (location.pathname === '/shop') classes.push('pinterest-layout');
    if (pageId) classes.push(`page-${pageId}`);
    
    classes.forEach(cls => document.body.classList.add(cls));
    
    return () => {
      classes.forEach(cls => document.body.classList.remove(cls));
    };
  }, [location.pathname, variant, pageId]);

  // Handle smooth scrolling for anchor links
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  // ===== RENDER VARIANTS =====
  
  // Brand/Full layout with back button
  if (variant === 'brand' || variant === 'full') {
    const showBackButton = variant === 'brand';
    
    return (
      <div className={`min-h-screen ${getBackgroundClasses()} ${className}`}>
        {showBackButton && (
          <Link
            to="/"
            className="fixed top-6 left-6 z-50 w-12 h-12 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black border border-white/20 hover:border-white flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 shadow-lg"
            style={{ borderRadius: '0px' }}
            aria-label="Back to home page"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}

        <main className={getMainPadding()}>
          {children}
        </main>
        {showFooter && <Footer />}
      </div>
    );
  }

  // Standard layout with navigation
  return (
    <div className={`min-h-screen ${getBackgroundClasses()} ${className}`} style={{ position: 'relative' }}>
      {/* Sale Banner - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <SaleBanner />
      </div>
      
      {/* Navigation: White navbar floating below banner */}
      <nav 
        ref={navRef} 
        className="fixed top-10 left-0 right-0 z-50 py-3"
      >
        <div className={`w-[min(1100px,calc(100%-40px))] mx-auto rounded-[25px] shadow-lg px-4 py-2 transition-colors duration-300 ${
          isLoading ? 'bg-[hsl(var(--brand-pink)/0.2)]' : 'bg-white'
        }`}>
          <Navbar position={position} />
        </div>
      </nav>
      
      {/* Static pink background strip behind nav */}
      <div className="h-[120px] bg-[hsl(var(--brand-pink))] pt-3 pb-3" />
      
      {/* Main content with proper top spacing */}
      <main className="bg-background" style={{ outline: 'none' }}>
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default BaseLayout;
