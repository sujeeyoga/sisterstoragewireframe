
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Mail, ArrowLeft, Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';

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
      <header 
        className={`w-full transition-all duration-300 ${
          isScrolled ? 'py-2' : 'py-4'
        } rounded-b-lg shadow-lg mx-4 mt-2`}
        style={{
          backgroundColor: `rgba(0, 0, 0, ${bgOpacity})`,
          backdropFilter: `blur(${backdropBlur}px)`,
          maxWidth: 'calc(100% - 2rem)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Back Button (only on mobile) */}
          {isMobile && (
            <button
              onClick={handleBack}
              className="mr-2 p-1.5 text-white focus:outline-none hover:bg-white/10 rounded transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          {/* Logo */}
          <Link to="/" className="relative z-10">
            <h1 
              className="text-white font-bold transition-all duration-300"
              style={{ 
                transform: `scale(${isScrolled ? 0.95 : 1})`,
                letterSpacing: `${isScrolled ? '0' : '0.5px'}`,
                textShadow: '0 2px 8px rgba(0,0,0,0.8)'
              }}
            >
              SISTER STORAGE
            </h1>
          </Link>

          {/* Desktop Menu - Removed BUY button, enhanced cart */}
          <nav className="hidden md:flex items-center space-x-6">
            {[
              { name: 'HOME', path: '/', icon: Home },
              { name: 'US SISTERS', path: '/about' },
              { name: 'SHIPPING', path: '#delivery', icon: Package },
              { name: 'CONTACT', path: '#contact', icon: Mail }
            ].map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className={`text-white hover:bg-pink-500 hover:text-white transition-colors duration-300 px-3 py-2 rounded-md font-medium ${item.icon ? 'flex items-center gap-2' : ''}`}
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.name}
              </Link>
            ))}
            
            {/* Enhanced Cart Button */}
            <Button 
              size="lg"
              onClick={() => setCartOpen(true)}
              className="bg-white text-black hover:bg-pink-500 hover:text-white border-2 border-white hover:border-pink-500 font-bold shadow-xl px-6 py-3 transition-all duration-300"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              CART ({totalItems})
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-1.5 text-white focus:outline-none z-50 hover:bg-white/10 rounded transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      {/* Visual transition border */}
      <div className="border-b border-pink-500 mx-4" style={{ maxWidth: 'calc(100% - 2rem)' }} />

      {/* Mobile Menu Slide-in from left */}
      <div 
        className={`md:hidden fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="h-full flex flex-col pt-20 px-6">
          <nav className="flex flex-col space-y-6 items-center mt-8">
            {[
              { name: 'HOME', path: '/', icon: Home },
              { name: 'US SISTERS', path: '/about' },
              { name: 'SHIPPING', path: '#delivery', icon: Package },
              { name: 'CONTACT', path: '#contact', icon: Mail }
            ].map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className="text-[#e90064] text-lg font-medium hover:text-[#c80056] transition-colors duration-300 flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Cart Button */}
            <Button 
              className="w-full mt-4" 
              size="lg"
              onClick={() => {
                setMobileMenuOpen(false);
                setCartOpen(true);
              }}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              CART ({totalItems})
            </Button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
