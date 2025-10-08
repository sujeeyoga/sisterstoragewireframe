import { useState, useEffect } from 'react';
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
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

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
      <div className={`w-full grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-300 ${
        isSticky ? 'py-2 px-4' : 'py-3 px-4'
      }`}>
        {/* Left: Logo */}
        <div className="justify-self-start shrink-0">
          <EnhancedLogo 
            size={isSticky ? "md" : "lg"} 
            scrolled={isSticky}
            className="animate-fade-in transition-all duration-300"
            loading="eager"
          />
        </div>

        <div className="justify-self-center flex justify-center">
          {/* Full menu ≥1280px */}
          <div className="hidden xl:flex items-center gap-8">
            <Link to="/" className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] focus:ring-offset-2 min-h-[44px] flex items-center ${location.pathname === '/' ? 'bg-brand-pink text-white' : 'text-black hover:text-brand-pink hover:bg-brand-pink/10'}`}>HOME</Link>
            <Link to="/gallery" className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] ${location.pathname === '/gallery' ? 'bg-brand-pink text-white' : 'text-black hover:text-brand-pink hover:bg-brand-pink/10'}`}>GALLERY</Link>
            <Link to="/about" className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] ${location.pathname === '/about' ? 'bg-brand-pink text-white' : 'text-black hover:text-brand-pink hover:bg-brand-pink/10'}`}>ABOUT</Link>
            <Link to="/shop" className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] ${location.pathname === '/shop' ? 'bg-brand-pink text-white' : 'text-black hover:text-brand-pink hover:bg-brand-pink/10'}`}>SHOP</Link>
          </div>
          
          {/* Condensed menu 768-1279px */}
          <div className="hidden lg:flex xl:hidden items-center gap-6">
            <Link to="/" className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] focus:ring-offset-2 min-h-[44px] flex items-center ${location.pathname === '/' ? 'bg-brand-pink text-white' : 'text-black hover:text-brand-pink hover:bg-brand-pink/10'}`}>HOME</Link>
            <Link to="/gallery" className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] ${location.pathname === '/gallery' ? 'bg-brand-pink text-white' : 'text-black hover:text-brand-pink hover:bg-brand-pink/10'}`}>GALLERY</Link>
            <Link to="/shop" className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] ${location.pathname === '/shop' ? 'bg-brand-pink text-white' : 'text-black hover:text-brand-pink hover:bg-brand-pink/10'}`}>SHOP</Link>
          </div>
        </div>

        {/* Right: Cart and Menu */}
        <div className="justify-self-end shrink-0 flex items-center gap-2">
          <button
            onClick={() => setCartOpen(true)}
            className="p-2 text-black hover:bg-black/10 rounded transition-colors relative focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-6 w-6" />
            {totalItems > 0 && (
              <span 
                className="absolute -top-1 -right-1 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold bg-[hsl(var(--brand-pink))]"
              >
                {totalItems}
              </span>
            )}
          </button>
          <button 
            className="lg:hidden p-3 text-black focus:outline-none hover:bg-[hsl(var(--brand-pink)/0.1)] rounded-full transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center focus:ring-2 focus:ring-[hsl(var(--brand-pink))] transform hover:scale-110"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative">
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-[hsl(var(--brand-pink))] rotate-0 transition-all duration-300" />
              ) : (
                <Menu className="h-6 w-6 text-[hsl(var(--brand-pink))] transition-all duration-300" />
              )}
            </div>
          </button>
        </div>
      </div>


      {/* Mobile Menu - Clean navbar style */}
      <div 
        className={`lg:hidden fixed inset-0 z-[60] transition-all duration-300 ease-out ${
          mobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/20 transition-all duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
        
        {/* Clean slide-in panel */}
        <aside className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          
          {/* Header - Simple like navbar */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <EnhancedLogo size="md" className="shrink-0" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-black hover:text-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-pink)/0.1)] rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Navigation - Match navbar style */}
          <nav className="flex-1 overflow-y-auto py-6">
            <div className="px-6 space-y-1">
              {[
                { name: 'HOME', path: '/' },
                { name: 'GALLERY', path: '/gallery' },
                { name: 'ABOUT', path: '/about' },
                { name: 'SHOP', path: '/shop' }
              ].map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block w-full text-left px-4 py-3 rounded-full font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] ${
                      isActive 
                        ? 'bg-brand-pink text-white' 
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

            {/* Additional Navigation Items */}
            <div className="px-6 space-y-1">
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
                    className={`block w-full text-left px-4 py-3 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] ${
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
            </div>

            {/* Divider */}
            <div className="mx-6 my-6 h-px bg-gray-200" />

            {/* Cart Section - Match navbar cart styling */}
            <div className="px-6">
              <button
                onClick={() => { setMobileMenuOpen(false); setCartOpen(true); }}
                className="w-full flex items-center justify-between p-4 text-black hover:text-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-pink))]/5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))]"
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
          <div className="p-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-3">Follow Sister Storage</p>
              <div className="flex justify-center space-x-3">
                <a 
                  href="https://instagram.com/sisterstorage" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[hsl(var(--brand-pink))] rounded-full flex items-center justify-center text-white hover:bg-[hsl(var(--brand-pink))]/90 transition-colors"
                >
                  <span className="text-sm font-bold">IG</span>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-[hsl(var(--brand-pink))] rounded-full flex items-center justify-center text-white hover:bg-[hsl(var(--brand-pink))]/90 transition-colors"
                >
                  <span className="text-sm font-bold">FB</span>
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Navbar;
