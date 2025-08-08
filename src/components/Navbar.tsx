import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Mail, ArrowLeft, Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useNavigate } from 'react-router-dom';
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
  
  // Calculate scroll-based styling for sticky positioning
  const isSticky = position > 140; // When announcement bar scrolls away
  const shadowDepth = isSticky ? 'shadow-xl' : 'shadow-lg';

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
            <Link to="/gallery" className="text-black font-medium transition-colors hover:text-[var(--brand-pink)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)] rounded px-2 py-1">GALLERY</Link>
            <Link to="/about" className="text-black font-medium transition-colors hover:text-[var(--brand-pink)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)] rounded px-2 py-1">ABOUT</Link>
            <Link to="/shop" className="text-black font-medium transition-colors hover:text-[var(--brand-pink)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)] rounded px-2 py-1">SHOP</Link>
          </div>
          
          {/* Condensed menu 768-1279px */}
          <div className="hidden lg:flex xl:hidden items-center gap-6">
            <Link to="/gallery" className="text-black font-medium transition-colors hover:text-[var(--brand-pink)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)] rounded px-2 py-1">GALLERY</Link>
            <Link to="/shop" className="bg-[var(--brand-pink)] text-white px-4 py-2 rounded-full font-medium transition-colors hover:bg-[var(--brand-pink)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)] focus:ring-offset-2 min-h-[44px] flex items-center">SHOP</Link>
          </div>
        </div>

        {/* Right: Cart and Menu */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={() => setCartOpen(true)}
            className="p-2 text-black hover:bg-black/10 rounded transition-colors relative focus:outline-none focus:ring-2 focus:ring-[var(--brand-pink)] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-6 w-6" />
            {totalItems > 0 && (
              <span 
                className="absolute -top-1 -right-1 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold bg-[var(--brand-pink)]"
              >
                {totalItems}
              </span>
            )}
          </button>
          <button 
            className="lg:hidden p-2 text-black focus:outline-none hover:bg-black/10 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:ring-2 focus:ring-[var(--brand-pink)]"
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
        className={`md:hidden fixed inset-0 z-60 transform transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop overlay */}
        <div className="absolute inset-0 bg-white shadow-2xl border-r border-gray-200"></div>
        
        {/* Menu content */}
        <nav className="flex flex-col space-y-8 items-center mt-8 pt-28 px-8">
          {[
            { name: 'HOME', path: '/', icon: Home },
            { name: 'GALLERY', path: '/gallery' },
            { name: 'ABOUT US', path: '/about' },
            { name: 'SHIPPING', path: '#delivery', icon: Package },
            { name: 'SHOPPING CART', path: '#', icon: ShoppingBag, onClick: () => { setMobileMenuOpen(false); setCartOpen(true); } }
          ].map((item) => (
            item.onClick ? (
              <button
                key={item.name}
                onClick={item.onClick}
                className="text-[#E90064] text-xl font-bold hover:text-[#c80056] hover:bg-[#E90064]/10 transition-all duration-300 flex items-center gap-3 px-6 py-3 rounded-lg w-full max-w-xs text-center justify-center"
              >
                {item.icon && <item.icon className="h-6 w-6" />}
                {item.name} ({totalItems})
              </button>
            ) : (
              <Link 
                key={item.name} 
                to={item.path} 
                className="text-[#E90064] text-xl font-bold hover:text-[#c80056] hover:bg-[#E90064]/10 transition-all duration-300 flex items-center gap-3 px-6 py-3 rounded-lg w-full max-w-xs text-center justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon && <item.icon className="h-6 w-6" />}
                {item.name}
              </Link>
            )
          ))}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
