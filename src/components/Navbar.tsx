import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, ShoppingBag, Home, Package, Info, Image, Newspaper, Palette, BookOpen, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import EnhancedLogo from '@/components/ui/enhanced-logo';

interface NavbarProps {
  position?: number;
}

const Navbar = ({ position = 0 }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { totalItems, isOpen: isCartOpen, setIsOpen: setCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Hide cart icon on checkout page or when cart is open
  const shouldHideCart = location.pathname === '/checkout' || isCartOpen;

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Calculate scroll-based styling for sticky positioning
  const isSticky = position > 16; // Slightly after scroll begins

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile) {
      if (mobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, isMobile]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div 
        className={`w-full grid grid-cols-[1fr_auto_1fr] items-center ${
          isSticky ? 'py-1.5 px-3' : 'py-2 px-3'
        }`}
      >
        {/* Left: Logo */}
        <div className="justify-self-start shrink-0">
          <EnhancedLogo 
            size="3xl"
            scrolled={isSticky}
            loading="eager"
          />
        </div>

        <div className="justify-self-center flex justify-center">
          {/* Full menu ≥1280px */}
          <div className="hidden xl:flex items-center gap-6">
            <Link to="/" className={`px-4 py-2 rounded-full font-medium text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] focus:ring-offset-2 min-h-[40px] flex items-center bg-brand-pink text-white ${location.pathname === '/' ? 'shadow-lg' : 'bg-opacity-90 hover:shadow-lg'}`}>HOME</Link>
            <Link to="/gallery" className={`px-3 py-2 rounded-full font-medium text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] bg-brand-pink text-white ${location.pathname === '/gallery' ? 'shadow-lg' : 'bg-opacity-90 hover:shadow-lg'}`}>GALLERY</Link>
            <Link to="/shop" className={`px-3 py-2 rounded-full font-medium text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] bg-brand-pink text-white ${location.pathname === '/shop' ? 'shadow-lg' : 'bg-opacity-90 hover:shadow-lg'}`}>SHOP</Link>
          </div>
          
          {/* Condensed menu 768-1279px */}
          <div className="hidden lg:flex xl:hidden items-center gap-4">
            <Link to="/" className={`px-4 py-2 rounded-full font-medium text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] focus:ring-offset-2 min-h-[40px] flex items-center bg-brand-pink text-white ${location.pathname === '/' ? 'shadow-lg' : 'bg-opacity-90 hover:shadow-lg'}`}>HOME</Link>
            <Link to="/gallery" className={`px-3 py-2 rounded-full font-medium text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] bg-brand-pink text-white ${location.pathname === '/gallery' ? 'shadow-lg' : 'bg-opacity-90 hover:shadow-lg'}`}>GALLERY</Link>
            <Link to="/shop" className={`px-3 py-2 rounded-full font-medium text-base focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] bg-brand-pink text-white ${location.pathname === '/shop' ? 'shadow-lg' : 'bg-opacity-90 hover:shadow-lg'}`}>SHOP</Link>
          </div>
        </div>

        {/* Right: Cart and Menu */}
        <div className="justify-self-end shrink-0 flex items-center gap-2">
          {!shouldHideCart && (
            <button
              onClick={() => {
                setCartOpen(true);
                setMobileMenuOpen(false);
              }}
              className="p-2 text-black hover:bg-black/10 rounded relative focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span 
                  className="absolute -top-1 -right-1 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold bg-[hsl(var(--brand-pink))]"
                >
                  {totalItems}
                </span>
              )}
            </button>
          )}
          <button 
            className="lg:hidden p-2.5 text-black focus:outline-none hover:bg-[hsl(var(--brand-pink)/0.1)] rounded-full min-h-[40px] min-w-[40px] flex items-center justify-center focus:ring-2 focus:ring-[hsl(var(--brand-pink))]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <div className="relative">
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-[hsl(var(--brand-pink))]" />
              ) : (
                <Menu className="h-5 w-5 text-[hsl(var(--brand-pink))]" />
              )}
            </div>
          </button>
        </div>
      </div>


      {/* Mobile Menu - Render via portal to avoid transform issues */}
      {mobileMenuOpen && createPortal(
        (
          <div 
            className="lg:hidden fixed inset-0 z-[1000]"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            
            {/* Clean slide-in panel */}
            <aside className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col overflow-hidden">
              {/* Header - Simple like navbar */}
              <div className="flex-shrink-0 p-6 border-b border-gray-100 bg-white">
                <div className="flex items-center justify-between">
                  <EnhancedLogo size="lg" className="shrink-0" />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-black hover:text-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-pink)/0.1)] rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Close navigation menu"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Navigation - Match navbar style */}
              <nav className="flex-1 overflow-y-auto py-6 bg-white" role="navigation" aria-label="Primary navigation">
                <div className="px-6 space-y-1">
                  {[
                    { name: 'HOME', path: '/' },
                    { name: 'GALLERY', path: '/gallery' },
                    { name: 'SHOP', path: '/shop' }
                  ].map((item) => {
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`block w-full text-left px-4 py-3 rounded-full font-medium text-xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] ${
                          isActive 
                            ? 'text-brand-pink' 
                            : 'text-black hover:text-brand-pink hover:bg-brand-pink/10'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="mx-6 my-6 h-px bg-gray-200" />

                {/* Additional Navigation Items - Hidden per user request */}
                {/* <div className="px-6 space-y-1">
                  {[
                    { name: 'OUR STORY', path: '/our-story' },
                    { name: 'BLOG', path: '/blog' },
                    { name: 'BRAND', path: '/brand' }
                  ].map((item) => {
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`block w-full text-left px-4 py-3 rounded-full font-medium text-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] ${
                          isActive 
                            ? 'text-[hsl(var(--brand-pink))] bg-[hsl(var(--brand-pink))]/10' 
                            : 'text-black hover:text-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-pink))]/5'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div> */}

                {/* Divider */}
                <div className="mx-6 my-6 h-px bg-gray-200" />

                {/* Cart Section - Match navbar cart styling */}
                <div className="px-6">
                  <button
                    onClick={() => { 
                      setMobileMenuOpen(false); 
                      setTimeout(() => setCartOpen(true), 100);
                    }}
                    className="w-full flex items-center justify-between p-4 text-black hover:text-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-pink))]/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))]"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="h-6 w-6" />
                      <span className="font-medium">Shopping Cart</span>
                    </div>
                    {totalItems > 0 && (
                      <span className="text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold bg-[hsl(var(--brand-pink))]">
                        {totalItems}
                      </span>
                    )}
                  </button>
                </div>
              </nav>

              {/* Footer - Simple */}
              <div className="flex-shrink-0 p-6 border-t border-gray-100 bg-white">
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-3">Follow Sister Storage</p>
                  <div className="flex justify-center gap-3">
                    <a 
                      href="https://instagram.com/sisterstorageinc" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-[hsl(var(--brand-pink))] rounded-full flex items-center justify-center text-white hover:bg-[hsl(var(--brand-pink))]/90"
                      aria-label="Follow us on Instagram"
                    >
                      <span className="text-sm font-bold" aria-hidden="true">IG</span>
                    </a>
                    <a 
                      href="https://facebook.com/sisterstorage" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-[hsl(var(--brand-pink))] rounded-full flex items-center justify-center text-white hover:bg-[hsl(var(--brand-pink))]/90"
                      aria-label="Follow us on Facebook"
                    >
                      <span className="text-sm font-bold" aria-hidden="true">FB</span>
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        ),
        document.body
      )}

    </>
  );
};

export default Navbar;
