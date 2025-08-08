
import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SaleBanner from "../SaleBanner";
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

  // Pill animation with direct DOM manipulation
  useEffect(() => {
    const pillNav = document.getElementById('pillNav');
    if (!pillNav) return;

    // Set initial state and reveal after DOM load
    pillNav.classList.add('pill--mini');
    const readyTimer = setTimeout(() => pillNav.classList.add('is-ready'), 100);
    
    // Setup intersection observer for hero
    const hero = document.getElementById('hero');
    if (!hero) return () => clearTimeout(readyTimer);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          pillNav.classList.remove('pill--mini');
          pillNav.classList.add('pill--open');
        } else {
          pillNav.classList.remove('pill--open');
          pillNav.classList.add('pill--mini');
        }
      },
      { threshold: [0, 0.25, 1] }
    );

    observer.observe(hero);

    return () => {
      clearTimeout(readyTimer);
      observer.disconnect();
    };
  }, [location.pathname]);

  // Calculate spacing based on variant and spacing prop
  const getMainPadding = () => {
    if (variant === 'brand' || variant === 'full') return 'pt-0';
    
    const spacingMap = {
      none: 'pt-0',
      compact: 'pt-0',
      normal: 'pt-0',
      spacious: 'pt-0'
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
      {shouldShowStandardHeader && (
        <>
          {/* Full-bleed header wrapper */}
          <header className="relative inset-x-0 z-50 overflow-visible pb-6">
            {/* Pink background layer (fixed, full-bleed) */}
            <div 
              className="fixed top-0 inset-x-0 h-[140px] bg-[hsl(var(--brand-pink))] z-0 pointer-events-none"
            />
            
            {/* Announcement bar (scrolls away) */}
            {showSaleBanner && (
              <SaleBanner position={position} />
            )}
          </header>
        </>
      )}
      
      {/* Pill navigation (sticky on all pages) */}
      <nav 
        ref={navRef} 
        id="pillNav"
        className="pill-nav-base"
      >
        <Navbar position={position} />
      </nav>

      <main className={`flex-grow ${getMainPadding()}`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default BaseLayout;
