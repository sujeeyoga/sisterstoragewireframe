
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
        className={`w-full transition-all duration-300 z-50 relative ${
          isScrolled ? 'py-2' : 'py-4'
        } rounded-b-lg shadow-lg mx-4 mt-2`}
        style={{
          backgroundColor: `rgba(255, 255, 255, ${bgOpacity})`,
          backdropFilter: `blur(${backdropBlur}px)`,
          maxWidth: 'calc(100% - 2rem)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Back Button (only on mobile) */}
          {isMobile && (
            <button
              onClick={handleBack}
              className="mr-2 p-1.5 text-black focus:outline-none hover:bg-black/10 rounded transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          {/* Logo */}
          <Link to="/" className="relative z-10">
            <h1 
              className="text-[#E90064] font-bold transition-all duration-300"
              style={{ 
                transform: `scale(${isScrolled ? 0.95 : 1})`,
                letterSpacing: `${isScrolled ? '0' : '0.5px'}`
              }}
            >
              SISTER STORAGE
            </h1>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            {[
              { name: 'HOME', path: '/', icon: Home },
              { name: 'ABOUT US', path: '/about' },
              { name: 'SHIPPING', path: '#delivery', icon: Package },
              { name: 'SHOPPING CART', path: '#', icon: ShoppingBag, onClick: () => setCartOpen(true) }
            ].map((item) => (
              item.onClick ? (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className={`text-black hover:bg-pink-500 hover:text-white transition-colors duration-300 px-3 py-2 rounded-md font-medium ${item.icon ? 'flex items-center gap-2' : ''}`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.name} ({totalItems})
                </button>
              ) : (
                <Link 
                  key={item.name} 
                  to={item.path}
                  className={`text-black hover:bg-pink-500 hover:text-white transition-colors duration-300 px-3 py-2 rounded-md font-medium ${item.icon ? 'flex items-center gap-2' : ''}`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.name}
                </Link>
              )
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-1.5 text-black focus:outline-none z-60 relative hover:bg-black/10 rounded transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
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
      <div className="border-b border-pink-500 mx-4 relative z-40" style={{ maxWidth: 'calc(100% - 2rem)' }} />

      {/* Mobile Menu Slide-in from left with proper background and z-index */}
      <div 
        className={`md:hidden fixed inset-0 z-60 transform transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop blur overlay */}
        <div className="absolute inset-0 bg-white/98 backdrop-blur-md shadow-2xl border-r border-gray-200"></div>
        
        {/* Menu content */}
        <div className="relative h-full flex flex-col pt-28 px-8">
          <nav className="flex flex-col space-y-8 items-center mt-8">
            {[
              { name: 'HOME', path: '/', icon: Home },
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
      </div>
    </>
  );
};

export default Navbar;
