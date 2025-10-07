
import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/shop/PromoBanner";
import useScrollDirection from "@/hooks/use-scroll-direction";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

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
  const { isAtTop, position, direction } = useScrollDirection(10);
  const isMobile = useIsMobile();
  const isShop = location.pathname === '/shop';
  const navPositionClass = 'sticky top-3';

  // Track nav element to compute a global offset for other sticky bars
  const navRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const update = () => {
      const h = el.getBoundingClientRect().height || 64;
      const offset = Math.round(h + 12); // match nav top-[12px]
      document.documentElement.style.setProperty('--sticky-nav-offset', `${offset}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  // Calculate spacing based on variant and spacing prop
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

  // Calculate background classes
  const getBackgroundClasses = () => {
    const backgroundMap = {
      white: 'bg-white',
      gray: 'bg-gray-50',
      dark: 'bg-black text-white',
      gradient: 'bg-gradient-to-br from-white via-gray-50 to-gray-100'
    };
    return backgroundMap[background];
  };

  // Header configuration based on variant
  const shouldShowStandardHeader = variant === 'standard' || variant === 'minimal';
  const shouldShowBrandBackButton = variant === 'brand';

  // Calculate header transform and effects based on scroll position
  const headerShrinkFactor = Math.min(1, Math.max(0.95, 1 - (position / 300)));
  const headerShadowOpacity = Math.min(0.15, (position / 200));
  
  // Header visibility logic
  const headerTranslateY = isMobile && direction === 'down' && position > 150 && !isAtTop ? -100 : 0;
  const headerVisibilityTransform = `translateY(${headerTranslateY}%)`;

  // Handle page-specific body classes and effects
  useEffect(() => {
    // Add base animation class
    document.body.classList.add('animate-fade-in');
    
    // Add variant-specific classes
    if (variant === 'brand') {
      document.body.classList.add('brand-layout');
    } else if (location.pathname === '/shop') {
      document.body.classList.add('pinterest-layout');
    }
    
    // Add page-specific class if provided
    if (pageId) {
      document.body.classList.add(`page-${pageId}`);
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('animate-fade-in', 'brand-layout', 'pinterest-layout');
      if (pageId) {
        document.body.classList.remove(`page-${pageId}`);
      }
    };
  }, [location.pathname, variant, pageId]);

  // Handle smooth scrolling for anchor links
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  if (variant === 'brand' || variant === 'full') {
    return (
      <div className={`min-h-screen ${getBackgroundClasses()} ${className}`}>
        {shouldShowBrandBackButton && (
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

  return (
    <div className={`min-h-screen flex flex-col overflow-visible ${getBackgroundClasses()} ${className}`}>
      {/* Fixed pink background layer that extends to cover sticky nav area */}
      <div className="fixed top-0 left-0 right-0 h-[200px] bg-[hsl(var(--brand-pink))] z-0" />
      
      <main className={`flex-grow ${getMainPadding()} relative z-10`}>
        {/* Content section with proper spacing */}
        <div className="pt-4">
          {/* Black announcement banner */}
          {showSaleBanner && (
            <div className="mb-4">
              <PromoBanner />
            </div>
          )}
          
          {/* Navigation - white background with margins */}
          <nav ref={navRef} className="relative z-50 w-[min(1100px,calc(100%-40px))] mx-auto rounded-[25px] bg-white overflow-visible shadow-lg px-4 py-2 mb-4">
            <Navbar position={position} />
          </nav>
        </div>
        
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default BaseLayout;
