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
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
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
      <div className={`w-full flex items-center justify-between transition-all duration-300 ${
        isSticky ? 'py-2 px-4' : 'py-3 px-4'
      }`}>
        {/* Left: Logo */}
        <div className="shrink-0">
          <EnhancedLogo 
            size={isSticky ? "lg" : "xl"} 
            scrolled={isSticky}
            className="animate-fade-in"
            loading="eager"
          />
        </div>

        <div className="flex-1 flex justify-center">
          {/* Full menu ≥1280px */}
          <div className="hidden xl:flex items-center gap-8">
            <Link to="/gallery" className="text-black font-medium transition-colors hover:text-[hsl(var(--brand-pink))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] rounded px-2 py-1">GALLERY</Link>
            <Link to="/about" className="text-black font-medium transition-colors hover:text-[hsl(var(--brand-pink))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] rounded px-2 py-1">ABOUT</Link>
            <Link to="/shop" className="text-black font-medium transition-colors hover:text-[hsl(var(--brand-pink))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] rounded px-2 py-1">SHOP</Link>
          </div>
          
          {/* Condensed menu 768-1279px */}
          <div className="hidden lg:flex xl:hidden items-center gap-6">
            <Link to="/gallery" className="text-black font-medium transition-colors hover:text-[hsl(var(--brand-pink))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] rounded px-2 py-1">GALLERY</Link>
            <Link to="/shop" className="bg-[hsl(var(--brand-pink))] text-white px-4 py-2 rounded-full font-medium transition-colors hover:bg-[hsl(var(--brand-pink))]/90 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))] focus:ring-offset-2 min-h-[44px] flex items-center">SHOP</Link>
          </div>
        </div>

        {/* Right: Cart and Menu */}
        <div className="shrink-0 flex items-center gap-2">
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
            className="lg:hidden p-2 text-black focus:outline-none hover:bg-black/10 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:ring-2 focus:ring-[hsl(var(--brand-pink))]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>


      {/* Mobile Menu Slide-in from left with proper background and z-index */}
      <div 
        className={`lg:hidden fixed inset-0 z-[60] transform transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop overlay */}
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
        
        {/* Slide-in panel */}
        <aside className="relative z-[1] h-full w-[85%] max-w-sm bg-background text-foreground shadow-2xl border-r border-border">
          <nav className="flex flex-col gap-4 p-6 mt-12">
            {[
              { name: 'HOME', path: '/', icon: Home },
              { name: 'GALLERY', path: '/gallery', icon: Image },
              { name: 'SHOP', path: '/shop', icon: ShoppingCart },
              { name: 'ABOUT', path: '/about', icon: Info },
              { name: 'BLOG', path: '/blog', icon: Newspaper },
              { name: 'BRAND', path: '/brand', icon: Palette },
              { name: 'OUR STORY', path: '/our-story', icon: BookOpen },
              { name: 'SHIPPING', path: '/#delivery', icon: Package },
              { name: 'SHOPPING CART', path: '#', icon: ShoppingBag, onClick: () => { setMobileMenuOpen(false); setCartOpen(true); } }
            ].map((item) => (
              item.onClick ? (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="text-[hsl(var(--brand-pink))] text-lg font-semibold hover:bg-[hsl(var(--brand-pink))]/10 transition-colors flex items-center gap-3 px-4 py-2 rounded-md text-left"
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  <span>{item.name} ({totalItems})</span>
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-foreground text-lg font-medium hover:text-[hsl(var(--brand-pink))] hover:bg-muted transition-colors flex items-center gap-3 px-4 py-2 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon && <item.icon className="h-5 w-5 text-[hsl(var(--brand-pink))]" />}
                  <span>{item.name}</span>
                </Link>
              )
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
};

export default Navbar;
