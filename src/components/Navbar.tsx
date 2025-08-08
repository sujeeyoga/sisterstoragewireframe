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
  
  // Calculate scroll-based styling with enhanced backdrop for hero section
  const isScrolled = position > 20;
  const scrollProgress = Math.min(1, position / 100);
  const bgOpacity = Math.min(0.95, 0.80 + (scrollProgress * 0.15));
  const backdropBlur = Math.min(16, 6 + (scrollProgress * 10));

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
      <nav className="w-full flex items-center justify-between h-16 px-4">
        {/* Left: Back button or spacer */}
        <div className="shrink-0">
          {!isMobile ? (
            <button
              onClick={handleBack}
              className="p-1.5 text-black focus:outline-none hover:bg-black/10 rounded transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          ) : (
            <div className="w-9 h-9" /> // Spacer to maintain center alignment
          )}
        </div>

        {/* Center: Logo */}
        <div className="flex-1 flex justify-center">
          <EnhancedLogo 
            size="xl" 
            scrolled={isScrolled}
            className="animate-fade-in"
            loading="eager"
          />
        </div>

        {/* Right: Cart and Menu */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={() => setCartOpen(true)}
            className="p-1.5 text-black hover:bg-black/10 rounded transition-colors relative"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-pink text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold">
                {totalItems}
              </span>
            )}
          </button>
          <button 
            className="p-1.5 text-black focus:outline-none hover:bg-black/10 rounded transition-colors"
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
      </nav>


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
